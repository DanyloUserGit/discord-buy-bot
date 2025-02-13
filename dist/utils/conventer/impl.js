"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConventerImpl = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../../logger");
class ConventerImpl {
    constructor() {
        this.base = [
            "https://minfin.com.ua/ua/currency/converter/usd-pln/",
            "https://minfin.com.ua/ua/currency/converter/usd-gbp/",
            "https://minfin.com.ua/ua/currency/converter/usd-eur/"
        ];
        this.current = null;
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
                await page.waitForSelector('.sc-1xei23l-6 mmupbe-2 iAzTUW');
                const elementText = await page.evaluate(() => {
                    const element = document.querySelector('.sc-1xei23l-6.mmupbe-2.iAzTUW');
                    if (element) {
                        if (element.textContent)
                            return element.textContent.trim();
                    }
                });
                console.log(elementText);
                await browser.close();
            }
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    convertTo(country) {
        return 1;
    }
    convertFrom(country) {
        return 1;
    }
}
exports.ConventerImpl = ConventerImpl;
