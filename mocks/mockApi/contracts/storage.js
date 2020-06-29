"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("../Storage");
const path_1 = require("path");
const ramda_1 = require("ramda");
exports.storage = new Storage_1.Storage(path_1.resolve(__dirname, '../', 'db', 'contracts.json'));
exports.getAllContractsList = () => exports.storage.getAll().then(ramda_1.values);
//# sourceMappingURL=storage.js.map