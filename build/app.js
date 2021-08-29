"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var constants = require("./src/constants");
var db_1 = require("./src/db/db");
var express = require("express");
var generate = require("./src/generate");
var view = require("./src/view");
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
app.post('/generate', generate);
app.use('/view', view);
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
module.exports = app;
//# sourceMappingURL=app.js.map