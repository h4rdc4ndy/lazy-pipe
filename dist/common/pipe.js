"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = void 0;
var helpers_1 = require("./helpers");
var pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    var resume = function () {
        var nextFns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nextFns[_i] = arguments[_i];
        }
        return (0, exports.pipe)(function (context, internalContext) { return (0, helpers_1.maybeParallel)(fns)(__assign(__assign({}, context), { resolve: internalContext.cancellationGuard(function (data) { return internalContext.enqueueCancelFn((0, helpers_1.maybeParallel)(nextFns)(__assign(__assign({}, context), { data: data }), internalContext)); }) }), internalContext); });
    };
    resume.run = function (context) {
        var state = { cancelQ: new Set(), cancelled: false };
        var internalContext = { enqueueCancelFn: (0, helpers_1.enqueueCancelFn)(state), cancellationGuard: (0, helpers_1.cancellationGuard)(state) };
        var cancelPipe = function () {
            state.cancelled = true;
            state.cancelQ.forEach(function (f) { return f(); });
            state.cancelQ = new Set();
        };
        internalContext.enqueueCancelFn((0, helpers_1.maybeParallel)(fns)(__assign(__assign({}, context), { reject: internalContext.cancellationGuard(function (err) { var _a; return (cancelPipe(), (_a = context === null || context === void 0 ? void 0 : context.reject) === null || _a === void 0 ? void 0 : _a.call(context, err)); }), resolve: internalContext.cancellationGuard((context === null || context === void 0 ? void 0 : context.resolve) || helpers_1.noop) }), internalContext));
        return cancelPipe;
    };
    return resume;
};
exports.pipe = pipe;
