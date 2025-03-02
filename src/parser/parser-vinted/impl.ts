import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { logger } from '../../logger';
import { ProcessTimer } from '../../process-timer';
import { ProcessTimerImpl } from '../../process-timer/impl';
import { Conventer } from '../../utils/conventer';
import { Current } from '../../utils/conventer/contracts';
import { ConventerImpl } from '../../utils/conventer/impl';
import { Filter, Item, Token } from './contracts';
import { brandMapPrettier, Country, countryToCurrency, menAccesoriesMapPrettier, menClothingMapPrettier, womenAccesoriesMapPrettier, womenClothingMapPrettier } from './contracts/types';
import { ParserVinted } from './index';

export class ParserVintedImpl implements ParserVinted{
    public urls: string[] = [];
    private base: string[];
    public countries: Country[];
    public filter: Filter | null = null;
    public document: string | null = null;
    public item: Item | null = null;
    private timer: ProcessTimer;
    private conventer: Conventer;
    public startable: boolean = false;
    public oauth_token: Token | null = null;
    public previous_items: any = {};
    

    constructor () {
        this.timer = new ProcessTimerImpl();
        this.conventer = new ConventerImpl();
        this.base = [
            "https://vinted.co.uk/",
            "https://www.vinted.pl/",
            "https://vinted.de/"
        ];
        this.countries = ['UK', 'PL', 'GE'];
    }
    setOauthToken(token: string, country: Country){
        this.oauth_token = {PL: null, GE: null, UK: null}
        if(this.oauth_token){
            switch (country) {
                case "PL":
                    this.oauth_token = {PL: token, GE: this.oauth_token?.GE, UK: this.oauth_token?.UK};
                break;
                case "GE":
                    this.oauth_token = {PL: this.oauth_token?.PL, GE: token, UK: this.oauth_token?.UK};
                break;
                case "UK":
                    this.oauth_token = {PL: this.oauth_token?.PL, GE: this.oauth_token?.GE, UK: token};
                break;
                default:
                    break;
            }
        }
    };
    createPublicFilter() {
        if (this.filter) {
            const keysToRemove = ['order', 'disabled_personalization', 'page', 'time'];
    
            const transformedFilters = Object.entries(this.filter)
            .filter(([key]) => !keysToRemove.includes(key)) 
            .map(([key, value]) => {
                if (key === 'brand_ids' && Array.isArray(value)) {
                    return "Brands=" + value.map(brandId => `${brandMapPrettier[brandId] || brandId}`).join(',');
                }
                const catalogMaps = [menClothingMapPrettier, menAccesoriesMapPrettier, womenClothingMapPrettier, womenAccesoriesMapPrettier];
                if (key === 'catalog' && Array.isArray(value)) {
                    return value.map(catalogId => {
                        let catalogName = catalogMaps
                            .map(map => map[catalogId]) 
                            .find(name => name !== undefined); 

                        return `catalog=${catalogName || catalogId}`;
                    }).join('\n');
                }

                return `${key}=${encodeURIComponent(value)}`; 
            });
                
            return transformedFilters.join('\n'); 
        }
        return '';
    }
    
    generateUrl(current: Current){
        if(this.filter){
            const filterKeys = Object.keys(this.filter);
            const filterValues = Object.values(this.filter);
            for(let i = 0; i<this.base.length; i++){
                this.urls[i] = `${this.base[i]}catalog?${filterKeys
                    .map((filter, index) => {
                      const value = filterValues[index];
                  
                      if (filter === "brand_ids" && Array.isArray(value)) {
                        return value.map((id) => `brand_ids[]=${id}`).join("&");
                      }
                      if (filter === "catalog" && Array.isArray(value)) {
                        return value.map((id) => `catalog[]=${id}`).join("&");
                      }
                      
                      if(filter === "price_from"){
                        return `price_from=${this.conventer.convertTo(this.countries[i], current, parseFloat(value))}`;
                      }

                      if(filter === "price_to"){
                        return `price_to=${this.conventer.convertTo(this.countries[i], current, parseFloat(value))}&currrency=${countryToCurrency[this.countries[i]]}`;
                      }

                      return `${filter}=${value}`;
                    })
                    .join("&")}`;
                    console.log(this.urls[i])
            } 
        }
    }
    addFilter(filter: Filter) {
        this.filter = {...filter};
    };
    setFilterValue(val: {}){
        if(this.filter)
            this.filter = {...this.filter, ...val}
    };
    async connect(url:string){
        try {
            if(!url){
                throw new Error("Request url is not ready");
            }
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-gpu",
                    "--disable-features=site-per-process",
                    "--disable-dev-shm-usage"
                ]
            });
        
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 }); 
            await page.setRequestInterception(true);
            page.on("request", (req) => {
                if (
                    req.url().includes("google-analytics") ||
                    req.url().includes("doubleclick") ||
                    req.url().includes("facebook") ||
                    ["stylesheet", "font"].includes(req.resourceType())
                ) {
                    req.abort();
                } else {
                    req.continue();
                }
            });
            page.on('console', (msg) => {});
        
            await page.goto(url, { waitUntil: "domcontentloaded" });
            await page.waitForSelector('.feed-grid__item');
            this.document = await page.content();
        
            await browser.close();
        } catch (error) {
            logger.error(error);
        }
    };
    parse(time:number, country: Country){
        if(this.document){
            const $ = cheerio.load(this.document);
            const desc = $('.feed-grid__item').first();
            const descs = desc.find('.new-item-box__description p').map((i, el) => $(el).text().trim()).get();

            const priceWithoutTax = $('.new-item-box__title').first();
            const testId = priceWithoutTax.attr('data-testid');
            if(testId){
                const id = testId.replace('--title-container', '').replace('product-item-id-', '');
                const newTestId = testId.replace('title-container', 'breakdown');
                const newElement = $(`[data-testid="${newTestId}"]`); 

                this.item = {
                    id,
                    name: descs[0],
                    price: `${countryToCurrency[country]} ${newElement.text().trim().split(" ")[0].replaceAll(" ", "").replace("złw", "").replace("inkl.", "").replace("incl.", "")}`,
                    link: "",
                    image_url: "",
                    size: descs[1],
                    country:country,
                    time
                }
                const imageId = testId.replace('title-container', 'image');
                const parentElement = $(`[data-testid="${imageId}"]`);
                
                if (parentElement.length > 0 && this.item) {
                    const imageElement = parentElement.find('img');
                    const imageSrc = imageElement.attr('src');
                    if(imageSrc)
                        this.item.image_url = imageSrc; 
                }

                const linkId = testId.replace('title-container', 'overlay-link');
                const linkElement = $(`[data-testid="${linkId}"]`);
                const linkHref = linkElement.attr('href');
                if(this.item && linkHref)
                    this.item.link = linkHref;
            }
        }
    };
    async autorun(url:string, time:number){
        try {
            this.timer.start()
            const requestTime = Math.floor(new Date().getTime()/1000.0)
            if(this.filter){
                let country:Country = "PL";
                if(url.includes("www.vinted.pl")){
                    country = "PL";
                }else if(url.includes("vinted.de")){
                    country = "GE";
                }else if(url.includes("vinted.co.uk")){
                    country = "UK";
                }
                await this.connect(url);
                await this.parse(requestTime, country);
                this.timer.end()
                if(this.item){
                    if(this.previous_items[country]?.id == this.item?.id){
                        return null;
                    }else{
                        this.previous_items = {
                            ...this.previous_items,
                            [country]: this.item
                        }
    
                        return this.item;
                    }
                }
            }
        } catch (error) {
            logger.error(error);
        }
    };
    // async autobuy(itemId:string, country: Country){
    //     try {
    //         if(this.oauth_token){
    //             let requestedUrl: string = "";
    //             let requestedToken: string = "";

    //             if(country === "PL" && this.oauth_token.PL){
    //                 requestedUrl = this.base[1];
    //                 requestedToken = this.oauth_token.PL
    //             }else if(country === "GE" && this.oauth_token.GE){
    //                 requestedUrl = this.base[2];
    //                 requestedToken = this.oauth_token.GE
    //             } else if(country === "UK" && this.oauth_token.UK){
    //                 requestedUrl = this.base[0];
    //                 requestedToken = this.oauth_token.UK
    //             }
    //             console.log('Токен авторизації:', requestedToken);
    //             console.log("URL: ", `${requestedUrl}api/v2/items/${itemId}`);
    //             const itemResponse = await axios.get(`${requestedUrl}api/v2/items/${itemId}`, {
    //                 headers: {
    //                     'Cookie': `access_token_web=${requestedToken}`,
    //                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    //                     'Accept': 'application/json'
    //                 },
    //                 withCredentials: true,
    //             });
        
    //             if (!itemResponse.data.item) {
    //                 console.log('❌ Товар не знайдено!');
    //                 return;
    //             }
    //             console.log("Buy URL: ", `${requestedUrl}api/v2/orders`)
    //             const res = await axios.post(
    //                 `${requestedUrl}api/v2/orders`,
    //                 {
    //                     item_id: itemId,
    //                     user_id: itemResponse.data.item.user_id,
    //                     currency: itemResponse.data.item.currency,
    //                     price_numeric: itemResponse.data.item.price_numeric,
    //                     payment_method: itemResponse.data.item.user.accepted_pay_in_methods.find((item: any)=>item.code=="WALLET").id,

    //                 },
    //                 {
    //                     headers: {
    //                         'Cookie': `access_token_web=${requestedToken}`,
    //                         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    //                         'Content-Type': 'application/json'
    //                     },
    //                     withCredentials: true,
    //                 }
    //             );
    //             console.log("RES: ", res.data);
    //         }
    //     } catch (error: any) {
    //         logger.error(error);
    //     }
    // }
}