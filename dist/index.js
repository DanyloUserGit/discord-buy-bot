"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const impl_1 = require("./utils/conventer/impl");
const conventer = new impl_1.ConventerImpl();
(async () => {
    await conventer.getCourse();
})();
