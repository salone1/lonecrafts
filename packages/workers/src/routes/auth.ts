import { Env } from '../index';

const JWT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const authRoutes = {
  login: async (request: Request, env: Env) => {
    const { password } = await request.json();

    if (password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
      });
    }

    const token = await generateJWT({ role: 'admin' }, env.JWT_SECRET);
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },

  verify: async (request: Request, env: Env) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ valid: false }), { status: 401 });
    }

    const token = authHeader.slice(7);
    const valid = await verifyJWT(token, env.JWT_SECRET);

    return new Response(JSON.stringify({ valid }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

async function generateJWT(payload: Record<string, any>, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + JWT_EXPIRY }));
  const signature = btoa(secret);

  return `${header}.${body}.${signature}`;
}

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  const [_, body, signature] = token.split('.');

  if (signature !== btoa(secret)) {
    return false;
  }

  const payload = JSON.parse(atob(body));
  return payload.exp > Date.now();
}
