import { ProcessTimerImpl } from "./process-timer/impl";

const timer = new ProcessTimerImpl();

timer.start()
let a:number = 0;
timer.markStep("Starting loop")
for(let i = 0; i<=10000; i++){
    a+=i;
    console.log(a)
}
timer.end()