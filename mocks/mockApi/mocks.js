"use strict";
/// <reference path="./interface.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const formData = require("express-form-data");
const utils_1 = require("./utils");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
// import { requestDelay } from './middlewares/requestDelay';
const user_1 = require("./user");
const image_1 = require("./image");
const contracts_1 = require("./contracts");
const catalogs_1 = require("./catalogs");
const controls_1 = require("./controls");
const delivery_1 = require("./delivery");
const health_1 = require("./health");
const complaint_1 = require("./complaint");
try {
    fs_extra_1.mkdirSync(path_1.join(__dirname, 'tmp'));
}
catch (e) {
    console.log('tmp directory is available');
}
function makeApp(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.raw());
    app.use(bodyParser.json());
    app.use(cookieParser());
    // app.use(requestDelay);
    app.use(formData.parse({
        uploadDir: path_1.join(__dirname, 'tmp'),
        autoClean: false,
    }));
    app.use(formData.format());
    // app.use(formData.stream());
    // app.use(formData.union());
    utils_1.addRoutes([
        ...user_1.default,
        ...contracts_1.default,
        ...controls_1.default,
        ...image_1.default,
        ...catalogs_1.default,
        ...delivery_1.default,
        ...health_1.default,
        ...complaint_1.default,
    ], app);
    app.use((req, res, next) => {
        if (req.url.includes('/api/')) {
            utils_1.error(res, 404);
        }
        else {
            next();
        }
    });
    if (process.env.NODE_ENV === 'production') {
        const p = path_1.resolve(__dirname, '..', '..', 'build');
        app.use(express.static(p));
        app.use((req, res) => {
            fs.createReadStream(path_1.resolve(p, 'index.html')).pipe(res);
        });
    }
}
exports.makeApp = makeApp;
//# sourceMappingURL=mocks.js.map