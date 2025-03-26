export const getApiKey = (params: { headers: Headers }) => {
  const apiKey = params.headers.get("x-api-key");
  if (!apiKey) {
    throw new Error("Missing API key");
  }
  return apiKey;
};

export const logApiKeyUsage = async (params: {
  apiKey: string;
  headers: Headers;
  body: unknown;
}) => {
  // TODO: Implement logging
  // TODO: log apiKey usage
};

export const isRateLimited = async (params: {
  apiKey: string;
  headers: Headers;
  body: unknown;
}) => {
  // TODO: Implement rate limiting
  // TODO: Check if apiKey is rate limited
  return false;
};
