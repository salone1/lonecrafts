import { Env } from '../index';
import { checkAuth } from '../middleware/auth';

export const billingRoutes = {
  list: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const query = `
      SELECT 
        b.*,
        c.name as customer_name,
        COALESCE(SUM(p.amount), 0) as paid_amount,
        b.total - COALESCE(SUM(p.amount), 0) as outstanding
      FROM bills b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN payments p ON b.id = p.bill_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT 100
    `;

    const { results } = await env.DB.prepare(query).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  getCustomerBills: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { customerId } = (request as any).params as { customerId: string };

    const query = `
      SELECT 
        b.*,
        COALESCE(SUM(p.amount), 0) as paid_amount,
        b.total - COALESCE(SUM(p.amount), 0) as outstanding
      FROM bills b
      LEFT JOIN payments p ON b.id = p.bill_id
      WHERE b.customer_id = ?
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `;

    const { results } = await env.DB.prepare(query).bind(customerId).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  create: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { customerId, items } = await request.json();
    const billId = crypto.randomUUID();
    const billNumber = `BILL-${Date.now()}`;
    
    let total = 0;
    const itemsData: any[] = [];

    for (const item of items) {
      const subtotal = item.quantity * item.rate;
      total += subtotal;
      itemsData.push({
        id: crypto.randomUUID(),
        billId,
        productId: item.productId,
        quantity: item.quantity,
        rate: item.rate,
        subtotal,
      });
    }

    // Create bill
    await env.DB.prepare(
      'INSERT INTO bills (id, bill_number, customer_id, total, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(billId, billNumber, customerId, total, new Date().toISOString()).run();

    // Create bill items
    for (const item of itemsData) {
      await env.DB.prepare(
        'INSERT INTO bill_items (id, bill_id, product_id, quantity, rate, subtotal) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(item.id, item.billId, item.productId, item.quantity, item.rate, item.subtotal).run();
    }

    return new Response(
      JSON.stringify({ id: billId, billNumber, total }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  },

  getOne: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = (request as any).params as { id: string };

    const { results: billResults } = await env.DB.prepare(
      'SELECT * FROM bills WHERE id = ?'
    ).bind(id).all();

    if (billResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    const { results: itemsResults } = await env.DB.prepare(
      'SELECT * FROM bill_items WHERE bill_id = ?'
    ).bind(id).all();

    const { results: paymentsResults } = await env.DB.prepare(
      'SELECT * FROM payments WHERE bill_id = ? ORDER BY created_at DESC'
    ).bind(id).all();

    return new Response(
      JSON.stringify({
        ...billResults[0],
        items: itemsResults,
        payments: paymentsResults,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  },

  addPayment: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = (request as any).params as { id: string };
    const { amount } = await request.json();
    const paymentId = crypto.randomUUID();

    await env.DB.prepare(
      'INSERT INTO payments (id, bill_id, amount, created_at) VALUES (?, ?, ?, ?)'
    ).bind(paymentId, id, amount, new Date().toISOString()).run();

    return new Response(
      JSON.stringify({ id: paymentId, amount }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  },
};
