export type CategoryUrl = "men" | "women" | "aksesuary";
export const subcategoryWomenValuesShafa = [
    "platya", "verhnyaya-odezhda", "nizhnee-bele-i-kupalniki", 
    "zhenskie-kostyumy", "zhenskie-kombinezony", "dlya-beremennyh",
    "kofty", "mayki-i-futbolki", "yubki", "plyazhnaya", "rubashki-i-bluzy",
    "shtany", "sport-otdyh", "odezhda-dlya-doma-i-sna", "specodezhda"
];
export const subcategoryWomenNamesShafa = [
    "сукні", "верхній одяг", "нижня білизна і купальники", 
    "жіночі костюми", "жіночі комбінезони", "для вагітних",
    "кофти", "майки і футболки", "спідниці", "пляжний одяг", 
    "сорочки і блузи", "штани", "спорт і відпочинок", 
    "одяг для дому і сну", "спецодяг"
];
export const subcategoryWomenShafa: Record<string, string> = Object.fromEntries(
    subcategoryWomenNamesShafa.map((key, index) => [key, subcategoryWomenValuesShafa[index]])
);
export const subcategoryMenValuesShafa = [
    "futbolki-i-maiki", "verkhniaia-odezhda", "sport-i-otdyh",
    "rubashki", "shtany-i-shorty", "kofti", "nizhnee-bele",
    "takticheskaya-odezhda", "pidzhaki-i-kostiumy", "odezhda-dlia-doma-i-sna",
    "specodezhda-men"
];
export const subcategoryMenNamesShafa = [
    "футболки і майки", "верхній одяг", "спорт і відпочинок",
    "сорочки", "штани і шорти", "кофти", "нижня білизна",
    "тактичний одяг", "піджаки і костюми", "одяг для дому і сну",
    "спецодяг"
];
export const subcategoryMenShafa: Record<string, string> = Object.fromEntries(
    subcategoryMenNamesShafa.map((key, index) => [key, subcategoryMenValuesShafa[index]])
);
export const subcategoryAccesoriesValuesShafa = [
    "vsi-sumky", "sharfy-khustky", "hodynnyky-aksesuary", 
    "obkladynky-dlya-dokumentiv", "holovni-ubory", "remeni-poyasy",
    "hamantsi-portmone", "kravatky-metelyky", "prykrasy-dlya-narechenoyi",
    "prykrasy", "okulyary-aksesuary", "rukavychky-rukavytsi", 
    "parasoli", "tkanynni-masky"
];
export const subcategoryAccesoriesNamesShafa = [
    "всі сумки", "шарфи і хустки", "годинники та аксесуари", 
    "обкладинки для документів", "головні убори", "ремені і пояси",
    "гаманці і портмоне", "краватки і метелики", "прикраси для нареченої",
    "прикраси", "окуляри і аксесуари", "рукавички і рукавиці", 
    "парасолі", "тканинні маски"
];
export const subcategoryAccesoriesShafa: Record<string, string> = Object.fromEntries(
    subcategoryAccesoriesNamesShafa.map((key, index) => [key, subcategoryAccesoriesValuesShafa[index]])
);
export const brandsValuesShafa = [
    "ZARA", "H&M", "Nike", "Adidas", "Primark", "New Look", 
    "Victoria's Secret", "PrettyLittleThing", "Next", "Mango",
    "New Balance", "Puma", "Asics", "Tommy Hilfiger", 
    "The North Face", "Hugo Boss"
];
export const brandsNamesShafa = [
    183, 63, 104, 4, 123, 102, 174,
    44739, 105, 94, 385, 122, 3966,
    159, 324
];
export const brandsShafa: Record<string, number> = Object.fromEntries(
    brandsValuesShafa.map((key, index) => [key, brandsNamesShafa[index]])
);