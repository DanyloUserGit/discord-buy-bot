import { Current } from "../../utils/conventer/contracts";
import { Filter, Item } from "./contracts";
import { Country } from "./contracts/types";

export interface ParserVinted {
    addFilter:(filter:Filter)=>void;
    parse:( time:number, country: Country)=>void;
    connect: (url:string)=>void;
    generateUrl: (current: Current)=>void;
    autorun: (url:string, time:number)=>void;
    setFilterValue: (val:{})=>void;
    setOauthToken: (token: string)=>void;
    autobuy: (item: Item)=>void;
}