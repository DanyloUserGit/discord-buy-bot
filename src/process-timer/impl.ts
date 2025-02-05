import { ProcessTimer } from ".";

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
    }
    markStep(msg: string){
        this.steps.push(msg);
    }
    end(){
        this.timeEnd = performance.now();
        for(let i = 0; i<this.steps.length; i++){
            console.log(`${1}: ${this.steps[i]}`);
        }

        const totalTime = (this.timeEnd-this.timeStart)/1000; //seconds
        console.log(`Total time: ${totalTime}`);
    }
}