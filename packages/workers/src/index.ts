import { Router } from 'itty-router';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { customerRoutes } from './routes/customers';
import { billingRoutes } from './routes/billing';
import { settingsRoutes } from './routes/settings';

// Cloudflare Workers types
interface D1Database {
  prepare(query: string): any;
}
interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream): Promise<any>;
}

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  ADMIN_PASSWORD: string;
  WHATSAPP_NUMBER: string;
  JWT_SECRET: string;
}

const router = Router();

// Health check
router.get('/api/health', () => new Response('OK'));

// Public routes
router.get('/api/products', productRoutes.listPublic);
router.get('/api/settings', settingsRoutes.getPublic);

// Auth routes
router.post('/api/auth/login', authRoutes.login);
router.post('/api/auth/verify', authRoutes.verify);

// Admin routes (requires auth)
router.get('/api/admin/products', productRoutes.listAdmin);
router.post('/api/admin/products', productRoutes.create);
router.put('/api/admin/products/:id', productRoutes.update);
router.patch('/api/admin/products/:id', productRoutes.toggle);
router.delete('/api/admin/products/:id', productRoutes.delete);

router.get('/api/admin/customers', customerRoutes.list);
router.post('/api/admin/customers', customerRoutes.create);
router.get('/api/admin/customers/:id', customerRoutes.getOne);
router.get('/api/admin/customers/:customerId/bills', billingRoutes.getCustomerBills);

router.get('/api/admin/bills', billingRoutes.list);
router.post('/api/admin/bills', billingRoutes.create);
router.get('/api/admin/bills/:id', billingRoutes.getOne);
router.post('/api/admin/bills/:id/payments', billingRoutes.addPayment);

// Error handling
router.all('*', () => new Response('Not Found', { status: 404 }));

export default router;
