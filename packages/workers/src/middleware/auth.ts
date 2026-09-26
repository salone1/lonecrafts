import { Env } from '../index';

function base64url_encode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64url_decode(str: string): string {
  const pad = '='.repeat(4 - (str.length % 4));
  return atob(str + pad);
}

export async function generateJWT(payload: Record<string, any>, secret: string): Promise<string> {
  const header = base64url_encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url_encode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }));
  const signature = base64url_encode(secret);
  return `${header}.${body}.${signature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
    const [_header, body, signature] = parts;
  if (signature !== base64url_encode(secret)) return false;
  try {
    const payload = JSON.parse(base64url_decode(body));
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