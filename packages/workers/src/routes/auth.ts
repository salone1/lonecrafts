import { Env } from '../index';
import { generateJWT, verifyJWT } from '../middleware/auth';

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
