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
exports.concatMap = exports.switchMap = exports.map = exports.domEvent = void 0;
var domEvent = function (elm, type, options) { return function (context) {
    elm.addEventListener(type, context.resolve, options);
    return function () { return elm.removeEventListener(type, context.resolve, options); };
}; };
exports.domEvent = domEvent;
var map = function (f) { return function (context) {
    context.resolve(f(context.data));
}; };
exports.map = map;
var switchMap = function (f) {
    var counter = 0;
    var currentCancelFn;
    var maybeCancel = function () {
        counter++;
        if (typeof currentCancelFn === 'function')
            currentCancelFn();
    };
    var resolveGuard = function (i, context) { return function (data) {
        if (i === counter)
            context.resolve(data);
    }; };
    var rejectGuard = function (i, context) { return function (err) {
        if (i === counter)
            context.reject(err);
    }; };
    return function (context) {
        maybeCancel();
        currentCancelFn = f(__assign(__assign({}, context), { resolve: resolveGuard(counter, context), reject: rejectGuard(counter, context) }));
        return maybeCancel;
    };
};
exports.switchMap = switchMap;
var concatMap = function (f) {
    var count = 0;
    var result = [];
    var currentCancelFns = new Set();
    var maybeCancel = function () {
        currentCancelFns.forEach(function (f) {
            if (typeof f === 'function')
                f();
        });
    };
    var resolveGuard = function (i, context) { return function (data) {
        result[i] = data;
        if (result.length === count)
            context.resolve(result);
    }; };
    return function (context) {
        currentCancelFns.add(f(__assign(__assign({}, context), { resolve: resolveGuard(count++, context) })));
        return maybeCancel;
    };
};
exports.concatMap = concatMap;
