import { Country } from "../../parser/parser-vinted/contracts/types";

export interface Conventer {
    getCourse: () => void;
    convertTo: (country: Country) => number;
    convertFrom: (country: Country) => number;
}