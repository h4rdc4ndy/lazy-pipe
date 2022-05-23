import { cancellationGuard, enqueueCancelFn, maybeParallel, noop } from "./helpers";

export const pipe = (...fns) => {
    const resume = (...nextFns) => pipe((context, internalContext) => maybeParallel(fns)({
        ...context,
        resolve: internalContext.cancellationGuard((data) => internalContext.enqueueCancelFn(maybeParallel(nextFns)({ ...context, data }, internalContext))),
    }, internalContext));
    resume.run = context => {
        const state = { cancelQ: new Set(), cancelled: false };
        const internalContext = { enqueueCancelFn: enqueueCancelFn(state), cancellationGuard: cancellationGuard(state) }; 
        const cancelPipe = () => {
            state.cancelled = true;
            state.cancelQ.forEach((f: any) => f());
            state.cancelQ = new Set();
        };
        internalContext.enqueueCancelFn(maybeParallel(fns)({
            ...context,
            reject: internalContext.cancellationGuard((err) => (cancelPipe(), context?.reject?.(err))),
            resolve: internalContext.cancellationGuard(context?.resolve || noop),
        }, internalContext));
        return cancelPipe;
    };
    return resume;
};