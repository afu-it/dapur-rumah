export type Env = {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    FRONTEND_URL: string;
    ALLOWED_ORIGINS?: string;
    WORKER_URL: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
};

