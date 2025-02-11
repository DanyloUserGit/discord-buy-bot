"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserVintedImpl = void 0;
const cheerio = __importStar(require("cheerio"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../../logger");
const impl_1 = require("../../process-timer/impl");
const types_1 = require("./contracts/types");
class ParserVintedImpl {
    constructor() {
        this.url = null;
        this.filter = null;
        this.document = null;
        this.item = null;
        this.timer = new impl_1.ProcessTimerImpl();
        this.urls = {
            UK: "https://vinted.co.uk/",
            PL: "https://www.vinted.pl/",
            GE: "https://vinted.de/"
        };
    }
    generateUrl(country) {
        if (this.filter) {
            const filterKeys = Object.keys(this.filter);
            const filterValues = Object.values(this.filter);
            this.url = `${this.urls[country]}catalog?${filterKeys.map((filter, index) => index !== filterKeys.length - 1 ?
                `${filter}=${filterValues[index]}&` : `${filter}=${filterValues[index]}`)}`.replaceAll(",", "");
        }
    }
    addFilter(filter) {
        this.filter = { ...filter };
    }
    ;
    async connect() {
        try {
            if (!this.url) {
                throw new Error("Request url is not ready");
            }
            const browser = await puppeteer_1.default.launch({
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
                if (req.url().includes("google-analytics") ||
                    req.url().includes("doubleclick") ||
                    req.url().includes("facebook") ||
                    ["stylesheet", "font"].includes(req.resourceType())) {
                    req.abort();
                }
                else {
                    req.continue();
                }
            });
            page.on('console', (msg) => { });
            await page.goto(this.url, { waitUntil: "domcontentloaded" });
            await page.waitForSelector('.feed-grid__item');
            this.document = await page.content();
            await browser.close();
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
    parse(country, time) {
        if (this.document) {
            const $ = cheerio.load(this.document);
            const desc = $('.feed-grid__item').first();
            const descs = desc.find('.new-item-box__description p').map((i, el) => $(el).text().trim()).get();
            const priceWithoutTax = $('.new-item-box__title').first();
            const testId = priceWithoutTax.attr('data-testid');
            if (testId) {
                const newTestId = testId.replace('title-container', 'breakdown');
                const newElement = $(`[data-testid="${newTestId}"]`);
                this.item = {
                    name: descs[0],
                    price: `${types_1.countryToCurrency[country]} ${newElement.text().trim().split(" ")[0].replaceAll(" ", "").replace("złw", "")}`,
                    link: "",
                    image_url: "",
                    size: descs[1],
                    country,
                    time
                };
                const imageId = testId.replace('title-container', 'image');
                const parentElement = $(`[data-testid="${imageId}"]`);
                if (parentElement.length > 0 && this.item) {
                    const imageElement = parentElement.find('img');
                    const imageSrc = imageElement.attr('src');
                    if (imageSrc)
                        this.item.image_url = imageSrc;
                }
                const linkId = testId.replace('title-container', 'overlay-link');
                const linkElement = $(`[data-testid="${linkId}"]`);
                const linkHref = linkElement.attr('href');
                if (this.item && linkHref)
                    this.item.link = linkHref;
            }
        }
    }
    ;
    async autorun(country, attempts = 0, maxAttempts = 10) {
        try {
            this.timer.start();
            if (this.filter) {
                const requestTime = Math.floor(new Date().getTime() / 1000.0);
                this.filter.time = requestTime;
                this.generateUrl(country);
                await this.connect();
                await this.parse(country, requestTime);
                this.timer.end();
                if (this.item)
                    logger_1.logger.info(JSON.stringify(this.item));
                return await this.item;
            }
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
}
exports.ParserVintedImpl = ParserVintedImpl;
