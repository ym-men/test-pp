"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function read() {
    return fs_extra_1.readJSON(path_1.resolve(__dirname, '..', 'db', 'catalogs.json'));
}
exports.default = [
    {
        url: '/api/v0/vst-bb/catalogs',
        get: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { contractTypes, documentTypes, transportTypes, quantityTypes, fixingTypes, } = yield read();
            return { contractTypes, documentTypes, transportTypes, quantityTypes, fixingTypes };
        }),
    },
    {
        url: '/api/v0/vst-identity/company',
        get: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { organizations } = yield read();
            return organizations;
        }),
    },
];
//# sourceMappingURL=index.js.map