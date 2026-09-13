import { Env } from '../index';
import { checkAuth } from '../middleware/auth';

export const productRoutes = {
  listPublic: async (request: Request, env: Env) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    let query = 'SELECT * FROM products WHERE active = 1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  listAdmin: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM products ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  create: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const tagNumber = formData.get('tagNumber');
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const image = formData.get('image') as File | null;

    let imageUrl = '';
    if (image) {
      const key = `products/${Date.now()}-${image.name}`;
      const buffer = await image.arrayBuffer();
      await env.MEDIA.put(key, buffer);
      imageUrl = key;
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO products (id, tag_number, name, description, category, image_url, active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
    ).bind(id, tagNumber, name, description, category, imageUrl, new Date().toISOString()).run();

    return new Response(
      JSON.stringify({ id, tagNumber, name, description, category, imageUrl, active: true }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  },

  update: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = (request as any).params as { id: string };
    const formData = await request.formData();
    const tagNumber = formData.get('tagNumber');
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const image = formData.get('image') as File | null;

    let updateQuery = 'UPDATE products SET tag_number = ?, name = ?, description = ?, category = ?';
    const params: any[] = [tagNumber, name, description, category];

    if (image) {
      const key = `products/${Date.now()}-${image.name}`;
      const buffer = await image.arrayBuffer();
      await env.MEDIA.put(key, buffer);
      updateQuery += ', image_url = ?';
      params.push(key);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await env.DB.prepare(updateQuery).bind(...params).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  toggle: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = (request as any).params as { id: string };
    const { active } = await request.json();

    await env.DB.prepare('UPDATE products SET active = ? WHERE id = ?')
      .bind(active ? 1 : 0, id)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  delete: async (request: Request, env: Env) => {
    if (!checkAuth(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = request.params as { id: string };
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
