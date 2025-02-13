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
  export const gender: string[] = ['Men', 'Women'];
  export const menNames: {clothing: string[], accesories: string[]} = {
    clothing:['Jeans', 'Outerwear', 'Tops & t-shirts', 'Suits & blazers', 'Jumpers & sweaters', 'Trousers',
      'Shorts', 'Socks & underwear', 'Sleepwear', 'Swimwear', 'Activewear', 'Costumes & special outfits', "Other men's clothing"
    ],
    accesories:['All', 'Bags & backpacks', 'Bandanas & headscarves', 'Belts', 'Braces & suspenders', 'Gloves',
      'Handkerchiefs', 'Hats & caps', 'Jewellery', 'Pocket squares', 'Scarves & shawls', 'Sunglasses', 'Ties & bow ties',
      'Watches', 'Other accessories'
    ]
  }
  export const womenNames: {clothing: string[], accesories: string[]} = {
    clothing:['Outerwear', 'Jumpers & sweaters', 'Suits & blazers', 'Dresses', 'Skirts', 'Tops & t-shirts',
      'Jeans', 'Trousers & leggings', 'Shorts & cropped trousers', 'Jumpsuits & playsuits', 'Swimwear', 'Lingerie & nightwear',
      'Maternity clothes', 'Activewear', 'Costumes & special outfits', 'Other clothing'
    ],
    accesories:['Bandanas & headscarves', 'Belts', 'Gloves', 'Hair accessories', 'Handkerchiefs', 'Hats & caps', 
      'Jewellery', 'Keyrings', 'Scarves & shawls', 'Sunglasses', 'Umbrellas', 'Watches', 'Other accessories'
    ]
  }
  export const menIds: {clothing: number[], accesories: number[]} = {
    clothing:[257, 1206, 76, 32, 79, 34, 80, 85, 2910, 84, 30, 92, 83],
    accesories:[82, 94, 2960, 96, 2959, 91, 2958, 86, 95, 2957, 87, 98, 2956, 97, 99]
  }
  export const womenIds: {clothing: number[], accesories: number[]} = {
    clothing:[1037, 13, 8, 10, 11, 12, 183, 9, 15, 1035, 28, 29, 1176, 73, 1782, 18],
    accesories:[2931, 20, 90, 1123, 2932, 88, 21, 1852, 89, 26, 1851, 22, 1140]
  }
  export const menClothingMap: Record<string, number> = Object.fromEntries(
    menNames.clothing.map((clothing, index) => [clothing.toLowerCase(), menIds.clothing[index]])
  );
  export const menAccesoriesMap: Record<string, number> = Object.fromEntries(
    menNames.accesories.map((accesories, index) => [accesories.toLowerCase(), menIds.accesories[index]])
  );
  export const womenClothingMap: Record<string, number> = Object.fromEntries(
    womenNames.clothing.map((clothing, index) => [clothing.toLowerCase(), womenIds.clothing[index]])
  );
  export const womenAccesoriesMap: Record<string, number> = Object.fromEntries(
    womenNames.accesories.map((accesories, index) => [accesories.toLowerCase(), womenIds.accesories[index]])
  );