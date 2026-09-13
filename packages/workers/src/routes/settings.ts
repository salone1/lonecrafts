import { Env } from '../index';

export const settingsRoutes = {
  getPublic: async (request: Request, env: Env) => {
    return new Response(
      JSON.stringify({
        whatsappNumber: env.WHATSAPP_NUMBER,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
