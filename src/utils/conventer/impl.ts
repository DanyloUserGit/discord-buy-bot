import puppeteer from "puppeteer";
import { Conventer } from ".";
import { logger } from "../../logger";
import { Country } from "../../parser/parser-vinted/contracts/types";
import { Current } from "./contracts";
import * as cheerio from 'cheerio';

export class ConventerImpl implements Conventer {
    private base: string[] = [
        "https://minfin.com.ua/ua/currency/converter/eur-pln/",
        "https://minfin.com.ua/ua/currency/converter/eur-gbp/",
    ];
    private baseFrom: string[] = [
        "https://minfin.com.ua/ua/currency/converter/pln-eur/",
        "https://minfin.com.ua/ua/currency/converter/gbp-eur/",
    ];
    public current: Current;
    public currentFrom: Current;

    constructor () {
        this.current = {
            PL: 0,
            GE: 1,
            UK: 0
        }
        this.currentFrom = {
            PL: 0,
            GE: 1,
            UK: 0
        }
    }
    async getCourse(){
        try {
            for(const url of this.base){
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
                await page.waitForSelector('.sc-1xei23l-6.mmupbe-2.iAzTUW');
                const document = await page.content();
                if(document){
                    const $ = cheerio.load(document);
                    const item = $('.sc-1xei23l-6.mmupbe-2.iAzTUW').first().text().trim();
                    const number = parseFloat(item.replace(",", "."));
                    switch (url) {
                        case this.base[0]:
                            this.current.PL = number
                        break;
                        case this.base[1]:
                            this.current.UK = number
                        break;
                        default:
                            break;
                    }
                }
                await browser.close();
            }
            for(const url of this.baseFrom){
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
                await page.waitForSelector('.sc-1xei23l-6.mmupbe-2.iAzTUW');
                const document = await page.content();
                if(document){
                    const $ = cheerio.load(document);
                    const item = $('.sc-1xei23l-6.mmupbe-2.iAzTUW').first().text().trim();
                    const number = parseFloat(item.replace(",", "."));
                    switch (url) {
                        case this.baseFrom[0]:
                            this.currentFrom.PL = number
                        break;
                        case this.baseFrom[1]:
                            this.currentFrom.UK = number
                        break;
                        default:
                            break;
                    }
                }
                await browser.close();
            }
            logger.info("Conventer Ready!")
        } catch (error) {
            logger.error(error);
        }
    }
    convertTo(country: Country, current:Current, val: number){
        return current[country]*val;
    }
    convertFrom(country: Country, current:Current, val: number){
        return val*current[country];
    }
}