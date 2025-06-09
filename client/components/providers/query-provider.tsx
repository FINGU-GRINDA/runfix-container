"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient();
export function QueryProvider({ children }: { children: ReactNode }) {
	// Create a new QueryClient instance for each request to prevent data leakage between requests

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
