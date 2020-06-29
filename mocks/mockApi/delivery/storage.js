"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("../Storage");
const path_1 = require("path");
exports.storage = new Storage_1.Storage(path_1.resolve(__dirname, '..', 'db', 'delivery.json'));
//# sourceMappingURL=storage.js.map