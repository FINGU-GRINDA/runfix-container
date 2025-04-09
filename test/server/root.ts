import { createRouter } from "./trpc";
import { translationRouter } from "./routes/translation";

/**
 * Root API Router
 */
export const appRouter = createRouter({
  translation: translationRouter,
});

export type AppRouter = typeof appRouter;
