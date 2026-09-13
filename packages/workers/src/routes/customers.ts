import { Env } from '../index';
import { checkAuth } from '../middleware/auth';

export const customerRoutes = {
  list: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const query = `
      SELECT 
        c.id, c.name, c.email, c.phone,
        COALESCE(SUM(b.total), 0) as total_purchases,
        COALESCE(SUM(p.amount), 0) as total_payments,
        COALESCE(SUM(b.total), 0) - COALESCE(SUM(p.amount), 0) as outstanding_balance,
        COUNT(DISTINCT b.id) as bill_count
      FROM customers c
      LEFT JOIN bills b ON c.id = b.customer_id
      LEFT JOIN payments p ON b.id = p.bill_id
      GROUP BY c.id
      ORDER BY c.name
    `;

    const { results } = await env.DB.prepare(query).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  create: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { name, email, phone } = await request.json();
    const id = crypto.randomUUID();

    await env.DB.prepare(
      'INSERT INTO customers (id, name, email, phone, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, name, email, phone, new Date().toISOString()).run();

    return new Response(
      JSON.stringify({ id, name, email, phone }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  },

  getOne: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = (request as any).params as { id: string };

    const { results } = await env.DB.prepare(
      'SELECT * FROM customers WHERE id = ?'
    ).bind(id).all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(results[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
