import { Env } from '../index';

export const settingsRoutes = {
    getPublic: async (_request: Request, env: Env) => {
    return new Response(
      JSON.stringify({
        whatsappNumber: env.WHATSAPP_NUMBER,
        additionalWhatsappNumber: env.WHATSAPP_NUMBER_ADDITIONAL,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
