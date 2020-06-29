"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const storage_1 = require("./storage");
const user_1 = require("../user");
const utils_1 = require("../utils");
exports.default = [
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/deliveries/contracts/:contractId/orders/:orderId/mtrs/:mtrId',
        get: ({ params, query, req }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const limit = Number(query.limit) || 20;
            const offset = Number(query.offset) || 0;
            const user = yield user_1.getUserByReq(req);
            if (!user) {
                throw new utils_1.RequestError(401);
            }
            return storage_1.storage
                .getAll()
                .then(deliveries => Object.values(deliveries).filter(item => item.mtrId === params.mtrId))
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
        timeout: 'long',
        url: '/api/v0/vst-bb/deliveries',
        get: ({ query }) => {
            const limit = Number(query.limit) || 20;
            const offset = Number(query.offset) || 0;
            return storage_1.storage
                .getAll()
                .then(deliveries => Object.values(deliveries))
                .then((list) => ({
                limit,
                offset,
                total: list.length,
                content: list.slice(offset, limit + offset),
            }));
        },
    },
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/contracts/:contractId/orders/:orderId/deliveries',
        post: ({ body }) => Promise.resolve().then(() => {
            const toCreate = Object.assign({ status: 'delivery', number: '', mtrName: '', mtrCode: '', orderNumber: '', contractNumber: '', supplier: '', transportType: '', transportId: '', comments: [], documents: [], locationList: [] }, body);
            return storage_1.storage.set(toCreate);
        }),
    },
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/deliveries/:id',
        get: ({ params, req }) => storage_1.storage.get(params.id),
        post: ({ params, body }) => {
            if (body.params) {
                console.log('FOUND_DELIVERY_UPDATE_PARAMS', body.params);
            }
            return storage_1.storage.get(params.id).then(delivery => storage_1.storage.set(Object.assign({}, delivery, body)));
        },
    },
];
//# sourceMappingURL=index.js.map