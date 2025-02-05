import { Filter } from './contracts';
import { Country } from './contracts/types';
import { ParserVinted } from './index';
export class ParserVintedImpl implements ParserVinted{
    private urls: {}[];

    constructor () {
        this.urls = [
            {"UK":"https://vinted.co.uk/"},
            {"PL":"https://www.vinted.pl/"},
            {"GE":"https://vinted.de/"}
        ]
    }
    connect(country: Country){

    };
    addFilter(filter: Filter) {

    };
    parse(){
        return {} as Response;
    };
}