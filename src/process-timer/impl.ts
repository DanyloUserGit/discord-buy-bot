import { ProcessTimer } from ".";
import { logger } from "../logger";

export class ProcessTimerImpl implements ProcessTimer{
    private timeStart:number;
    private timeEnd:number;
    private steps:string[];

    constructor () {
        this.timeStart = 0;
        this.timeEnd = 0;
        this.steps = [];
    }
    start(){
        this.timeStart = performance.now();
        logger.info("Timer started");
    }
    markStep(msg: string){
        this.steps.push(msg);
        const step = this.steps.indexOf(msg);

        logger.info(`${step}: ${msg}`);
    }
    end(){
        this.timeEnd = performance.now();
        logger.info(`Used marks: ${this.steps.length}`);

        const totalTime = (this.timeEnd-this.timeStart)/1000; //seconds
        logger.info(`Total time: ${totalTime}`);
    }
}