"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        timeout: 'long',
        url: '/api/health',
        get: () => {
            return Promise.resolve('OK');
        },
    },
];
//# sourceMappingURL=index.js.map