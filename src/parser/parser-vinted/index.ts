import { Filter } from "./contracts";
import { Country } from "./contracts/types";

export interface ParserVinted {
    addFilter:(filter:Filter)=>void;
    parse:(country: Country, time:number)=>void;
    connect: (country:Country)=>void;
    generateUrl: (country:Country)=>void;
    autorun: (country: Country)=>void;
}