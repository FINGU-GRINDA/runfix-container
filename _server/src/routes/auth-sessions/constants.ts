/**
 * Human-readable title for your website
 */
export const rpName = "Trade Idea Generator";
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
export const rpID = process.env.CLIENT_DOMAIN!;
/**
 * The URLs at which registrations and authentications should occur.
 * We support both the base domain and the client port (Next.js typically runs on 3000).
 * Do NOT include any trailing /
 */
export const origin = process.env.CLIENT_RPID!;
