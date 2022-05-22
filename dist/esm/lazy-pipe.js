import { cancellationGuard, enqueueCancelFn, maybeParallel, noop } from "./helpers";
export const lazyPipe = (...fns) => {
    const resume = (...nextFns) => lazyPipe((context, internalContext) => maybeParallel(fns)(Object.assign(Object.assign({}, context), { resolve: internalContext.cancellationGuard((data) => internalContext.enqueueCancelFn(maybeParallel(nextFns)(Object.assign(Object.assign({}, context), { data }), internalContext))) }), internalContext));
    resume.run = context => {
        const state = { cancelQ: new Set(), cancelled: false };
        const internalContext = { enqueueCancelFn: enqueueCancelFn(state), cancellationGuard: cancellationGuard(state) };
        const cancelPipe = () => {
            state.cancelled = true;
            state.cancelQ.forEach((f) => f());
            state.cancelQ = new Set();
        };
        internalContext.enqueueCancelFn(maybeParallel(fns)(Object.assign(Object.assign({}, context), { reject: internalContext.cancellationGuard((err) => { var _a; return (cancelPipe(), (_a = context === null || context === void 0 ? void 0 : context.reject) === null || _a === void 0 ? void 0 : _a.call(context, err)); }), resolve: internalContext.cancellationGuard((context === null || context === void 0 ? void 0 : context.resolve) || noop) }), internalContext));
        return cancelPipe;
    };
    return resume;
};
