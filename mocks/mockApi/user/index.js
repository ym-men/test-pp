"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const utils_1 = require("../utils");
const storage_1 = require("./storage");
// import { getAllContractsList } from '../contracts/storage';
const getUserByProp = (propName, value) => storage_1.storage
    .getAll()
    .then(ramda_1.values)
    .then(list => ramda_1.filter(ramda_1.pathEq(['data', propName], value), list))
    .then(list => ramda_1.head(list));
exports.getUserByReq = (req) => {
    const token = utils_1.getToken(req);
    if (token) {
        return storage_1.storage
            .getAll()
            .then(ramda_1.values)
            .then(list => ramda_1.filter(ramda_1.whereEq({ token }), list))
            .then(list => ramda_1.head(list));
    }
    return Promise.resolve(null);
};
exports.getUserById = ramda_1.pipeP(personId => storage_1.storage.get(personId), ramda_1.prop('data'));
exports.default = [
    {
        url: '/api/v0/vst-identity/person/info',
        get: ({ req }) => exports.getUserByReq(req).then(ramda_1.prop('data')),
    },
    {
        url: '/api/v0/vst-oauth2/oauth/token',
        post: ({ req }) => {
            const grant_type = ramda_1.path(['body', 'grant_type'], req);
            const refresh_token = ramda_1.path(['body', 'refresh_token'], req);
            const email = ramda_1.path(['body', 'username'], req);
            const password = ramda_1.path(['body', 'password'], req);
            if (!grant_type) {
                throw new utils_1.RequestError(400);
            }
            if (grant_type === 'password' && (!email || !password)) {
                throw new utils_1.RequestError(400);
            }
            if (grant_type === 'refresh_token' && !refresh_token) {
                return new utils_1.RequestError(400);
            }
            let userPromise;
            if (grant_type === 'refresh_token') {
                userPromise = getUserByProp('personId', refresh_token.replace('-token', ''));
            }
            else {
                userPromise = getUserByProp('email', email);
            }
            return userPromise.then(userData => {
                if (!userData) {
                    throw new utils_1.RequestError(404);
                }
                // disable password
                // if (password && userData.password !== password) {
                //   throw new RequestError(400);
                // }
                const token = userData.data.personId;
                if (!userData.id) {
                    userData.id = userData.data.personId;
                }
                storage_1.storage.set(Object.assign({}, userData, { token }));
                return {
                    access_token: userData.data.personId,
                    token_type: 'bearer',
                    refresh_token: `${userData.data.personId}-token`,
                    expires_in: 43199,
                    scope: 'read vst-client',
                    jti: '4e995ac9-843f-4efb-8046-626899f9c8a3',
                };
            });
        },
    },
];
//# sourceMappingURL=index.js.map