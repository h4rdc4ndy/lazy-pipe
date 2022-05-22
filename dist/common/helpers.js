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
exports.noop = exports.maybeParallel = exports.cancellationGuard = exports.enqueueCancelFn = void 0;
var enqueueCancelFn = function (state) { return function (cancelFn) {
    if (typeof cancelFn === 'function')
        state.cancelQ.add(cancelFn);
}; };
exports.enqueueCancelFn = enqueueCancelFn;
var cancellationGuard = function (state) { return function (f) { return function (data) {
    if (!state.cancelled)
        f(data);
}; }; };
exports.cancellationGuard = cancellationGuard;
var maybeParallel = function (fns) { return function (context, internalContext) {
    if (fns.length === 1)
        return fns[0](context, internalContext);
    var result = [];
    var resolveGuard = function (i) { return function (data) {
        result[i] = data;
        if (result.length === fns.length)
            context.resolve(result);
    }; };
    var cancelFns = fns.map(function (f, i) { return f(__assign(__assign({}, context), { resolve: resolveGuard(i) }), internalContext); });
    return function () {
        new Set(cancelFns).forEach(function (f) { return typeof f === 'function' && f(); });
    };
}; };
exports.maybeParallel = maybeParallel;
var noop = function () { };
exports.noop = noop;
