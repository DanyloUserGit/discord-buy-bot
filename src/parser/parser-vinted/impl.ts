import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { logger } from '../../logger';
import { ProcessTimer } from '../../process-timer';
import { ProcessTimerImpl } from '../../process-timer/impl';
import { Filter, Item } from './contracts';
import { Country, countryToCurrency } from './contracts/types';
import { ParserVinted } from './index';
import axios from 'axios';

export class ParserVintedImpl implements ParserVinted{
    public urls: string[] = [];
    private base: string[];
    private filter: Filter | null = null;
    public document: string | null = null;
    public item: Item | null = null;
    private timer: ProcessTimer;
    public startable: boolean = false;
    public oauth_token: string = "";
    

    constructor () {
        this.timer = new ProcessTimerImpl();

        this.base = [
            "https://vinted.co.uk/",
            "https://www.vinted.pl/",
            "https://vinted.de/"
        ];
    }
    setOauthToken(token: string){
        this.oauth_token = token;
    };
    generateUrl(){
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
    
                      return `${filter}=${value}`;
                    })
                    .join("&")}`;
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
                
                if(this.item)
                    return this.item;
            }
        } catch (error) {
            logger.error(error);
        }
    };
    async autobuy(item: Item){
        try {
            if(item && this.oauth_token.length){
                let requestedUrl: string = "";
                let requestedToken: string = "";

                if(item.country === "PL"){
                    requestedUrl = this.base[1];
                }else if(item.country === "GE"){
                    requestedUrl = this.base[2];
                } else{
                    requestedUrl = this.base[0];
                }
                const itemResponse = await axios.get(`${requestedUrl}api/v2/items/${item.id}`, {
                    headers: {
                        'Authorization': `Bearer ${requestedToken}`
                    }
                });
        
                if (!itemResponse.data.item) {
                    console.log('❌ Товар не знайдено!');
                    return;
                }
                await axios.post(
                    `${requestedUrl}api/v2/orders`,
                    {
                        item_id: item.id,
                        shipping_option_id: itemResponse.data.item.shipping_options[0].id, // Вибираємо перший варіант доставки
                        payment_method: 'credit_card' // Можливі варіанти: 'credit_card', 'paypal'
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${requestedToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
        } catch (error) {
            logger.error(error);
        }
    }
}