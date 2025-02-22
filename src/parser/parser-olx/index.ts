import { FilterOlx } from "./contracts";

export interface ParserOlx {
    connect: ()=>void;
    parse: ()=>void;
    autorun: ()=>void;
    generateUrl: ()=>void;
    setFilterVal: (val:{})=>void;
    addFilter: (filter:FilterOlx)=>void;
}