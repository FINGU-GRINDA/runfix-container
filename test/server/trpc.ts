import { initTRPC } from "@trpc/server";
import { inferAsyncReturnType, TRPCError } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

/**
 * Create tRPC Context
 */
const createContext = ({ req, res }: CreateHTTPContextOptions) => {
  return { req, res };
};

type Context = inferAsyncReturnType<typeof createContext>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 */
export const createRouter = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Error Handling Middleware
 */
export const errorHandlerMiddleware = middleware(async ({ ctx, next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof TRPCError) {
      console.error("tRPC Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
});

export const protectedProcedure = t.procedure.use(errorHandlerMiddleware);
