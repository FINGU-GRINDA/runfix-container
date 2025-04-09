import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/root";
import { inferAsyncReturnType } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Create Context for API Requests
 */
const createContext = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return { req, res };
};

export type Context = inferAsyncReturnType<typeof createContext>;

/**
 * API handler
 */
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ path, error }) {
    console.error(`Error in tRPC handler at ${path}:`, error);
  },
});
