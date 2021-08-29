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
var storeSecret = require('./db/secrets').storeSecret;
var MAX_LEN = require('./constants').MAX_LEN;
// @return errors
function getValidationErrors(secret) {
    if (typeof (secret) !== 'string')
        return 'Invalid data type';
    if (secret.length <= 0)
        return 'Invalid string length';
    if (secret.length > MAX_LEN)
        return 'Secret too long';
    return null;
}
function validateSecret(req, res, next) {
    var _a = req.body, secret = _a.secret, ttl = _a.ttl;
    var validationErrors = getValidationErrors(secret);
    if (validationErrors) {
        res.send(validationErrors);
    }
    else {
        if (ttl) {
            if (ttl < 0)
                ttl = null;
            else if (ttl > 30)
                ttl = 30;
            req.body.ttl = ttl;
        }
        next();
    }
}
function generateSecret(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, secret, passphrase, ttl, _b, insertedId, actualTTL, protocol, url;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, secret = _a.secret, passphrase = _a.passphrase, ttl = _a.ttl;
                    return [4 /*yield*/, storeSecret(secret, passphrase, ttl)];
                case 1:
                    _b = _c.sent(), insertedId = _b.insertedId, actualTTL = _b.ttl;
                    protocol = req.secure ? 'https' : 'http';
                    url = protocol + '://' + req.get('host') + '/view/' + insertedId;
                    res.render('generate', {
                        link: url,
                        ttl: actualTTL
                    });
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = [
    validateSecret,
    generateSecret
];
