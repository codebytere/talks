## Slide 1

I'm Shelley Vohr, a software engineer at GitHub working on open source. I help build and maintain Electron, which is a javascript framework that allows you to use web technologies to build cross-platform native desktop apps.

Today, I want to do a deep dive into the mechanics of asynchronous programming in javascript. To make sure we're all on the same page before I really get started, I'll go over basic principles of async. Then, we'll launch into different methodologies and the nuances of what exactly differentiates them, and then finally we'll compare over the spectrum of option to discuss what approach is best.

## SLIDE 2

So, asynchronous programming. Let's say you have a little program written in a single file, `index.js`. It might all be in the same file, but it's made up of functions, and at any given time only one of these is going to be executing _now_. The rest will execute _later_, at some point in the future. That, there, is the crux of async: the relationship between now and later, and how you manage this relationship with your code. What is key here, however, and what causes some of the most difficulties for developers when they're just starting out, is that _later_ doesn't mean strictly and immediately after _now_. It could be at any point in the future, and you don't necessarily know when that will be.

It's also important to mention that JavaScript has what's known as run-to-completion semantics: this means that the current task always finishes before the next task begins. As a result of this, each task has complete control over all current state and doesn’t have to worry about concurrent modification, or another task modifying things at the same time.

Now that we've covered the basics of asynchrony, let's move on to some of the technical underpinnings of how code is executed in the javascript environment.

To understand how code is executed, it's best to start with the event loop. The event loop can best be conceptualized as an endlessly running. singly-threaded loop, where each iteration runs a small chunk of the code in the program currently being executed. If you wanted to run a chunk of code at a later time, that chunk would simply be added to a queue for the event loop, and when the time came that you desired it to execute it would be dequeued and executed. With ES6 came a new concept called the job queue, but we'll save that for a little later.

Let's take a look at the JS call stack.

## SLIDE 3

When a function `foo()` calls a function `bar()`, `bar()` needs to know where to return to inside `foo()` after it is done. This information is managed with the call stack. Take a look at the set  of three functions on the lefthand side of the slide, and let’s walk through how this stack will look as the program executes.

Initially, when the program above is started, the call stack is empty. After `foo(3)` is called, the stack has one entry: its entry in global scope, so that `foo(3)` knows where to return to when it is finished.  Next, after `bar(x + 1)` is called, the stack has 2 entries; it’s now stored the location that `bar(x + 1)` needs to return to when it’s finished executing, in addition to global scope. This trend continues as `baz(y + 1)`  is called, and the stack now contains `baz()`’s return address as well as the previous three return addresses from previous function calls. When `console.log()` is called in `baz()` we see the call stack, you’ll see it’s identical in the log to what I sketched out on the right side.  Next, each of the functions terminates and each time the top entry is removed from the stack. After function `foo(3)` is done, we are back in global scope and the call stack is empty. At the end of this program we return and the stack is empty, which means that the program terminates.

We're going to use this as a template for understanding the asynchronous techniques i'm about to discuss, so let's also take a second and look at it visually.

## Slide 4

In looking at this, you can see a handful of the things i've previously mentioned: the event loop, the task queue, and the stack. The current task comes off the event queue, and its location is stored in memory while relevant variables populate the heap. The task queue is populated by task sources, which would be a particular chunk of code in an executing program.

This snapshot would represent the moment after all functions in the previous slide had executed and before locations had begin to pop off the stack.

## Slide 5

I'm sure most all of you are familiar with or have encountered callbacks, so i'm going to focus more on how they fit into the async landscape as a whole. Let's start by looking at some functions, and talking about them in context.

## Slide 6

Here, you can see I have two programs side by side. On the left, the function names are alphabetical from the top down, and on the right side, I've mapped the letters to the order in which they run. Most likely, your eyes have to do a significant amount of jumping around to discern the order in which the functions are executing for the program on the left, since they don't run in top-down sequential order you expect. By following letters on the right you probably had an easier time, so let's talk about why that is and how this looks on the call stack. Firstly, you had difficulty because your brain operates _sequentially_, which places it at odds with the inherent functionality of callbacks. At a more high level, this is part of why some of the later innovations in asynchrony have been welcomed; it's easier and debug code that you understand more intuitively.

// CALL STACK SHIT

### Slide 7

A few minutes ago, I talked about how you probably had a more difficult time reading the program on the left of the previous slide.  When you struggle to understand how and when each part of code is working, it's undoubtedly hard to deal with errors in that code. Within the callback landscape, there are two ways in which errors are reported – via callbacks and via exceptions. You have to be careful to combine both properly. The most obvious, but occasionally overlooked aspect of dealing with errors in callbacks is to make sure you've actually handled all of them!

However! There is a caveat to this advice, and it lies in how specifically the error are caught. Did you see how in the snippet i showed I _returned_ the error, and didn't throw it? That was intentional, because exceptions are only a synchronous mechanism, which is logical: in an asynchronous environment, the exception could be thrown when the handler block is already out of scope and thus be rendered meaningless.

## Slide 8

The next big innovation in asynchrony, Promises,  hit javascript with ES6. Before this, there was no direct notion of asynchrony built into the javascript engine. All it ever did was execute a single chunk of your program at any given moment, when asked to. You, the developer, _asked it to_  by means of callbacks or timeouts, in order to shuffle its place in the event loop. With promises came a change to the JS engine, which took the form of the queue I mentioned very briefly a little while ago: the microtask queue. Before I delve into how exactly this changes the form of the stack/queue/event-loop diagram I showed you earlier, let's look at an example of a program utilizing promises.

## Slide 9

At the top here we declare `prom`. This variable, a promise, is best described as representing a future value, like a placeholder. We can reason about it without necessarily knowing the outcome, making it functionally extemporaneous. When the future value is _resolved_, it might succeed or fail, and then at that point it's no longer a placeholder and becomes an immutable value.

As you can see, `p1` is resolved not with an immediate value, but with another promise `p3` which is itself resolved with the value "B". The specified behavior is to unwrap `p3` into `p1`, but asynchronously. Therefore, `p1`'s callback(s) are behind `p2`'s callback(s) in the asynchronous microtask queue, which is the new asynchronous concept built directly into the JS engine with the advent of ES6. The output, here, would then be B A instead of A B as your might expect.

## Slide 10

This diagram looks nearly identical to the diagram I showed before, with one key difference: the addition of the microtask queue.  Once a promise settles, or if it has already settled, it queues a microtask for its reactionary callbacks. This ensures promise callbacks are async even if the promise has already settled. So calling `.then(resolve, reject)` against a settled promise immediately queues a microtask. Any additional microtasks queued during microtasks are added to the end of the queue and also processed.

So, in looking at the diagram, you'll see that the current task can come off either the task queue or the microtask queue. All promise callbacks are queued as microtasks, so if we jump to the previous slide for a moment, the callbacks for `p1` and `p2`, where `val` is printed to the console, would both have been added to the microtask queue instead of the task queue.

## Slide 11

What happens if something dies or goes wrong in a promise? How do we deal with those errors? The standard way to handle errors from promises is to add a `catch()` handler at the end of your promise chain. You can also chain these handlers, so that you can throw errors into higher-level scopes. Catching and re-throwing errors in this way will tell you which higher-level module lead to the error which means that you can later debug the issue on a top-down or layer-by-layer basis.


If exceptions are thrown inside the callbacks of `then()` and `catch()` then that’s not a problem, because these two methods convert them to rejections.

However, things are different if you start your async function by doing something synchronous:

```js
function asyncFunction() {
  somethingSync()
  return somethingAsync()
  .then(result => {
    // do some stuff
  })
}
```
If an exception is thrown in line A then the whole function throws an exception. There are two solutions to this problem.

Solution 1: returning a rejected Promise
You can catch exceptions and return them as rejected Promises:

```js
function asyncFunction() {
  try {
    somethingSync()
    return somethingAsync()
    .then(result => {
      // do some stuff
    })
  } catch (err) {
    return Promise.reject(err)
  }
}
```

Solution 2: executing the sync code inside a callback
You can also start a chain of then() method calls via Promise.resolve() and execute the synchronous code inside a callback:

```js
function asyncFunction() {
  return Promise.resolve()
  .then(() => {
    somethingSync()
    return somethingAsync()
  })
  .then(result => {
    // do some stuff
  })
}
```

An alternative is to start the Promise chain via the Promise constructor:

```js
function asyncFunction() {
  return new Promise((resolve, reject) => {
    somethingSync()
    resolve(somethingAsync())
  })
  .then(result => {
    // do some stuff
  })
}
```

This approach saves you a tick (the synchronous code is executed right away), but it makes your code less regular.

## Slide 12

The first thing to observe as we talk about generators is how they differ from normal functions with respect to the "run to completion" expectation. With ES6 generators, we have a different kind of function, which may be paused in the middle, one or many times, and resumed later, allowing other code to run during these paused periods.

The main strength of generators is that they provide a single-threaded, synchronous-looking code style, while allowing you to hide the asynchronicity away as an implementation detail. This lets us express in a very natural way what the flow of our program's steps/statements is without simultaneously having to navigate asynchronous syntax and gotchas.

## Slide 13

The `yield index++` expression will send the `index` value out when pausing the generator function at that point, and whenever (if ever) the generator is restarted, whatever value is sent in will be the result of that expression, which will then get added to 1 and assigned to the `index` variable.

## Slide 14

DIAGRAM

## Slide 15

```js
function* countDown(maxValue) {
  yield max
  yield* countDown(max > 0 ? max - 1 : 0)
}

let counter = countDown(26)
counter.next().value // 26
counter.next().value // 25
```

rewritten in callback form:

```js
function downCounter(maxValue) {
  return {
    value: maxValue,
    next: () => {
      downCounter(maxValue > 0 ? maxValue - 1 : 0)
    }
  }
}

let counter = downCounter(26)
counter.value // 26
counter.next().value // 25
```

// TODO CLEAN THIS UP

While in my example, `counter.next().value` will always evaluate to 25 no matter where it occurs and how often we repeat it, this is not the case with the JS generator – at one point it is 26, then 25, and it could really be any number.

ES6 generator functions are "cooperative" in their concurrency behavior. Inside the generator function body, you use the new `yield` keyword to pause the function from inside itself. Nothing can pause a generator from the outside it pauses itself when it comes across a `yield`.

With normal functions, you get parameters at the beginning and a return value at the end. With generator functions, you send messages out with each `yield`, and you send messages back in with each restart.

## Slide 16

One of the most powerful parts of the ES6 generators design is that the semantics of the code inside a generator are synchronous, even if the external iteration control proceeds asynchronously.

That's a fancy/complicated way of saying that you can use simple error handling techniques that you're probably very familiar with -- the `try...catch` mechanism.

```js
function *foo() {
  try {
    const x = yield 3
    console.log(`x: ${x}`)
  }
  catch (err) {
    console.log(`Error: ${err}`)
  }
}
```

Even though the function will pause at the yield 3 expression, and may remain paused an arbitrary amount of time, if an error gets sent back to the generator, that try..catch will catch it! With normal async capabilities like callbacks, that's essentially impossible to do.

```js
const it = foo()
const res = it.next()
it.throw("ERROR!")
```

Generators have synchronous execution semantics, which means you can use the try..catch error handling mechanism across a yield statement. The generator iterator also has a throw(..) method to throw an error into the generator at its paused position, which can of course also be caught by a try..catch inside the generator.


## Slide 17

Async/await is a new way to write asynchronous code. Previous options for asynchronous code are callbacks and promises. Async/await is actually built on top of promises. It cannot be used with plain callbacks or node callbacks. Async/await is, like promises, non-blocking, and it makes asynchronous code look and behave a little more like synchronous code. This is where all its power lies. Any async function returns a promise implicitly, and the resolve value of the promise will be whatever you return from the function.

```js
async function getABC() {
  const A = await getValueA()
  const B = await getValueB()
  const C = await getValueC()

  return A*B*C
}
```

### Errors

If you’re familiar with promises you know that if a promise is rejected you’ll need to handle that error inside a `.catch`, and if you’re handling errors for both synchronous and asynchronous code you will likely have to duplicate your error handler.

```js
const asyncFunction = () => {
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

In the above snippet we can see that there is duplicate code on lines 6 and 8. The catch statement on line 7 will handle any errors that the synchronous function `doSynchronousThings` may throw but it won’t handle any errors thrown by getUsers since it is asynchronous. This example may seem palatable since all its doing is printing the error to the console, but if there is any kind of complex error handling logic we want to avoid duplicating it. Async / await lets us do exactly that:


```js
const asyncFunction = async () => {
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
const asyncFunction = async () => {
  try {
    const data = JSON.parse(await getJSON())
    console.log(data)
  } catch (err) {
    console.log(`Eek! an error: ${err}`)
  }
}
```

Async/await makes it finally possible to handle both synchronous and asynchronous errors with the same construct, good old `try...catch`. In the example below with promises, the try/catch will not handle if `JSON.parse` fails because it’s happening inside a promise. We need to call .catch on the promise and duplicate our error handling code, which will (hopefully) be more sophisticated than console.log in your production ready code.

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
