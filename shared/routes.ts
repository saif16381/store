import { z } from 'zod';
import { users, stores, loginSchema, registerSchema, forgotPasswordSchema, insertStoreSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: registerSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    forgotPassword: {
      method: 'POST' as const,
      path: '/api/auth/forgot-password' as const,
      input: forgotPasswordSchema,
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      }
    }
  },
  stores: {
    create: {
      method: 'POST' as const,
      path: '/api/stores' as const,
      input: insertStoreSchema,
      responses: {
        201: z.custom<typeof stores.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    getMine: {
      method: 'GET' as const,
      path: '/api/stores/me' as const,
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      }
    },
    getBySlug: {
      method: 'GET' as const,
      path: '/api/stores/:slug' as const,
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/stores/:id' as const,
      input: insertStoreSchema.partial(),
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LoginInput = z.infer<typeof api.auth.login.input>;
export type RegisterInput = z.infer<typeof api.auth.register.input>;
export type AuthResponse = z.infer<typeof api.auth.login.responses[200]>;
export type StoreResponse = z.infer<typeof api.stores.create.responses[201]>;
