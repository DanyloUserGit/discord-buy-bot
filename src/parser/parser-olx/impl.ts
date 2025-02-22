import puppeteer from "puppeteer";
import { ParserOlx } from ".";
import { logger } from "../../logger";
import { FilterOlx, ItemOlx } from "./contracts";
import * as cheerio from 'cheerio';
import { ProcessTimer } from "../../process-timer";
import { ProcessTimerImpl } from "../../process-timer/impl";

export class ParserOlxIml implements ParserOlx {
    private timer: ProcessTimer;
    private base: string;
    private linkBase: string;
    private url: string | null = null;
    private document: string | null = null;
    private shouldReturn = false;
    
    public filter: FilterOlx | null = null;
    public item: ItemOlx | null = null;
    public startable: boolean = false;

    constructor() {
        this.timer = new ProcessTimerImpl();

        this.base = "https://www.olx.ua/uk/moda-i-stil/";
        this.linkBase = "https://www.olx.ua";
        this.filter = {
            nav: {
                category:"",
                subcategory:[""]
            },
            brand: []
        }
    }
    setFilterVal(val: {}){
        if(this.filter)
            this.filter = {...this.filter, ...val}
    };
    addFilter(filter: FilterOlx){
        this.filter = {...filter};
    };
    generateUrl() {
        const params = new URLSearchParams();

        params.append('currency', 'UAH');
        params.append('search[order]', 'created_at:desc');
        if(this.filter?.price_from && this.filter?.price_to){
            params.append('search[filter_float_price:from]', this.filter.price_from.toString());
            params.append('search[filter_float_price:to]', this.filter.price_to.toString());
        }
        if(this.filter?.brand){
            for(let i = 0; i<this.filter.brand.length; i++){
                params.append(`search[filter_enum_brand][${i}]`, this.filter.brand[i].toLowerCase().replace(/ /g, "_"));
            }
        }

        if(this.filter?.nav){
            this.url = `${this.base}${this.filter.nav.category}/${this.filter.nav.subcategory}/?${params.toString()}`;
        }
    };
    async connect() {
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
            await page.waitForSelector('.css-l9drzq');
            this.document = await page.content();
        
            await browser.close();
        } catch (error) {
            logger.error(error);
        }
    };
    parse() {
        if(this.document){
            const $ = cheerio.load(this.document);
            const desc = $('.css-l9drzq').first();
            const link = desc.find('.css-qo0cxu').attr('href');
            const image = desc.find('.css-8wsg1m').attr('src');
            const title = desc.find('.css-1sq4ur2').text();
            const price = desc.find('.css-6j1qjp').text();
            const size = desc.find('.css-1el9czp').text();

            if(link && image && this.item?.link!==link){
                this.shouldReturn=true;
                this.item = {
                    link: `${this.linkBase}${link}`,
                    image,
                    title,
                    price,
                    size
                }
            }else{
                this.shouldReturn=false;
            }
            
        }
    };
    async autorun() {
        try {
            this.timer.start();
            if(!this.filter) return;
            this.generateUrl();

            if(!this.url) return;
            await this.connect();
            this.parse();
            this.timer.end();
            if(this.item && this.shouldReturn)
                return this.item;
        } catch (error) {
            logger.error(error);
        }
    };

}