import { Country, OrderFilter } from "./types";

export interface Filter {
    order: OrderFilter;
    disabled_personalization:boolean;
    page: number;
    time:number;
}

export interface Item {
    price: string;
    link: string;
    image_url: string;
    name: string;
    country: Country;
    time:number;
    size: string;
}