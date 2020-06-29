"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const storage_1 = require("./storage");
const ramda_1 = require("ramda");
const user_1 = require("../user");
const utils_1 = require("../utils");
exports.default = [
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/controls',
        get: ({ query, req }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const limit = Number(query.limit) || 20;
            const offset = Number(query.offset) || 0;
            const user = yield user_1.getUserByReq(req);
            if (!user) {
                throw new utils_1.RequestError(401);
            }
            return storage_1.storage
                .getAll()
                .then(ramda_1.values)
                .then(list => ({
                limit,
                offset,
                total: list.length,
                content: list
                    .filter(c => {
                    return user.data.companyId ? user.data.companyId === c.supplier : true;
                })
                    .slice(offset, limit + offset),
            }));
        }),
    },
    {
        timeout: 'small',
        url: '/api/v0/vst-bb/controls/:id',
        get: ({ params }) => storage_1.storage.get(params.id),
        post: ({ body }) => storage_1.storage.set(body),
    },
    {
        timeout: 'small',
        url: '/api/v0/vst-bb/controls/:controlId/document/:documentId',
        post: ({ params, body }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const control = yield storage_1.storage.get(params.controlId);
            const doc = control.documents.find(d => d.id === body.id);
            Object.assign(doc, body);
            return storage_1.storage.set(control);
        }),
    },
];
//# sourceMappingURL=index.js.map