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
exports.ConventerImpl = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../../logger");
const cheerio = __importStar(require("cheerio"));
class ConventerImpl {
    constructor() {
        this.base = [
            "https://minfin.com.ua/ua/currency/converter/eur-pln/",
            "https://minfin.com.ua/ua/currency/converter/eur-gbp/",
        ];
        this.baseFrom = [
            "https://minfin.com.ua/ua/currency/converter/pln-eur/",
            "https://minfin.com.ua/ua/currency/converter/gbp-eur/",
        ];
        this.current = {
            PL: 0,
            GE: 1,
            UK: 0
        };
        this.currentFrom = {
            PL: 0,
            GE: 1,
            UK: 0
        };
    }
    async getCourse() {
        try {
            for (const url of this.base) {
                if (!url) {
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
                await page.goto(url, { waitUntil: "domcontentloaded" });
                await page.waitForSelector('.sc-1xei23l-6.mmupbe-2.iAzTUW');
                const document = await page.content();
                if (document) {
                    const $ = cheerio.load(document);
                    const item = $('.sc-1xei23l-6.mmupbe-2.iAzTUW').first().text().trim();
                    const number = parseFloat(item.replace(",", "."));
                    switch (url) {
                        case this.base[0]:
                            this.current.PL = number;
                            break;
                        case this.base[1]:
                            this.current.UK = number;
                            break;
                        default:
                            break;
                    }
                }
                await browser.close();
            }
            for (const url of this.baseFrom) {
                if (!url) {
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
                await page.goto(url, { waitUntil: "domcontentloaded" });
                await page.waitForSelector('.sc-1xei23l-6.mmupbe-2.iAzTUW');
                const document = await page.content();
                if (document) {
                    const $ = cheerio.load(document);
                    const item = $('.sc-1xei23l-6.mmupbe-2.iAzTUW').first().text().trim();
                    const number = parseFloat(item.replace(",", "."));
                    switch (url) {
                        case this.baseFrom[0]:
                            this.currentFrom.PL = number;
                            break;
                        case this.baseFrom[1]:
                            this.currentFrom.UK = number;
                            break;
                        default:
                            break;
                    }
                }
                await browser.close();
            }
            logger_1.logger.info("Conventer Ready!");
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    convertTo(country, current, val) {
        return current[country] * val;
    }
    convertFrom(country, current, val) {
        return val * current[country];
    }
}
exports.ConventerImpl = ConventerImpl;
