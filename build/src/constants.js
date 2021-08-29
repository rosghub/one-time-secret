"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    MAX_LEN: parseInt(process.env.MAX_LEN) || 1024,
    PORT: parseInt(process.env.PORT) || 3000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    MONGO_TABLE: 'secrets',
    MONGO_INDEX_TTL: 'expiresAtTTL',
    DB_SERVER_TIMEOUT_MS: (function () {
        var timeout = process.env.DB_SERVER_TIMEOUT_MS;
        return timeout ? parseInt(timeout) : null;
    })(),
    DEFAULT_SECRET_TTL: (function () {
        var ttl = process.env.DEFAULT_SECRET_TTL;
        return ttl ? parseInt(ttl) : 7;
    })()
};
//# sourceMappingURL=constants.js.map