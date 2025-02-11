import { ParserVintedImpl } from "./parser/parser-vinted/impl";

const parser = new ParserVintedImpl();

parser.addFilter({
    order: "newest_first",
    disabled_personalization:true,
    page: 1,
    time:1738850547
});
parser.autorun("PL")