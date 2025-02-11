import { Filter } from "./contracts";
import { Country } from "./contracts/types";

export interface ParserVinted {
    addFilter:(filter:Filter)=>void;
    parse:( time:number)=>void;
    connect: (country:Country)=>void;
    generateUrl: ()=>void;
    autorun: ()=>void;
    setCountry: (country: Country)=>void;
    setFilterValue: (val:{})=>void;
}