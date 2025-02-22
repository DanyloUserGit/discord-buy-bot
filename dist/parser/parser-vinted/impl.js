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
const axios_1 = __importDefault(require("axios"));
const impl_2 = require("../../utils/conventer/impl");
class ParserVintedImpl {
    constructor() {
        this.urls = [];
        this.filter = null;
        this.document = null;
        this.item = null;
        this.startable = false;
        this.oauth_token = "";
        this.timer = new impl_1.ProcessTimerImpl();
        this.conventer = new impl_2.ConventerImpl();
        this.base = [
            "https://vinted.co.uk/",
            "https://www.vinted.pl/",
            "https://vinted.de/"
        ];
        this.countries = ['UK', 'PL', 'GE'];
    }
    setOauthToken(token) {
        this.oauth_token = token;
    }
    ;
    generateUrl(current) {
        if (this.filter) {
            const filterKeys = Object.keys(this.filter);
            const filterValues = Object.values(this.filter);
            for (let i = 0; i < this.base.length; i++) {
                this.urls[i] = `${this.base[i]}catalog?${filterKeys
                    .map((filter, index) => {
                    const value = filterValues[index];
                    if (filter === "brand_ids" && Array.isArray(value)) {
                        return value.map((id) => `brand_ids[]=${id}`).join("&");
                    }
                    if (filter === "catalog" && Array.isArray(value)) {
                        return value.map((id) => `catalog[]=${id}`).join("&");
                    }
                    if (filter === "price_from") {
                        return `price_from=${this.conventer.convertTo(this.countries[i], current, parseFloat(value))}`;
                    }
                    if (filter === "price_to") {
                        return `price_to=${this.conventer.convertTo(this.countries[i], current, parseFloat(value))}&currrency=${types_1.countryToCurrency[this.countries[i]]}`;
                    }
                    return `${filter}=${value}`;
                })
                    .join("&")}`;
                console.log(this.urls[i]);
            }
        }
    }
    addFilter(filter) {
        this.filter = { ...filter };
    }
    ;
    setFilterValue(val) {
        if (this.filter)
            this.filter = { ...this.filter, ...val };
    }
    ;
    async connect(url) {
        try {
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
            await page.waitForSelector('.feed-grid__item');
            this.document = await page.content();
            await browser.close();
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
    parse(time, country) {
        if (this.document) {
            const $ = cheerio.load(this.document);
            const desc = $('.feed-grid__item').first();
            const descs = desc.find('.new-item-box__description p').map((i, el) => $(el).text().trim()).get();
            const priceWithoutTax = $('.new-item-box__title').first();
            const testId = priceWithoutTax.attr('data-testid');
            if (testId) {
                const id = testId.replace('--title-container', '').replace('product-item-id-', '');
                const newTestId = testId.replace('title-container', 'breakdown');
                const newElement = $(`[data-testid="${newTestId}"]`);
                this.item = {
                    id,
                    name: descs[0],
                    price: `${types_1.countryToCurrency[country]} ${newElement.text().trim().split(" ")[0].replaceAll(" ", "").replace("złw", "").replace("inkl.", "").replace("incl.", "")}`,
                    link: "",
                    image_url: "",
                    size: descs[1],
                    country: country,
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
    async autorun(url, time) {
        try {
            this.timer.start();
            const requestTime = Math.floor(new Date().getTime() / 1000.0);
            if (this.filter) {
                let country = "PL";
                if (url.includes("www.vinted.pl")) {
                    country = "PL";
                }
                else if (url.includes("vinted.de")) {
                    country = "GE";
                }
                else if (url.includes("vinted.co.uk")) {
                    country = "UK";
                }
                await this.connect(url);
                await this.parse(requestTime, country);
                this.timer.end();
                if (this.item)
                    return this.item;
            }
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    ;
    async autobuy(item) {
        try {
            if (item && this.oauth_token.length) {
                let requestedUrl = "";
                let requestedToken = "";
                if (item.country === "PL") {
                    requestedUrl = this.base[1];
                }
                else if (item.country === "GE") {
                    requestedUrl = this.base[2];
                }
                else {
                    requestedUrl = this.base[0];
                }
                const itemResponse = await axios_1.default.get(`${requestedUrl}api/v2/items/${item.id}`, {
                    headers: {
                        'Authorization': `Bearer ${requestedToken}`
                    }
                });
                if (!itemResponse.data.item) {
                    console.log('❌ Товар не знайдено!');
                    return;
                }
                await axios_1.default.post(`${requestedUrl}api/v2/orders`, {
                    item_id: item.id,
                    shipping_option_id: itemResponse.data.item.shipping_options[0].id,
                    payment_method: 'credit_card'
                }, {
                    headers: {
                        'Authorization': `Bearer ${requestedToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
}
exports.ParserVintedImpl = ParserVintedImpl;
