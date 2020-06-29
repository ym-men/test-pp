"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const orders_1 = require("./orders");
const storage_1 = require("./storage");
const storage_2 = require("./orders/storage");
const user_1 = require("../user");
const utils_1 = require("../utils");
exports.getFullContract = contractId => {
    return storage_1.storage.get(contractId).then(contract => {
        return Promise.all((contract.orders || []).map(id => storage_2.storage.get(String(id)))).then(orders => {
            return Object.assign({}, contract, { orders });
        });
    });
};
exports.default = [
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/contracts',
        get: ({ query, req }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const limit = Number(query.limit) || 20;
            const offset = Number(query.offset) || 0;
            const user = yield user_1.getUserByReq(req);
            if (!user) {
                throw new utils_1.RequestError(401);
            }
            return storage_1.getAllContractsList()
                .then(list => list.map(contract => (Object.assign({}, contract, { comments: contract.comments || [] }))))
                .then(list => list
                .filter(c => {
                return user.data.companyId ? user.data.companyId === c.supplier : true;
            })
                .slice(offset, limit + offset))
                .then(list => Promise.all(list.map(contract => exports.getFullContract(contract.id))))
                .then(list => ({
                limit,
                offset,
                total: list.length,
                content: list,
            }));
            //
        }),
        post: ({ body }) => {
            return storage_1.storage.set(Object.assign({}, body, { status: 'APPROVING', orders: [] }));
        },
    },
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/contracts/:id',
        get: ({ params, req }) => exports.getFullContract(params.id),
        post: ({ params, body, req }) => storage_1.storage
            .get(params.id)
            .then(() => {
            const item = Object.assign({}, body, { status: 'APPROVING' });
            return storage_1.storage.set(item);
        })
            .then(() => exports.getFullContract(params.id)),
    },
    {
        url: '/api/v0/vst-bb/contracts/:id/approve',
        post: ({ params, body, req }) => Promise.resolve()
            .then(() => {
            const contract = body;
            return storage_1.storage.set(contract, { status: 'APPROVED' });
        })
            .then(() => exports.getFullContract(params.id)),
    },
    {
        url: '/api/v0/vst-bb/contracts/:id/reject',
        post: ({ params, body, req }) => Promise.resolve()
            .then(() => {
            const contract = body;
            return storage_1.storage.set(contract, { status: 'REJECTED' });
        })
            .then(() => exports.getFullContract(params.id)),
    },
    ...orders_1.default,
];
//# sourceMappingURL=index.js.map