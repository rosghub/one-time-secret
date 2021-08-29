"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var constants_1 = require("./../constants");
var MONGO_URL = constants_1.default.MONGO_URL, MONGO_TABLE = constants_1.default.MONGO_TABLE, MONGO_INDEX_TTL = constants_1.default.MONGO_INDEX_TTL, DB_SERVER_TIMEOUT_MS = constants_1.default.DB_SERVER_TIMEOUT_MS;
var client = new mongodb_1.MongoClient(MONGO_URL, {
    serverSelectionTimeoutMS: DB_SERVER_TIMEOUT_MS
});
var db = client.db(MONGO_TABLE);
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            console.log('Establing DB connection...');
            return [2 /*return*/, client.connect().then(function (client) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('Mongo connection successful');
                                return [4 /*yield*/, checkIndexes()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, {
                                        success: true,
                                        client: client
                                    }];
                        }
                    });
                }); }).catch(function (err) {
                    console.error(err);
                    console.log('Mongo connection failed');
                    return {
                        success: false,
                        client: null
                    };
                })];
        });
    });
}
function checkIndexes() {
    return __awaiter(this, void 0, void 0, function () {
        var indexes, exists, name_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.db(MONGO_TABLE).collection('secrets').indexes()];
                case 1:
                    indexes = _a.sent();
                    exists = indexes.find(function (e) { return e.name == MONGO_INDEX_TTL; });
                    if (!!exists) return [3 /*break*/, 3];
                    console.log('Index TTL missing, creating it now');
                    return [4 /*yield*/, db.collection('secrets').createIndex({ expiresAt: 1 }, {
                            expireAfterSeconds: 0,
                            name: MONGO_INDEX_TTL
                        })];
                case 2:
                    name_1 = _a.sent();
                    if (name_1 == MONGO_INDEX_TTL)
                        console.log('Index TTL created');
                    return [3 /*break*/, 4];
                case 3:
                    console.log('Index TTL exists');
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    db: db,
    connectDB: connectDB
};
//# sourceMappingURL=db.js.map