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
exports.ParserOlxIml = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../../logger");
const cheerio = __importStar(require("cheerio"));
const impl_1 = require("../../process-timer/impl");
class ParserOlxIml {
    constructor() {
        this.url = null;
        this.document = null;
        this.filter = null;
        this.item = null;
        this.startable = false;
        this.timer = new impl_1.ProcessTimerImpl();
        this.base = "https://www.olx.ua/uk/moda-i-stil/";
        this.linkBase = "https://www.olx.ua";
        this.filter = {
            nav: {
                category: "",
                subcategory: [""]
            },
            brand: []
        };
    }
    setFilterVal(val) {
        if (this.filter)
            this.filter = { ...this.filter, ...val };
    }
    ;
    addFilter(filter) {
        this.filter = { ...filter };
    }
    ;
    generateUrl() {
        const params = new URLSearchParams();
        params.append('currency', 'UAH');
        params.append('search[order]', 'created_at:desc');
        if (this.filter?.price_from && this.filter?.price_to) {
            params.append('search[filter_float_price:from]', this.filter.price_from.toString());
            params.append('search[filter_float_price:to]', this.filter.price_to.toString());
        }
        if (this.filter?.brand) {
            for (let i = 0; i < this.filter.brand.length; i++) {
                params.append(`search[filter_enum_brand][${i}]`, this.filter.brand[i].toLowerCase().replace(/ /g, "_"));
            }
        }
        if (this.filter?.nav) {
            this.url = `${this.base}${this.filter.nav.category}/${this.filter.nav.subcategory}/?${params.toString()}`;
        }
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
            await page.waitForSelector('.css-l9drzq');
            this.document = await page.content();
            await browser.close();
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
    parse() {
        if (this.document) {
            const $ = cheerio.load(this.document);
            const desc = $('.css-l9drzq').first();
            const link = desc.find('.css-qo0cxu').attr('href');
            const image = desc.find('.css-8wsg1m').attr('src');
            const title = desc.find('.css-1sq4ur2').text();
            const price = desc.find('.css-6j1qjp').text();
            const size = desc.find('.css-1el9czp').text();
            if (!link || !image)
                return;
            this.item = {
                link: `${this.linkBase}${link}`,
                image,
                title,
                price,
                size
            };
        }
    }
    ;
    async autorun() {
        try {
            this.timer.start();
            if (!this.filter)
                return;
            this.generateUrl();
            if (!this.url)
                return;
            await this.connect();
            this.parse();
            this.timer.end();
            if (this.item)
                return this.item;
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
}
exports.ParserOlxIml = ParserOlxIml;
