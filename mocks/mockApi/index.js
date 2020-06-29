"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mocks_1 = require("./mocks");
const PORT = process.env.PORT || 3001;
const app = express();
mocks_1.makeApp(app);
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
//# sourceMappingURL=index.js.map