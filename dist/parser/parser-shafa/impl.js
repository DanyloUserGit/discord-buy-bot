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
exports.ParserShafaImpl = void 0;
const cheerio = __importStar(require("cheerio"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../../logger");
const impl_1 = require("../../process-timer/impl");
class ParserShafaImpl {
    constructor() {
        this.base = "https://shafa.ua/uk";
        this.baseLink = "https://shafa.ua";
        this.url = "";
        this.document = null;
        this.shouldReturn = false;
        this.startable = false;
        this.item = null;
        this.timer = new impl_1.ProcessTimerImpl();
        this.filter = {
            category: "",
            subcategory: ""
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
        if (this.filter) {
            this.url = `
                ${this.base}/${this.filter.category}/${this.filter.subcategory}?${this.filter.brands ?
                this.filter.brands.map((brand) => `&brands=${brand}`) : ""}${this.filter.price_from
                && `&price_from=${this.filter.price_from}`}${this.filter.price_to && `&price_to=${this.filter.price_to}`}&sort=4
            `.replaceAll(",", "");
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
            await page.waitForSelector('.dqgIPe4iXPIqxKvRxLb7.xkYiTLWdBmPaZ0zVk4AF.V1ehXukNrUj9ZohFz9rH.r99Oysrn4ZXToLc1dphl');
            await page.waitForSelector('.D8o9s7KcxqtQ7bd2ka_W');
            await page.waitForSelector('.wD1fsK7iYTacsxprHLBA');
            await page.waitForSelector('.CnMTkDcKcdyrztQsbqaj');
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
            const desc = $('.dqgIPe4iXPIqxKvRxLb7.xkYiTLWdBmPaZ0zVk4AF.V1ehXukNrUj9ZohFz9rH.r99Oysrn4ZXToLc1dphl');
            const price = desc.find('.D8o9s7KcxqtQ7bd2ka_W').first().find("p").text();
            const image = desc.find(".wD1fsK7iYTacsxprHLBA").attr("data-src");
            const title = desc.find(".CnMTkDcKcdyrztQsbqaj").first().text();
            const link = desc.find(".CnMTkDcKcdyrztQsbqaj").attr("href");
            if (image && this.item?.link !== `${this.baseLink}${link}`) {
                this.shouldReturn = true;
                this.item = {
                    price,
                    image,
                    title,
                    link: `${this.baseLink}${link}`
                };
            }
            else {
                this.shouldReturn = false;
            }
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
            if (this.item && this.shouldReturn)
                return this.item;
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
}
exports.ParserShafaImpl = ParserShafaImpl;
