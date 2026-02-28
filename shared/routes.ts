import { z } from "zod";
import { orders, products, users, stores } from "./schema";

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
      method: "POST" as const,
      path: "/api/auth/login" as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: "POST" as const,
      path: "/api/auth/register" as const,
      input: z.object({
        email: z.string().email(),
        password: z.string(),
        displayName: z.string(),
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout" as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/auth/me" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    forgotPassword: {
      method: "POST" as const,
      path: "/api/auth/forgot-password" as const,
      input: z.object({ email: z.string().email() }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
  stores: {
    create: {
      method: "POST" as const,
      path: "/api/stores" as const,
      input: z.any(),
      responses: {
        201: z.custom<typeof stores.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    getMine: {
      method: "GET" as const,
      path: "/api/stores/me" as const,
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    getBySlug: {
      method: "GET" as const,
      path: "/api/stores/:slug" as const,
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/stores/:id" as const,
      input: z.any(),
      responses: {
        200: z.custom<typeof stores.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  orders: {
    create: {
      method: "POST" as const,
      path: "/api/orders" as const,
      input: z.any(),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    getMine: {
      method: "GET" as const,
      path: "/api/orders" as const,
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    getStoreOrders: {
      method: "GET" as const,
      path: "/api/stores/:storeId/orders" as const,
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/orders/:id/status" as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
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
