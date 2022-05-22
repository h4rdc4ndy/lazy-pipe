export { lazyPipe } from "./lazy-pipe";
export * from './operators';

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
//