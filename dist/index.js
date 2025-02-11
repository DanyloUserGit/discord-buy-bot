"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const impl_1 = require("./parser/parser-vinted/impl");
const parser = new impl_1.ParserVintedImpl();
parser.addFilter({
    order: "newest_first",
    disabled_personalization: true,
    page: 1,
    time: 1738850547
});
parser.autorun("PL");
