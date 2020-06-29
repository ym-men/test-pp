"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthHeader = 'authorization';
class RequestError extends Error {
    constructor(status) {
        super(getStatusMessage(status));
        this.ok = status === 200;
        this.status = status;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}
exports.RequestError = RequestError;
function error(res, status) {
    res.status(status);
    res.json({ message: new RequestError(status).message });
}
exports.error = error;
function getStatusMessage(status) {
    switch (status) {
        case 404:
            return 'Not found';
        case 400:
            return 'Bad request';
        case 401:
            return 'Unauthorized';
        case 200:
            return 'Ok';
        default:
            return '';
    }
}
function randomInteger(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}
exports.randomInteger = randomInteger;
function getToken(req) {
    const token = req.headers[AuthHeader];
    return (token && token.replace('Basic ', '') && token.replace('Bearer ', '')) || null;
}
exports.getToken = getToken;
function isApi(req) {
    return req.url.includes('/api/');
}
exports.isApi = isApi;
exports.wrapHandler = (callback, timeoutMode) => (req, res) => {
    timeoutMode = timeoutMode || 'small';
    const urlParams = req.params || Object.create(null);
    const getParams = req.query || Object.create(null);
    const body = req.body;
    const start = Date.now();
    const applyError = (e) => {
        if (e instanceof RequestError) {
            res.status(e.status);
        }
        else {
            res.status(500);
        }
        res.json({ message: e.message });
    };
    const isJsonLike = (some) => {
        if (typeof some !== 'object') {
            return false;
        }
        if (Array.isArray(some)) {
            return true;
        }
        return some.constructor === Object;
    };
    const applyTimeout = (cb) => {
        const makeProxy = (min, max, func) => {
            const timeout = randomInteger(min, max);
            return (...args) => {
                const delta = timeout - (Date.now() - start);
                if (delta < 0) {
                    return func(...args);
                }
                else {
                    setTimeout(() => {
                        func(...args);
                    }, delta);
                }
            };
        };
        switch (timeoutMode) {
            case 'none':
                return cb;
            case 'small':
                return makeProxy(15, 300, cb);
            case 'long':
                return makeProxy(1500, 5000, cb);
        }
    };
    const applyResult = (data) => {
        if (isJsonLike(data)) {
            res.json(data);
        }
        else {
            res.end(data);
        }
    };
    try {
        const result = callback({ params: urlParams, query: getParams, body, req, res });
        if (result && 'then' in result && typeof result.then === 'function') {
            result.then(applyTimeout(applyResult), applyError);
        }
        else {
            applyResult(result);
        }
    }
    catch (e) {
        applyError(e);
    }
};
exports.addRoutes = (list, app) => {
    list.forEach(item => {
        if (item.get) {
            app.get(item.url, exports.wrapHandler(item.get));
        }
        if (item.post) {
            app.post(item.url, exports.wrapHandler(item.post));
        }
    });
};
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
exports.guid = guid;
function id4() {
    return s4();
}
exports.id4 = id4;
//# sourceMappingURL=index.js.map