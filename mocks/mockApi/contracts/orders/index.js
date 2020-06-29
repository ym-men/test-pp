"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const storage_1 = require("../storage");
const storage_2 = require("../../controls/storage");
const storage_3 = require("./storage");
const utils_1 = require("../../utils");
exports.default = [
    {
        timeout: 'long',
        url: '/api/v0/vst-bb/orders',
        post: ({ body }) => storage_1.storage
            .get(body.contractId)
            .then(contract => {
            const order = Object.assign({}, body, { status: 'APPROVING', mtrs: (body.mtrs || []).map((item) => (Object.assign({}, item, { id: utils_1.guid(), status: 'APPROVING', pending: true }))) });
            return storage_3.storage
                .set(order, {
                mtrs: order.mtrs.map((mtr) => {
                    mtr.pending = false;
                    return mtr;
                }),
            })
                .then(created => {
                const orders = contract.orders || [];
                orders.push(created.id);
                const contractToUpd = Object.assign({}, contract, { orders });
                return storage_1.storage.set(contractToUpd).then(() => created);
            });
        })
            .catch(() => Promise.reject(new utils_1.RequestError(400))),
    },
    {
        timeout: 'small',
        url: '/api/v0/vst-bb/orders/:id',
        get: ({ params, req }) => storage_3.storage.get(params.id).then((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const mtrs = yield Promise.all(data.mtrs.map((mtr) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!mtr.inspectionNeeded || !mtr.inspectionId) {
                    return mtr;
                }
                const control = yield storage_2.storage.get(mtr.inspectionId);
                return Object.assign({}, mtr, { controlStatus: control.status, hasPermissionToShip: control.documents.some(doc => Number(doc.type) === 14), hasNotClosedNotify: control.documents.some((doc) => Number(doc.type) === 10 && (doc.status || '').toLowerCase() !== 'closed') });
            })));
            data.mtrs = mtrs;
            return data;
        })),
        post: ({ params, body }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const contract = yield storage_1.storage.get(body.contractId);
            const order = Object.assign({}, body, { status: 'APPROVING', mtrs: (body.mtrs || []).map((item) => item.code
                    ? item
                    : Object.assign({}, item, { pending: true, status: 'APPROVING' })) });
            // contractStorage.set(contract) to handle contract pending
            return storage_1.storage.set(contract).then(() => storage_3.storage.set(order, {
                mtrs: order.mtrs.map((mtr) => {
                    mtr.pending = false;
                    return mtr;
                }),
            }));
        }),
    },
    {
        url: '/api/v0/vst-bb/orders/:id/approve',
        post: ({ params, body }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const order = body;
            const contract = yield storage_1.storage.get(order.contractId);
            yield Promise.all(order.mtrs
                .filter((mtr) => mtr.inspectionNeeded)
                .map((mtr) => {
                const id = utils_1.guid();
                mtr.inspectionId = id;
                const control = {
                    id,
                    orderId: order.id,
                    orderNumber: order.number,
                    mtrCode: mtr.code,
                    contractNumber: contract.number,
                    meetingNeeded: false,
                    comments: [],
                    status: 'inspection_plan',
                    mtrName: mtr.name,
                    supplier: order.supplier,
                    volume: mtr.quantity,
                    quantity: mtr.quantity,
                    quantityType: mtr.quantityType,
                    inspector: mtr.inspector,
                    inspectors: [],
                    addresses: [],
                    dateStart: null,
                    dateEnd: null,
                    documents: [],
                };
                return storage_2.storage.set(control);
            }));
            return storage_1.storage.set(contract).then(() => storage_3.storage.set(order, {
                status: 'APPROVED',
                mtrs: order.mtrs.map((mtr) => {
                    mtr.pending = false;
                    return mtr;
                }),
            }));
        }),
    },
    {
        url: '/api/v0/vst-bb/orders/:id/reject',
        post: ({ params, body }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const order = Object.assign({}, body);
            const contract = yield storage_1.storage.get(order.contractId);
            return storage_1.storage.set(contract).then(() => storage_3.storage.set(order, {
                status: 'REJECTED',
                mtrs: order.mtrs.map((mtr) => {
                    mtr.pending = false;
                    return mtr;
                }),
            }));
        }),
    },
];
//# sourceMappingURL=index.js.map