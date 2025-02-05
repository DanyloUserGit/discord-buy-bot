"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const impl_1 = require("./process-timer/impl");
const timer = new impl_1.ProcessTimerImpl();
timer.start();
let a = 0;
timer.markStep("Starting loop");
for (let i = 0; i <= 10000; i++) {
    a += i;
    console.log(a);
}
timer.end();
