"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../types.d.ts"/>
const fs_extra_1 = require("fs-extra");
const storage_1 = require("./storage");
const path_1 = require("path");
const utils_1 = require("../utils");
const imageStorageDist = path_1.resolve(__dirname, '..', 'db', 'images');
exports.default = [
    {
        url: '/api/v0/vst-files/file/:fileId',
        get: ({ params }) => Promise.all([storage_1.storage.getAll()]).then(([files]) => {
            const data = Object.values(files).find(file => file.id === params.fileId);
            if (!data) {
                throw new utils_1.RequestError(401);
            }
            return fs_extra_1.readFile(path_1.resolve(__dirname, '..', 'db', 'images', `${data.name}`));
        }),
    },
    {
        url: '/api/v0/vst-files/file/upload',
        post: ({ req }) => {
            const fileData = (req.files || {}).file;
            const { path, name, size } = fileData;
            const hash = utils_1.guid();
            return storage_1.storage
                .set({
                name,
                size,
                date: new Date().toISOString(),
                id: hash,
            })
                .then(() => fs_extra_1.move(path, path_1.resolve(imageStorageDist, name), {
                overwrite: true,
            }))
                .then(() => storage_1.storage.get(hash));
        },
    },
];
//# sourceMappingURL=index.js.map