import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { logger } from '../../logger';
import { ProcessTimer } from '../../process-timer';
import { ProcessTimerImpl } from '../../process-timer/impl';
import { Filter, Item } from './contracts';
import { Country, countryToCurrency } from './contracts/types';
import { ParserVinted } from './index';

export class ParserVintedImpl implements ParserVinted{
    private urls: any;
    public url: string | null = null;
    private filter: Filter | null = null;
    public document: string | null = null;
    public item: Item | null = null;
    private timer: ProcessTimer;
    public country: Country;
    

    constructor () {
        this.timer = new ProcessTimerImpl();

        this.urls = {
            UK:"https://vinted.co.uk/",
            PL:"https://www.vinted.pl/",
            GE:"https://vinted.de/"
        };
        this.country = "PL";
    }
    setCountry(country: Country){
        this.country = country;
    }
    generateUrl(){
        if(this.filter){
            const filterKeys = Object.keys(this.filter);
            const filterValues = Object.values(this.filter);
            this.url = `${this.urls[this.country]}catalog?${filterKeys
                .map((filter, index) => {
                  const value = filterValues[index];
              
                  if (filter === "brand_ids" && Array.isArray(value)) {
                    return value.map((id) => `brand_ids[]=${id}`).join("&");
                  }
              
                  return `${filter}=${value}`;
                })
                .join("&")}`;
              
        }
    }
    addFilter(filter: Filter) {
        this.filter = {...filter};
    };
    setFilterValue(val: {}){
        if(this.filter)
            this.filter = {...this.filter, ...val}
    };
    async connect(){
        try {
            if(!this.url){
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
        
            await page.goto(this.url, { waitUntil: "domcontentloaded" });
            await page.waitForSelector('.feed-grid__item');
            this.document = await page.content();
        
            await browser.close();
        } catch (error) {
            logger.error(error);
        }
    };
    parse(time:number){
        if(this.document){
            const $ = cheerio.load(this.document);
            const desc = $('.feed-grid__item').first();
            const descs = desc.find('.new-item-box__description p').map((i, el) => $(el).text().trim()).get();

            const priceWithoutTax = $('.new-item-box__title').first();
            const testId = priceWithoutTax.attr('data-testid');
            if(testId){
                const newTestId = testId.replace('title-container', 'breakdown');
                const newElement = $(`[data-testid="${newTestId}"]`); 

                this.item = {
                    name: descs[0],
                    price: `${countryToCurrency[this.country]} ${newElement.text().trim().split(" ")[0].replaceAll(" ", "").replace("złw", "")}`,
                    link: "",
                    image_url: "",
                    size: descs[1],
                    country:this.country,
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
    async autorun(attempts: number = 0, maxAttempts: number = 10){
        try {
            this.timer.start()
            if(this.filter){
                const requestTime = Math.floor(new Date().getTime()/1000.0)
                this.filter.time = requestTime;
                this.generateUrl();
                await this.connect();
                await this.parse(requestTime);
                this.timer.end()
                
                if(this.item)
                    return this.item;
            }
        } catch (error) {
            logger.error(error);
        }
    };
}