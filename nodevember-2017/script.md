# Intro

## Who Am I?

Shelley Vohr, a software engineer at GitHub working on open source. I help build and maintain Electron, which is a javascript framework that allows you to use web technologies to build cross-platform native desktop apps.

## Why Am I Here?

Today, I want to do a deep dive into the mechanics of asynchronous programming in javascript. To make sure we're all on the same page before I really get started, I'll go over basic principles of async. Then, we'll launch into different methodologies and the nuances of what exactly differentiates them, and then finally we'll compare over the spectrum of option to discuss what approach is best.

`<SWITCH TO SLIDE 2>`

# Basic Async

So, asynchronous programming. Let's say you have a little program written in a single file, `index.js`. It might all be in the same file, but it's made up of functions, and at any given time only one of these is going to be executing _now_. The rest will execute _later_, at some point in the future. That, there, is the crux of async: the relationship between now and later, and how you manage this relationship with your code. What is key here, however, and what causes some of the most difficulties for developers when they're just starting out, is that _later_ doesn't mean strictly and immediately after _now_. It could be at any point in the future, and you don't necessarily know when that will be.

# The Current Landscape

Now that we've covered the basics of asynchrony, let's move on to some of the technical underpinnings of how code is executed in the javascript environment.

To understand how code is executed, it's best to start with the event loop. The event loop can best be conceptualized as an endlessly running. singly-threaded loop, where each iteration runs a small chunk of the code in the program currently being executed. If you wanted to run a chunk of code at a later time, that chunk would simply be added to a queue for the event loop, and when the time came that you desired it to execute it would be dequeued and executed. With ES6 came a new concept called the job queue, but we'll save that for a little late.

Let's take a look at the JS call stack.

`<SWITCH TO SLIDE 3>`

When a function `foo()` calls a function `bar()`, `bar()` needs to know where to return to (inside `foo()`) after it is done. This information is managed with the call stack.

```js
function baz(z) {
  console.log(new Error().stack)
}

function bar(y) {
  baz(y + 1)
}

function foo(x) {
  bar(x + 1)
}

foo(3)
return
```

Initially, when the program above is started, the call stack is empty.
After `foo(3)` is called, the stack has one entry:

```
1. location in global scope
```

After `bar(x + 1)` is called, the stack has two entries:

```
1. location in foo()
2. location in global scope
```

After `baz(y + 1) ` is called, the stack has three entries:

```
1. location in bar()
2. location in foo()
3. location in global scope
```

When `console.log` is called in `baz()`, we see the call stack:

```js
Error
    at baz (stack_trace.js:2:17)
    at bar (stack_trace.js:6:5)
    at foo (stack_trace.js:9:5)
    at <global> (stack_trace.js:11:1)
```

Next, each of the functions terminates and each time the top entry is removed from the stack. After function `foo()` is done, we are back in global scope and the call stack is empty. In the last time we return and the stack is empty, which means that the program terminates.

We're going to use this as a template for understanding the asynchronous techniques i'm about to discuss, so let's also take a second and look at it visually.

`<SWITCH TO SLIDE 4>`

## Callbacks
### How It Works

When I talk about "response" code in the pre-ES6 era, what I really mean is callbacks. I'm sure most all of you are familiar with or have encountered callbacks, so i'm going to focus more on how they fit into the async landscape as a whole. Let's start by looking at the functions I have on the screen here, and talking about them in context.

```javascript
doA(() => {
  doB()
  doC(() => {
    doD()
  })
  doE()
})
doF()
```

```js
doA(() => {
  doC()
  doD(() => {
    doF()
  })
  doE()
})
doB()
```

So you can see I have two functions side by side, and your eyes have to do a significant amount of jumping around to discern the order in which the functions are executing. On the right side, i've mapped the letters to the order in which they run. This should be a little more intuitive to look at.

JavaScript has what's known as run-to-completion semantics: The current task is always finished before the next task is executed. That means that each task has complete control over all current state and doesn’t have to worry about concurrent modification.

Let’s look at an example:

```js
setTimeout(() => { // (A)
  console.log('Second')
}, 0)
console.log('First') // (B)
```

The function starting in line A is added to the task queue immediately, but only executed after the current piece of code is done (in particular line B!). That means that this code’s output will always be:

First
Second

### Errors

In the previous code snippet I had up, you could see that your eyes had to skip around, even though they most likely wanted to read the code in a top down fashion. This is because your brain operates _sequentially_, which places it at odds with the inherent functionality of callbacks. When you sometimes struggle to understand how and when each part of code is working, it's undoubtedly hard to deal with errors in that code. There are now two ways in which errors are reported – via callbacks and via exceptions. You have to be careful to combine both properly. The most obvious, but occasionally overlooked aspect of dealing with errors in callbacks is to make sure you've actually handled all of them! Having the first argument be the error is a simple convention that encourages you to remember to handle your errors.

```js
function doSomething (error, file) {
  if (error) {
    return console.error('error oh no!', error)
  }
  // CONTINUE TO DO OTHER THINGS
}
```
However! There is a caveat to this advice, and it lies in how specifically the error are caught. Did you see how in the snippet i showed I _returned_ the error, and didn't throw it? That was intentional, because exceptions are only a synchronous mechanism, which is logical: in an asynchronous environment, the exception could be thrown when the handler block is already out of scope and thus meaningless.



## Generators
### How It Works

The first thing to observe as we talk about generators is how they differ from normal functions with respect to the "run to completion" expectation. With ES6 generators, we have a different kind of function, which may be paused in the middle, one or many times, and resumed later, allowing other code to run during these paused periods. They can be w

```js
function * countDown(maxValue) {
  yield max
  yield * countDown(max > 0 ? max - 1 : 0)
}

let counter = countDown(26)
counter.next().value // 26
counter.next().value // 25
```

rewritten in callback form

```js
function downCounter(maxValue) {
  return {
    value: maxValue,
    next: () => downCounter(maxValue > 0 ? maxValue - 1 : 0)
  }
}

let counter = downCounter(26)
counter.value // 26
counter.next().value // 25
```

While in my example, counter.next().value will always evaluate to 25 no matter where it occurs and how often we repeat it, this is not the case with the JS generator – at one point it is 26, then 25, and it could really be any number.

ES6 generator functions are "cooperative" in their concurrency behavior. Inside the generator function body, you use the new yield keyword to pause the function from inside itself. Nothing can pause a generator from the outside it pauses itself when it comes across a yield.

### Errors

Error Handling
One of the most powerful parts of the ES6 generators design is that the semantics of the code inside a generator are synchronous, even if the external iteration control proceeds asynchronously.

That's a fancy/complicated way of saying that you can use simple error handling techniques that you're probably very familiar with -- namely the try..catch mechanism.

```js
function *foo() {
  try {
    const x = yield 3
    console.log(`x: ${x}`) // may never get here!
  }
  catch (err) {
    console.log(`Error: ${err}`)
  }
}
```

Even though the function will pause at the yield 3 expression, and may remain paused an arbitrary amount of time, if an error gets sent back to the generator, that try..catch will catch it! Try doing that with normal async capabilities like callbacks.

```js
const it = foo()
const res = it.next() // { value:3, done:false }

// instead of resuming normally with another `next(..)` call,
// let's throw a wrench (an error) into the gears:
it.throw( "Oops!" ); // Error: Oops!
```

Generators have synchronous execution semantics, which means you can use the try..catch error handling mechanism across a yield statement. The generator iterator also has a throw(..) method to throw an error into the generator at its paused position, which can of course also be caught by a try..catch inside the generator.

yield* allows you to delegate the iteration control from the current generator to another one. The result is that yield* acts as a pass-through in both directions, both for messages as well as errors.

The main strength of generators is that they provide a single-threaded, synchronous-looking code style, while allowing you to hide the asynchronicity away as an implementation detail. This lets us express in a very natural way what the flow of our program's steps/statements is without simultaneously having to navigate asynchronous syntax and gotchas.

## Promises

### How It Works

### Errors

If exceptions are thrown inside the callbacks of then() and catch() then that’s not a problem, because these two methods convert them to rejections.

However, things are different if you start your async function by doing something synchronous:

```js
function asyncFunc() {
  doSomethingSync() // (A)
  return doSomethingAsync()
  .then(result => {
    ···
  })
}
```
If an exception is thrown in line A then the whole function throws an exception. There are two solutions to this problem.

Solution 1: returning a rejected Promise
You can catch exceptions and return them as rejected Promises:

```js
function asyncFunc() {
  try {
    doSomethingSync()
    return doSomethingAsync()
    .then(result => {
      ···
    })
  } catch (err) {
    return Promise.reject(err)
  }
}
```

Solution 2: executing the sync code inside a callback
You can also start a chain of then() method calls via Promise.resolve() and execute the synchronous code inside a callback:

```js
function asyncFunc() {
  return Promise.resolve()
  .then(() => {
    doSomethingSync()
    return doSomethingAsync()
  })
  .then(result => {
    ···
  })
}
```

An alternative is to start the Promise chain via the Promise constructor:

```js
function asyncFunc() {
  return new Promise((resolve, reject) => {
    doSomethingSync()
    resolve(doSomethingAsync())
  })
  .then(result => {
    ···
  })
}
```

This approach saves you a tick (the synchronous code is executed right away), but it makes your code less regular.

## Async/Await

### How It Works

Async/await is a new way to write asynchronous code. Previous options for asynchronous code are callbacks and promises.
Async/await is actually built on top of promises. It cannot be used with plain callbacks or node callbacks.
Async/await is, like promises, non blocking.
Async/await makes asynchronous code look and behave a little more like synchronous code. This is where all its power lies.

Any async function returns a promise implicitly, and the resolve value of the promise will be whatever you return from the function (which is the string "done" in our case).

### Errors

If you’re familiar with promises you know that if a promise is rejected you’ll need to handle that error inside a `.catch`, and if you’re handling errors for both synchronous and asynchronous code you will likely have to duplicate your error handler.

```js
const associateUsers = () => {
  try {
   doSynchronousThings()
   return getUsers()
    .then(users => users.map(user => user.getAddress()))
    .catch(e => console.error(e))
  } catch(err) {
    console.error(err)
  }
}
```

In the above snippet we can see that there is duplicate code on lines 6 and 8. The catch statement on line 7 will handle any errors that the synchronous function doSynchronousThings may throw but it won’t handle any errors thrown by getUsers since it is asynchronous. This example may seem palatable since all its doing is printing the error to the console, but if there is any kind of complex error handling logic we want to avoid duplicating it. Async / await lets us do exactly that:


```js
const associateUsers = async () => {
  try {
   doSynchronousThings()
   const users = await getUsers()
   return users.map(user => user.getAddress())
  } catch(err){
    console.error(err)
  }
}
```

One of the goals of async/await is to make asynchronous code appear more syntactically similar to synchronous code. This is also true for error handling.

```js
const makeRequest = async () => {
  try {
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(`Eek! an error: ${err}`)
  }
}
```

Async/await makes it finally possible to handle both synchronous and asynchronous errors with the same construct, good old try/catch. In the example below with promises, the try/catch will not handle if JSON.parse fails because it’s happening inside a promise. We need to call .catch on the promise and duplicate our error handling code, which will (hopefully) be more sophisticated than console.log in your production ready code.

# Debugging Async Code

```js
const makeRequest = () => {
  return firstPromise()
    .then(() => secondPromise())
    .then(() => thirdPromise())
    .then(() => fourthPromise())
    .then(() => { throw new Error("oops") })
}

makeRequest()
  .catch(error => {
    console.log(error)
    // output
    // Error: oops at callAPromise.then.then.then.then.then (index.js:8:13)
  })
```
Async/Await

2. If you set a breakpoint inside a .then block and use debug shortcuts like step-over, the debugger will not move to the the following .then because it only “steps” through synchronous code.
With async/await you don’t need arrow functions as much, and you can step through await calls exactly as if they were normal synchronous calls.

```js
const makeRequest = () => {
  return firstPromise()
  .then(() => secondPromise())
  .then(() => thirdPromise())
  .then(() => fourthPromise())
}
```

Last but not least, a killer advantage when using async/await is that it’s much easier to debug. Debugging promises has always been such a pain for 2 reasons
You can’t set breakpoints in arrow functions that return expressions (no body).

```js
const makeRequest = async () => {
  await firstPromise()
  await secondPromise()
  await thirdPromise()
  await fourthPromise()
}
```

# Comparing Async Approaches

## When Do I Want To Use Each?

First, our brains plan things out in sequential, blocking, single-threaded semantic ways, but callbacks express asynchronous flow in a rather nonlinear, non-sequential way, which makes reasoning properly about such code much harder. Bad to reason about code is bad code that leads to bad bugs.

Callbacks: lack of sequentiality and lack of trustability.

Callbacks tend to be more verbose and coordinating multiple asynchronous requests concurrently can lead to callback hell if you're not actively modularizing your functions. Error handling and tracing tends to be less straightforward and even confusing since there could be many Error objects that all go back to a single error further down the call stack. Errors, also need to be passed back to the original caller that can also lead to some head scratching when determining where the original Error was thrown if anonymous functions were used in the callback chain. One of the benefits of callbacks is that they are just plain old functions and don't require any additional understanding beyond knowing how an asynchronous operation works.

Promises are great for:

- Monitoring synchronous operations
- That need to notify only once (usually completion or error)
- Coordinating or managing multiple asynchronous operations such as sequencing or branching async operations or managing multiple operations in flight at the same time
- Propagating errors from nested or deeply nested async operations
- Getting code ready for the use of async/await (or using it now with a transpiler)
- Operations that fit the Promise model where there are only three states: pending, fulfilled and rejected and where the state transitions from pending => fulfilled or from pending => rejected can then not change (a single one-way transition).
- Dynamically linking or chaining asynchronous operations (such as do these two async operations, examine the result, then decide which other async operations to do based on the intermediate result)
- Managing a mix of asynchronous and synchronous operations
- Automatically catching and propagating upwards any exceptions that occur in async completion callbacks (in plain callbacks these exceptions are sometimes silently hidden).

### Use Cases

## Is There a Best?

### Why/Why Not?

# Wrapping Up

## What's the Takeaway?

Thank you!
