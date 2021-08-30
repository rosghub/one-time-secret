"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require("express");
var constants = require("./constants");
var db_1 = require("./db/db");
var generate_1 = require("./generate");
var view_1 = require("./view");
var app = express();
app.set('trust proxy', '127.0.0.1');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// Redirect http to https in production
app.use(function (req, res, next) {
    if (!req.secure && process.env.NODE_ENV == 'production')
        return res.redirect('https://' + req.get('host') + req.url);
    next();
});
app.get('/', function (_req, res) {
    res.render('index', { maxLen: constants.MAX_LEN });
});
app.post('/generate', generate_1.default);
app.use('/view', view_1.default);
app.use(function (_req, res) {
    res.status(404);
    res.render('error');
});
(0, db_1.connectDB)().then(function (_a) {
    var success = _a.success;
    if (success) {
        app.listen(constants.PORT, '127.0.0.1', function () {
            app.emit('started');
        });
        console.log('listening at port: ' + constants.PORT);
    }
    else
        console.log('DB connection failed, aborted.');
});
exports.default = app;
//# sourceMappingURL=app.js.map