export type Country = "UK" | "PL" | "GE";
export type OrderFilter = "newest_first";
export type Currency = "PLN" | "EUR" | "GBP";

export const countryToCurrency: { [key in Country]: Currency } = {
    PL: "PLN", 
    GE: "EUR",  
    UK: "GBP"   
};