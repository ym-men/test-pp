"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDelay = (req, res, next) => {
    if (req.method === 'GET') {
        next();
    }
    else {
        setTimeout(next, 1000);
    }
};
//# sourceMappingURL=requestDelay.js.map