import { Country, Currency, OrderFilter } from "./types";

export interface Filter {
    order: OrderFilter;
    disabled_personalization:boolean;
    page: number;
    brand_ids?:number[];
    catalog?:number[];
    price_from?: number;
    price_to?: number;
    currency?: Currency;
    time:number;
}
export interface Item {
    id: string;
    price: string;
    link: string;
    image_url: string;
    name: string;
    country: Country;
    time:number;
    size: string;
}