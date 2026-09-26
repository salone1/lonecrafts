// Tigris S3-compatible upload helper (AWS Signature Version 4)
// Works in Cloudflare Workers with nodejs_compat enabled

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// SHA-256 hash via Web Crypto
async function sha256(data: ArrayBuffer | string): Promise<string> {
  const buf = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return bufferToHex(digest);
}

// HMAC-SHA256 via Web Crypto
async function hmacSha256(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

// Build AWS SigV4 signing key
async function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
    const kDate = await hmacSha256(
    new TextEncoder().encode(`AWS4${secretKey}`).buffer as ArrayBuffer,
    dateStamp
  );
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}

// Main upload function
export async function uploadToTigris(
  env: {
    TIGRIS_ENDPOINT_URL: string;
    TIGRIS_ACCESS_KEY_ID: string;
    TIGRIS_SECRET_ACCESS_KEY: string;
    TIGRIS_BUCKET: string;
  },
  key: string,
  body: ArrayBuffer,
  contentType = 'application/octet-stream'
): Promise<void> {
  const endpoint = env.TIGRIS_ENDPOINT_URL.replace(/\/$/, '');
  const bucket = env.TIGRIS_BUCKET;
  const accessKey = env.TIGRIS_ACCESS_KEY_ID;
  const secretKey = env.TIGRIS_SECRET_ACCESS_KEY;

  // Use path-style URL: https://t3.storage.dev/bucket/key
  const url = `${endpoint}/${bucket}/${encodeURIComponent(key)}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD
  const region = 'auto'; // Tigris uses "auto"
  const service = 's3';

  const payloadHash = await sha256(body);

  // Canonical request
  const canonicalHeaders = `host:${new URL(endpoint).host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = [
    'PUT',
    `/${bucket}/${encodeURIComponent(key)}`,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join('\n');

  const signingKey = await getSigningKey(secretKey, dateStamp, region, service);
  const signature = bufferToHex(await hmacSha256(signingKey, stringToSign));

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Host': new URL(endpoint).host,
      'X-Amz-Date': amzDate,
      'X-Amz-Content-SHA256': payloadHash,
      'Authorization': authorization,
      'Content-Type': contentType,
      'Content-Length': body.byteLength.toString(),
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Tigris upload failed (${response.status}): ${text}`);
  }
}

// Tigris uses the same path-style URL pattern: https://t3.storage.dev/bucket/key