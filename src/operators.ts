export const domEvent = (elm, type, options) => (context) => {
    elm.addEventListener(type, context.resolve, options);
    return () => elm.removeEventListener(type, context.resolve, options);
}

export const map = (f) => (context) => {
    context.resolve(f(context.data));
};

export const switchMap = (f) => {
    let counter = 0;
    let currentCancelFn;
    const maybeCancel = () => {
        counter++;
        if (typeof currentCancelFn === 'function') currentCancelFn();
    };
    const resolveGuard = (i, context) => (data) => {
        if (i === counter) context.resolve(data);
    }
    const rejectGuard = (i, context) => (err) => {
        if (i === counter) context.reject(err);
    }
    return (context) => {
        maybeCancel();
        currentCancelFn = f({ ...context, resolve: resolveGuard(counter, context), reject: rejectGuard(counter, context) });
        return maybeCancel;
    };
};

export const concatMap = (f) => {
    let count = 0;
    const result = [];
    const currentCancelFns = new Set();
    const maybeCancel = () => {
        currentCancelFns.forEach(f => {
            if (typeof f === 'function') f();
        });
    };
    const resolveGuard = (i, context) => (data) => {
        result[i] = data;
        if (result.length === count) context.resolve(result);
    }
    return (context) => {
        currentCancelFns.add(f({ ...context, resolve: resolveGuard(count++, context) }));
        return maybeCancel;
    };
}
