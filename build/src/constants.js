"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SECRET_TTL = exports.DB_SERVER_TIMEOUT_MS = exports.MONGO_INDEX_TTL = exports.MONGO_TABLE = exports.MONGO_URL = exports.PORT = exports.MAX_LEN = void 0;
exports.MAX_LEN = parseInt(process.env.MAX_LEN) || 1024;
exports.PORT = parseInt(process.env.PORT) || 3000;
exports.MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
exports.MONGO_TABLE = 'secrets';
exports.MONGO_INDEX_TTL = 'expiresAtTTL';
exports.DB_SERVER_TIMEOUT_MS = (function () {
    var timeout = process.env.DB_SERVER_TIMEOUT_MS;
    return timeout ? parseInt(timeout) : null;
})();
exports.DEFAULT_SECRET_TTL = (function () {
    var ttl = process.env.DEFAULT_SECRET_TTL;
    return ttl ? parseInt(ttl) : 7;
})();
//# sourceMappingURL=constants.js.map