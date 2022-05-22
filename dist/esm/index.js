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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyPipe = void 0;
var lazy_pipe_1 = require("./lazy-pipe");
Object.defineProperty(exports, "lazyPipe", { enumerable: true, get: function () { return lazy_pipe_1.lazyPipe; } });
__exportStar(require("./operators"), exports);
// lazyPipe
// const cancel = lazyPipe
//     (domEvent(btn, 'click'))
//     (map(data => (console.log(data), data)))
//     (concatMap(timeout('A+')))
//     (map(data => (console.log(data), data)))
//     (switchMap(timeout('A')), switchMap(timeout('B')))
//     (map(data => (console.log(data), data)))
//     (timeout('B'))
//     (timeout('C'))
//     (timeout('X'), timeout('Y'), timeout('Z')) // multiple computations runs in parallel
//     (map(data => (console.log(data), data)))
//     .run({ resolve: () => console.log('DONE') });
// setTimeout(cancel, 2000);
