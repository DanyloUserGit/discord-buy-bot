export const categoryValues = [
    "zhenskaya-odezhda", "muzhskaya-odezhda", "aksessuary"
]
export const categoryKeys = [
    "Жіночий одяг", "Чоловічий одяг", "Аксесуари"
]
export const categoryOlx: Record<string, string> = Object.fromEntries(
  categoryKeys.map((key, index) => [key, categoryValues[index]])
);

export const subcategoryWomenValues = [
    "bodi", "mayki-futbolki", "bluzy-rubashki", "svitery-kardigany-hudi", "platya", "yubki",
    "verhnyaya-odezhda", "dzhinsy", "shorty", "bryuki", "kombinezony", "kostyumy", "pidzhaki-zhakety",
    "domashnyaya-dlya-sna", "sportivnaya-odezhda", "vyshivanki" 
]
export const subcategoryWomenKeys = [
    "Боді", "Майки та футболки", "Блузи і сорочки", "Светри, кардигани, худі", "Плаття", "Спідниці",
    "Верхній одяг", "Джинси", "Шорти", "Брюки", "Комбінезони", "Костюми", "Жіночі піджаки",
    "Домашній одяг", "Спортивний одяг", "Вишиванки"    
]
export const subcategoryWomenOlx: Record<string, string> = Object.fromEntries(
    subcategoryWomenKeys.map((key, index) => [key, subcategoryWomenValues[index]])
);

export const subcategoryMenValues = [
    "futbolki-mayki", "rubashki-tenniski", "kofty-svitery", "verhnyaya-odezhda", "shorty", "dzhinsy", "bryuki",
    "kostyumy-pidzhaki", "kombinezony", "odezhda-dlya-doma-sna", "sportivnaya-odezhda"
]
export const subcategoryMenKeys = [
    "Майки та футболки", "Сорочки і теніски", "Кофти й светри", "Верхній одяг", "Шорти", "Джинси", "Штани",
    "Костюми та піджаки", "Комбінезони", "Одяг для дому та сну", "Спортивний одяг"
]
export const subcategoryMenOlx: Record<string, string> = Object.fromEntries(
    subcategoryMenKeys.map((key, index) => [key, subcategoryMenValues[index]])
);

export const subcategoryAccesoriesValues = [
    "yuvelirnye-izdeliya", "sumki", "bizhuteriya", "shkatulki-dlya-ukrasheniy", "ryukzaki", 
    "koshelki-kosmetichki-vizitnitsy", "zonty", "dlya-volos", "remni-poyasa", "sharfy-perchatki",
    "ochki", "galstuki-babochki", "dlya-obuvi", "remeshki-braslety"
]
export const subcategoryAccesoriesKeys = [
    "Ювелірні вироби", "Сумки", "Біжутерія", "Скриньки для прикрас", "Рюкзаки міські та спортивні", 
    "Гаманці, косметички, візитниці", "Парасолі", "Аксесуари для волосся", "Ремені та пояси", "Шарфи і рукавички",
    "Окуляри", "Краватки і метелики", "Аксесуари для взуття", "Ремінці та браслети для годинника"
]
export const subcategoryAccesoriesOlx: Record<string, string> = Object.fromEntries(
    subcategoryAccesoriesKeys.map((key, index) => [key, subcategoryAccesoriesValues[index]])
);

export const brandsOlx = [
    "Adidas",
    "Armani",
    "Asos",
    "Bershka",
    "Calvin Klein",
    "Colins",
    "Columbia",
    "Cropp Town",
    "Diesel",
    "Fila",
    "Gap",
    "Guess",
    "H&H",
    "H&M",
    "Hugo Boss",
    "Lacoste",
    "Levis",
    "Massimo Dutti",
    "Next",
    "Nike",
    "Oodji",
    "Ostin",
    "Pull & Bear",
    "Puma",
    "Ralph Lauren",
    "Reebok",
    "Reserved",
    "Stradivarius",
    "The North Face",
    "Tommy Hilfiger",
    "Under Armour",
    "Zara"
];
  