import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";
import { ParserShafa } from ".";
import { logger } from "../../logger";
import { ProcessTimer } from "../../process-timer";
import { ProcessTimerImpl } from "../../process-timer/impl";
import { filterShafa, ItemShafa } from "./contracts";

export class ParserShafaImpl implements ParserShafa {
    private timer: ProcessTimer;
    private base:string = "https://shafa.ua/uk";
    private baseLink:string = "https://shafa.ua";
    private url:string = "";
    private document: string | null = null;
    private shouldReturn = false;

    public filter:filterShafa;
    public startable: boolean = false;
    public item: ItemShafa | null = null;

    constructor () {
        this.timer = new ProcessTimerImpl();
        this.filter = {
            category: "",
            subcategory: ""
        }
    }
    setFilterVal (val: {}){
        if(this.filter)
            this.filter = {...this.filter, ...val}
    };
    addFilter(filter: filterShafa){
        this.filter = {...filter};
    };
    
    generateUrl(){
        if(this.filter){
            this.url = `
                ${this.base}/${this.filter.category}/${this.filter.subcategory}?${this.filter.brands ?
                this.filter.brands.map((brand)=>`&brands=${brand}`) : ""}${this.filter.price_from
                && `&price_from=${this.filter.price_from}`}${this.filter.price_to && `&price_to=${this.filter.price_to}`}&sort=4
            `.replaceAll(",", "");
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
            await page.waitForSelector('.dqgIPe4iXPIqxKvRxLb7.xkYiTLWdBmPaZ0zVk4AF.V1ehXukNrUj9ZohFz9rH.r99Oysrn4ZXToLc1dphl');
            await page.waitForSelector('.D8o9s7KcxqtQ7bd2ka_W');
            await page.waitForSelector('.wD1fsK7iYTacsxprHLBA');
            await page.waitForSelector('.CnMTkDcKcdyrztQsbqaj');
            this.document = await page.content();
        
            await browser.close();
        } catch (error) {
            logger.error(error);
        }
    };
    parse(){
        if(this.document){
            const $ = cheerio.load(this.document);
            const desc = $('.dqgIPe4iXPIqxKvRxLb7.xkYiTLWdBmPaZ0zVk4AF.V1ehXukNrUj9ZohFz9rH.r99Oysrn4ZXToLc1dphl');
            const price = desc.find('.D8o9s7KcxqtQ7bd2ka_W').first().find("p").text();
            const image = desc.find(".wD1fsK7iYTacsxprHLBA").attr("data-src");
            const title = desc.find(".CnMTkDcKcdyrztQsbqaj").first().text();
            const link = desc.find(".CnMTkDcKcdyrztQsbqaj").attr("href");
            if(image && this.item?.link!==`${this.baseLink}${link}`){
                this.shouldReturn = true;
                this.item = {
                    price,
                    image,
                    title,
                    link: `${this.baseLink}${link}`
                }
            }else{
                this.shouldReturn = false;
            }
        }
    };
    async autorun(){
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