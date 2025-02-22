export interface FilterOlx {
    nav: {
        category: string,
        subcategory: string[]
    }
    price_from?:number;
    price_to?:number;
    brand?: string[];    
}
export interface ItemOlx {
    title: string;
    size: string;
    price: string;
    link: string;
    image: string;
}