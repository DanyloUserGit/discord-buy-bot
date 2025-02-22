import { Country } from "../../parser/parser-vinted/contracts/types";
import { Current } from "./contracts";

export interface Conventer {
    getCourse: () => void;
    convertTo: (country: Country, current:Current, val: number) => number;
    convertFrom: (country: Country, current:Current, val: number) => number;
}