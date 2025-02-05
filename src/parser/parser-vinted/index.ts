import { Filter } from "./contracts";
import { Country } from "./contracts/types";

export interface ParserVinted {
    addFilter:(filter:Filter)=>void;
    parse:()=>Response;
    connect: (country:Country)=>void;
}