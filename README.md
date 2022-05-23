# @reactive/lazy-pipe
tiny functional lazy pipe operator with a lot of flexibility and clean api

# introduction
@reactive/lazy-pipe is a simple function that implements recursive composition,
the composition result can be forked by invoking the "run" method,
the api is interesting. 

# features
- sequential/parallel computaions with ease
- pipes are cancelable
- nested pipes
- on "run" any passed data will be available to each function in the chain
- lazy, pure, nothing runs untill we invoke the "run" method
- easy to implement custom operators and behaviors

# how to use

i'll be using this function a lot in the next examples
```js
const timeout = (tag) => (context) => {

    const id = setTimeout(() => {
        console.log(tag);
        context.resolve(tag);
        // "context.resolve" invokes the next sequential function or parallel functions in the chain,
        // the argument passed to "resolve" will be available for the next function "context.data".
    }, 1000);

    return () => clearTimeout(id);
};
```
# 1 - sequential and parallel computations

```js
import { lazyPipe } from '@reactive/lazy-pipe';

lazyPipe
    (timeout('A'))
    (timeout('B'))
    (timeout('C'))
    (timeout('X'), timeout('Y'), timeout('Z'))
    .run({ resolve: (result) => console.log('DONE', result), reject: console.error })
/*
after 1000ms logs -> A
then after 1000ms logs -> B
then after 1000ms logs -> C
then after 1000ms logs -> X
                          Y
                          Z
then logs -> DONE ['X', 'Y', 'Z']
*/

```
- timeout A, B and C are sequential, 
runs in order from top to bottom, passing data to each others through the "resolve" method

- X, Y and Z are parallel, 
forked at the same time and waited on to complete before invoking the next step in the chain (which is the last resolve method that prints 'DONE')

- the point is, any step with multiple computaions will run in parallel

- also parallel computations's values will be combined together in one array,
array values has the same order of the computations

# 2 - cancellation

```js
import { lazyPipe } from '@reactive/lazy-pipe';

const cancel = lazyPipe(timeout('A'))(timeout('B')).run({ resolve: console.log, reject: console.error })

cancel();
```
- invoking "run" returns a cancel function 

# 3 - nesting

```js
import { lazyPipe } from '@reactive/lazy-pipe';

lazyPipe
    (timeout('A'))
    (lazyPipe(timeout('B'))(timeout('C')).run)
    .run({ resolve: console.log, reject: console.error })
```
- it just works, the "run" method has the same interface as any other computation,
takes a context and returns a cleanup function

# 4 - custom operators

```js
import { lazyPipe, map, switchMap, /* and few others */ } from '@reactive/lazy-pipe';
const add = n1 => n2 => n1 + n2;

lazyPipe
    (switchMap(timeout(1)))
    (map(add(1)))
    .run({ resolve: console.log, reject: console.error })

// at the end logs 2
```
- custom operators are not hard to build, also i should offer some helpers to make it even easier soon to handle very complex behaviors

# 5 - pass random data

```js
import { lazyPipe, map, switchMap, /* and few others */ } from '@reactive/lazy-pipe';
const add = n1 => n2 => n1 + n2;

lazyPipe
    ((context) => context.resolve(context['RANDOM-KEY']))
    .run({ resolve: console.log, reject: console.error, 'RANDOM-KEY': 'RANDOM VALUE' })

// logs -> 'RANDOM VALUE'
```
- pass addtional data to all computations