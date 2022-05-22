export const enqueueCancelFn = (state) => (cancelFn) => {
    if (typeof cancelFn === 'function')
        state.cancelQ.add(cancelFn);
};
export const cancellationGuard = (state) => (f) => (data) => {
    if (!state.cancelled)
        f(data);
};
export const maybeParallel = (fns) => (context, internalContext) => {
    if (fns.length === 1)
        return fns[0](context, internalContext);
    const result = [];
    const resolveGuard = i => (data) => {
        result[i] = data;
        if (result.length === fns.length)
            context.resolve(result);
    };
    const cancelFns = fns.map((f, i) => f(Object.assign(Object.assign({}, context), { resolve: resolveGuard(i) }), internalContext));
    return () => {
        new Set(cancelFns).forEach(f => typeof f === 'function' && f());
    };
};
export const noop = () => { };
