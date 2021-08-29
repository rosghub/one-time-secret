export const MAX_LEN = parseInt(process.env.MAX_LEN) || 1024;

export const PORT = parseInt(process.env.PORT) || 3000;

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

export const MONGO_TABLE = 'secrets';

export const MONGO_INDEX_TTL = 'expiresAtTTL';

export const DB_SERVER_TIMEOUT_MS = (() => {
    const timeout = process.env.DB_SERVER_TIMEOUT_MS;
    return timeout ? parseInt(timeout) : null;
})();

export const DEFAULT_SECRET_TTL = (() => {
    const ttl = process.env.DEFAULT_SECRET_TTL;
    return ttl ? parseInt(ttl) : 7;
})();