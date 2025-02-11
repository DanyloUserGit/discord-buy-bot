export type Country = "UK" | "PL" | "GE";
export type OrderFilter = "newest_first";
export type Currency = "PLN" | "EUR" | "GBP";

export const countryToCurrency: { [key in Country]: Currency } = {
    PL: "PLN", 
    GE: "EUR",  
    UK: "GBP"   
};

export const brandIds: number[] = [
    7, 12, 10187, 181840, 172724, 364278, 309178, 53, 14, 2287, 94160, 140, 105, 
    46165, 61952, 18005, 41, 23141, 11425, 378045, 13807, 187704, 10391840, 9, 
    4690593, 268284, 316157, 94, 184952, 15, 131, 34, 393, 297, 13227, 270372, 
    142508, 938584, 20, 320693, 4691219, 331, 10, 49455, 535, 41711, 174, 
    177880, 49, 14811
  ];
  
  export const brands: string[] = [
    "H&M", "Zara", "Reserved", "Sinsay", "Shein", "Cool Club", "Pepco", "Nike",
    "adidas", "Next", "Butik", "Bershka", "Primark", "Mohito", "House", "George",
    "Stradivarius", "CROPP", "C&A", "So Cute", "F&F", "Lupilu", "Made In Italy",
    "New Look", "Pull & Bear", "Newbie", "4F", "Tommy Hilfiger", "Coccodrillo",
    "Mango", "Atmosphere", "Disney", "New Yorker", "ORSAY", "Esmara", "5.10.15",
    "PrettyLittleThing", "SMYK", "GUESS", "Lasocki", "Marks & Spencer", "Amisu",
    "Levi's", "FB Sister", "Puma", "TU", "River Island", "Mayoral", "ASOS", "Lindex"
  ];
  
  export const brandMap: Record<string, number> = Object.fromEntries(
    brands.map((brand, index) => [brand.toLowerCase(), brandIds[index]])
  );
  