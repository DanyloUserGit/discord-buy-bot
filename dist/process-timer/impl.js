"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTimerImpl = void 0;
const logger_1 = require("../logger");
class ProcessTimerImpl {
    constructor() {
        this.timeStart = 0;
        this.timeEnd = 0;
        this.steps = [];
    }
    start() {
        this.timeStart = performance.now();
        logger_1.logger.info("Timer started");
    }
    markStep(msg) {
        this.steps.push(msg);
        const step = this.steps.indexOf(msg);
        logger_1.logger.info(`${step}: ${msg}`);
    }
    end() {
        this.timeEnd = performance.now();
        logger_1.logger.info(`Used marks: ${this.steps.length}`);
        const totalTime = (this.timeEnd - this.timeStart) / 1000;
        logger_1.logger.info(`Total time: ${totalTime}`);
    }
}
exports.ProcessTimerImpl = ProcessTimerImpl;
