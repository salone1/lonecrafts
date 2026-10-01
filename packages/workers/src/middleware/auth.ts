import { Env } from '../index';

function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(str: string): ArrayBuffer {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const binary = atob(str + pad);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export async function generateJWT(payload: Record<string, any>, secret: string): Promise<string> {
  const header = base64urlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  })));

  const secretEncoded = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey('raw', secretEncoded, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${body}`));
  const sig = base64urlEncode(signature);

  return `${header}.${body}.${sig}`;
}

export async function verifyJWT(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [header, body, signature] = parts;

  try {
    const secretEncoded = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey('raw', secretEncoded, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const data = new TextEncoder().encode(`${header}.${body}`);

    const signatureBuffer = base64urlDecode(signature);
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBuffer, data);
    if (!isValid) return false;

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(body)));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const checkAuth = async (request: Request, env: Env): Promise<boolean> => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7);
  return await verifyJWT(token, env.JWT_SECRET);
};