import { filterShafa } from "./contracts";

export interface ParserShafa {
    generateUrl: ()=>void;
    connect: ()=>void;
    autorun: ()=>void;
    parse: ()=>void;
    setFilterVal: (val:{})=>void;
    addFilter: (filter:filterShafa)=>void;
}