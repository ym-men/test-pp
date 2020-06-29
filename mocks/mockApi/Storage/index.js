"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const utils_1 = require("../utils");
class Storage {
    constructor(path) {
        this.path = path;
        this.promise = this.read()
            .catch(() => Object.create(null))
            .then(data => {
            this.data = Object.assign(Object.create(null), data);
            return data;
        });
    }
    getAll() {
        if (this.data) {
            return Promise.resolve(Object.assign({}, this.data));
        }
        else {
            return this.promise.then(data => (Object.assign({}, data)));
        }
    }
    get(key) {
        const get = (data) => {
            if (key in data) {
                return Promise.resolve(data[key]);
            }
            else {
                return Promise.reject(new utils_1.RequestError(404));
            }
        };
        if (this.data) {
            return get(this.data);
        }
        else {
            return this.promise.then(get);
        }
    }
    set(value, pendingResolve = {}) {
        if (this.data) {
            if (!value.id) {
                value.id = utils_1.guid();
            }
            const key = value.id;
            value.pending = true;
            value.modified = new Date();
            this.data[key] = value;
            setTimeout(() => {
                if (this.data) {
                    this.data[key] = Object.assign({}, value, pendingResolve, { pending: false, modified: new Date() });
                }
                // TODO: send pending notification
            }, 2e3);
            return this.write().then(() => value);
        }
        return this.promise.then(() => this.set(value, pendingResolve));
    }
    read() {
        return fs_extra_1.readJSON(this.path);
    }
    write() {
        return fs_extra_1.outputFile(this.path, JSON.stringify(this.data, null, 2));
    }
}
exports.Storage = Storage;
//# sourceMappingURL=index.js.map