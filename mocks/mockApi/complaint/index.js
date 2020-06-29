"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const storage_1 = require("./storage");
const storage_2 = require("../delivery/storage");
const storage_3 = require("../contracts/orders/storage");
exports.default = [
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/complaints',
        get: ({ query }) => {
            const limit = Number(query.limit) || 20;
            const offset = Number(query.offset) || 0;
            return storage_1.storage
                .getAll()
                .then(complaints => Object.values(complaints))
                .then((list) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield Promise.all(list.map((complaint) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const delivery = yield storage_2.storage.get(String(complaint.deliveryId));
                    const order = yield storage_3.storage.get(delivery.orderId);
                    const mtr = order && order.mtrs.find((m) => m.id === delivery.mtrId);
                    return Object.assign({}, complaint, { supplier: order.supplier, receiver: mtr && mtr.receiver, contractId: order.contractId, contractNumber: order.contractNumber, orderId: order.id, orderNumber: order.number, mtrCode: mtr && mtr.code, mtrId: mtr && mtr.id, mtrName: mtr && mtr.name, deliveryNumber: delivery.number });
                })));
            }))
                .then((complaints) => ({
                limit,
                offset,
                total: complaints.length,
                content: complaints.slice(offset, limit + offset),
            }));
        },
        post: ({ body }) => Promise.resolve()
            .then(() => {
            const toCreate = Object.assign({ deliveryId: '', status: 'representative', complaintDate: new Date().toISOString(), comissionDate: new Date().toISOString(), representativeName: '', representativePosition: '', representativeMissing: false, fixingMethod: '', fixingMethodCounter: 1, comments: [], documents: [] }, body);
            return storage_1.storage.set(toCreate);
        })
            .then(complaint => {
            return storage_2.storage
                .get(complaint.deliveryId)
                .then(delivery => storage_2.storage.set(Object.assign({}, delivery, { complaintId: complaint.id })));
        }),
    },
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/complaints/:complaintId',
        get: ({ params, req }) => storage_1.storage.get(params.complaintId).then(complaint => complaint),
        post: ({ params, body }) => {
            return storage_1.storage
                .get(params.complaintId)
                .then(complaint => storage_1.storage.set(Object.assign({}, complaint, body)));
        },
    },
];
//# sourceMappingURL=index.js.map