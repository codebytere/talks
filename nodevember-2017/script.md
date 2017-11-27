## Slide 1

I'm Shelley Vohr, a software engineer at GitHub working on open source. I help build and maintain Electron, which is a javascript framework that allows you to use web technologies to build cross-platform native desktop apps.

Today, I want to do a deep dive into the mechanics of asynchronous programming in javascript. To make sure we're all on the same page before I really get started, I'll go over basic principles of async. Then, we'll launch into different methodologies and the nuances of what exactly differentiates them, and then finally we'll compare over the spectrum of option to discuss what approach is best.

## SLIDE 2

So, asynchronous programming. Let's say you have a little program written in a single file, `index.js`. It might all be in the same file, but it's made up of functions, and at any given time only one of these is going to be executing _now_. The rest will execute _later_, at some point in the future. That, there, is the crux of async: the relationship between now and later, and how you manage this relationship with your code. What is key here, however, and what causes some of the most difficulties for developers when they're just starting out, is that _later_ doesn't mean strictly and immediately after _now_. It could be at any point in the future, and you don't necessarily know when that will be.

Now that we've covered the basics of asynchrony, let's move on to some of the technical underpinnings of how code is executed in the javascript environment.

To understand how code is executed, it's best to start with the event loop. The event loop can best be conceptualized as an endlessly running. singly-threaded loop, where each iteration runs a small chunk of the code in the program currently being executed. If you wanted to run a chunk of code at a later time, that chunk would simply be added to a queue for the event loop, and when the time came that you desired it to execute it would be dequeued and executed. With ES6 came a new concept called the job queue, but we'll save that for a little later.

## SLIDE 3

It's also important to mention that JavaScript has what's known as run-to-completion semantics: this means that the current task always finishes before the next task begins, or until it explicitly yields control back to the scheduler.As a result of this, each task has complete control over all current state and doesn’t have to worry about concurrent modification, or another task modifying things at the same time.

Looking at the code here, running this will always print ‘first’ then ‘second’ because while the function starting in setTimeout is added to the task queue immediately, it’s only executed after the current piece of code is done, since it yielded control.

Now, let’s take a look at the JS call stack.

## Slide 4

When a function `foo()` calls a function `bar()`, `bar()` needs to know where to return to inside `foo()` after it is done. This information is managed with the call stack. Take a look at the set  of three functions on the lefthand side of the slide, and let’s walk through how this stack will look as the program executes.

Initially, when the program above is started, the call stack is empty. After `foo(3)` is called, the stack has one entry: its entry in global scope, so that `foo(3)` knows where to return to when it is finished.  Next, after `bar(x + 1)` is called, the stack has 2 entries; it’s now stored the location that `bar(x + 1)` needs to return to when it’s finished executing, in addition to global scope. This trend continues as `baz(y + 1)`  is called, and the stack now contains `baz()`’s return address as well as the previous three return addresses from previous function calls. When `console.log()` is called in `baz()` we see the call stack, you’ll see it’s identical in the log to what I sketched out on the right side.  Next, each of the functions terminates and each time the top entry is removed from the stack. After function `foo(3)` is done, we are back in global scope and the call stack is empty. At the end of this program we return and the stack is empty, which means that the program terminates.

We're going to use this as a template for understanding the asynchronous techniques i'm about to discuss, so let's also take a second and look at it visually.

## Slide 5

In looking at this, you can see a handful of the things i've previously mentioned: the event loop, the task queue, and the stack. The current task comes off the event queue, and its location is stored in memory while relevant variables populate the heap. The task queue is populated by task sources, which would be a particular chunk of code in an executing program.

This snapshot would represent the moment after all functions in the previous slide had executed and before locations had begin to pop off the stack.

## Slide 6

I'm sure most all of you are familiar with or have encountered callbacks, so i'm going to focus more on how they fit into the async landscape as a whole. Let's start by looking at some functions, and talking about them in context.

## Slide 7

Here, you can see I have two programs side by side. On the left, the function names are alphabetical from the top down, and on the right side, I've mapped the letters to the order in which they run. Most likely, your eyes have to do a significant amount of jumping around to discern the order in which the functions are executing for the program on the left, since they don't run in top-down sequential order you expect. Instead of proceeding linearly top down, it started with the top line, then jumped to the bottom, then the second line, then down one, then jump down one, then back up. By following letters on the right you probably had an easier time, so let's talk about why that is. Your brain operates sequentially, which places it at odds with the inherent functionality of callbacks.  This is a comparatively simpler example; when callbacks start to nest significantly we enter what’s known as callback hell, which becomes progressively more difficult for your brain to reason through.

What’s happening here in terms of the call stack, and by extension, the event loop? Assuming all of these functions are async, doA will begin, then immediately return control, and then doB will execute. A callback was registered by doA, so the next available task will be the callback. Now doC will execute, followed by doD, doD registers a callback, and then returns control so that doE executes. The callback registered by doD will come off the queue and execute, and then finally  doF will execute.

For each of these function taking a callback, the callback itself is a black box for the function. The continuation of the program is dependent on our handing that callback over to another part of the code, and essentially praying that it will do the correct thing when the callback is invoked. This paradigm is known as inversion of control, and can create trust challenges for those using a program.

### Slide 8

A few minutes ago, I talked about how you probably had a more difficult time reading the program on the left of the previous slide.  When you struggle to understand how and when each part of code is working, it's undoubtedly hard to deal with errors in that code. Within the callback landscape, there are two ways in which errors are reported – via callbacks and via exceptions. You have to be careful to combine both properly. The most obvious, but occasionally overlooked aspect of dealing with errors in callbacks is to make sure you've actually handled all of them!

However! There is a caveat to this advice, and it lies in how specifically the error are caught. Did you see how in the snippet i showed I _returned_ the error, and didn't throw it? That was intentional, because exceptions are only a synchronous mechanism, which is logical: in an asynchronous environment, the exception could be thrown when the handler block is already out of scope and thus be rendered meaningless.

## Slide 9

The next big innovation in asynchrony, promises, hit javascript with ES6. Before this, there was no direct notion of asynchrony built into the Javascript engine. All it ever did was execute a single chunk of your program at any given moment, when asked to. You, the developer, _asked it to_ by means of callbacks or timeouts, in order to shuffle its place in the event loop. With promises came a change to the JS engine, which took the form of the queue I mentioned very briefly a little while ago: the microtask queue. Before I delve into how exactly this changes the form of the stack/queue/event-loop diagram I showed you earlier, let's look at an example of a program utilizing promises, and talk about what’s happening and why.

## Slide 10

At the top here we declare a variable prom. Promises act as placeholders, allowing us to reason about future values without necessarily knowing the outcome, making it functionally extemporaneous. When the future value is settled, it might succeed or fail, and then at that point it's no longer a placeholder and becomes an immutable value. A few slides ago I referenced a paradigm known as inversion of control, where we handed off callbacks and sort of hoped they did the right thing. With promises, we remove that inversion. Promises return to us a capability to know when its given task finishes, and then our code could decide what to do next based on task results.

Importantly, promises may seem like an entirely different paradigm, but in fact they don't get rid of callbacks at all. They just change where the callback is passed to, and remove the black-box effect we saw previously. We get back from q function the ability to know when it’s completed, and then perform new tasks from there. Promises are not just a mechanism for single-step operations that follow a this-then-that flow. They’re capable of that, but it turns out we can string multiple Promises together to represent a sequence of async steps. This ability is conferred to us as a result of two key characteristics of promises, which are that 1)  Every time you call `then(..)` on a Promise, it creates and returns a new Promise, and 2) the value returned from the `.then(..)` call's fulfillment callback (the first parameter) is automatically set as the fulfillment of the chained Promise. Looking on the slide, by returning “Hello world!”,  we fulfill the promise that the first `.then(..)` call created and returned. When the next `.then(..)` call runs, it's receiving the fulfillment from the return “Hello World” statement. The second `.then(..)` would then create yet another promise.

How does this look under the hood? Promises utilize the microtask, or Job, queue, which allows us to basically say “here's this thing I need to do later, but I want to ensure it happens right away before anything else can happen.” The job queue can best be thought of as a little queue attached to each tick in the event loop. Some async actions will be added to the end of the current tick’s job queue, instead of creating a whole new tick in the event loop queue. When promises are resolved or are rejected, the associated handlers will be called asynchronously as Jobs, and so added to the queue for the current tick.

## Slide 11

This diagram looks nearly identical to the diagram I showed before, with one key difference: the addition of the microtask queue.  Once a promise settles, or if it has already settled, it queues a microtask for its reactionary callbacks. This ensures promise callbacks are async even if the promise has already settled. So calling `.then(resolve, reject)` against a settled promise immediately queues a microtask. Any additional microtasks queued during microtasks are added to the end of the queue and also processed.

So, in looking at the diagram, you'll see that the current task can come off either the task queue or the microtask queue. All promise callbacks are queued as microtasks, so if we jump to the previous slide for a moment, the callbacks for `p1` and `p2`, where `val` is printed to the console, would both have been added to the microtask queue instead of the task queue.

## Slide 12

What happens if something goes wrong in a promise? How do we deal with those errors? By default, it turns out, promises are silently swallowed if unhandled. More specifically, any exception which is thrown within a `then` handler, or within the function passed to new `Promise`, will be silently disposed of unless manually handled.

The standard way to handle errors from promises is to add a `catch()` handler at the end of your promise chain. You can also chain these handlers, so that you can throw errors into higher-level scopes. Catching and re-throwing errors in this way will tell you which higher-level module lead to the error which means that you can later debug the issue on a top-down or layer-by-layer basis.

If exceptions are thrown inside the callbacks of `then()` and `catch()` then that’s not a problem, because these two methods convert them to rejections. Let's look at an example and talk about what would work and what wouldn't in more concrete terms.

This is a simple promise example, and from looking at it you can see that `prom` is going to reject with an error no matter what. So, what happens in the first example vs. the second? The first has a `catch`, so it's going to print error, followed by the error message, which in this case is 'rejected!'. You can also see the associated call stack by printing error.stack. The second one doesn't have a catch, so even though it threw an error it'll silently fail.

## Slide 13

The first thing to observe as we talk about generators is how they differ from normal functions. There are several notable differences, but key to generators is their behavior with respect to the "run to completion" expectation. With ES6 generators, we have a different kind of function, which can be paused in the middle either one or several times. It resumed later, so that other code to run during these paused periods between runs.

The main strength of generators is that they provide a single-threaded, synchronous-looking code style, while allowing you to hide the asynchronicity away as an implementation detail. This lets us express in a naturally what our program's step and statement flow is, without having to navigate asynchronous syntax and gotchas at the same time. To get a better idea of how this looks in practice, let's see a function.

## Slide 14

Here, you'll see immediately that there's a little star next to the function in the signature; this is the syntactical indicator that you're looking at the generator function. The keyword `yield` will send out a value whenever the function is run. So, here, The `yield index++` expression will send the `index` value out when pausing the generator function at that point. Whenever (if ever) the generator is restarted, whatever value is sent in will be the result of that expression, which will then get added to 1 and assigned to the `index` variable. When we start, index is zero, so this will be yielded and then 1 will be added to index as a result of the `++`. This will occur each time as the value of `index` is passed out and then in again, so that it increments by 1 every time. To see this a little more clearly, we can look at a diagrammatical representation.

## Slide 15

On the left, you'll see a traditional non-generator function: it adheres to the run-to completion behavior we expect from functions, with no interruptions from beginning to end. On the right is the generator function, with multiple stops a starts between beginning and end.

It's important to note that there is really no official 'end' per se in a generator function; the end in this case would just be the last time that yield is called. When the generator function is initialized, an iterator is returned, and then the generator starts with the first `next()` call on the function. The function pauses when `yield` is called, and then would restart with the next call to `next()`, and so on an so on.

To recap, with normal functions, you get parameters at the beginning and a return value at the end. With generator functions, you send messages out with each `yield`, and you send messages back in with each restart.

So, what does this look like from a stack perspective?

## Slide 16

One of the most powerful parts of the ES6 generators design is that the semantics of the code inside a generator are synchronous, even if the external iteration control proceeds asynchronously.

That's a fancy way of saying that you can use simple error handling techniques that you're probably very familiar with -- the `try...catch` mechanism.

Even though the function will pause at the yield 3 expression, and may remain paused an arbitrary amount of time, if an error gets sent back to the generator, that try..catch will catch it! With normal async capabilities like callbacks, that's essentially impossible to do.

Generators have synchronous execution semantics, which means you can use the try..catch error handling mechanism across a yield statement. The generator iterator also has a throw(..) method to throw an error into the generator at its paused position, which can of course also be caught by a try..catch inside the generator.

## Slide 17

Async/await is a new way to write asynchronous code. Previous options for asynchronous code are callbacks and promises. Async/await was created to simplify the process of working with and writing chained promises, and so `async/await` functions return promises. They cannot be used with plain callbacks or node callbacks. Async/await is thus, like promises, non-blocking, and it makes asynchronous code look and behave a little more like synchronous code. This is where all its power lies. Since any `async/await` function returns a promise implicitly, and the resolve value of the promise will be whatever you return from the function.

To illustrate, let's look at some code.

## Slide 18

Here, we're returning a string that contains several components of a street address. The function has the keyword async before it, and the await keyword can only be used inside functions defined with async. All four variables must be resolved before the function will return the desired string. Also important to note here is that if we did not use the `await` keyword before the address component functions, this function would not necessarily fail. It wuld just mean that the variables would be set to Promise objects instead of the values resolved from them.

Under the hood, `async/await` works exactly the same as promises, utilizing the new microtask queue introduced in ES6 to handle async operations.

## Slide 19

If you’re familiar with promises you know that if a promise is rejected you’ll need to handle that error inside a `.catch()`, and if you’re handling errors for both synchronous and asynchronous code you will likely have to duplicate your error handler.

In the above snippet we can see that there is duplicate code on lines 6 and 8. The catch statement on line 7 will handle any errors that the synchronous function `doSynchronousThings` may throw but it won’t handle any errors thrown by getUsers since it is asynchronous. This example may seem palatable since all its doing is printing the error to the console, but if there is any kind of complex error handling logic we want to avoid duplicating it. `async/await` lets us do exactly that:

Here, we can both minimize the total amount of code we use and catch errors in a more readable and clear way.

## Slide 20

Imagine a piece of code that calls multiple promises in a chain, and somewhere down the chain an error is thrown. The error stack returned from a promise chain gives no clue of where the error happened.

Looking at the code here, you'll see two similar constructions, one with promises and one with `async/await`. The one on the left shows this error stack, where we see a huge chain of then's in a somewhat confusing error. On the right side, the async/await construction gives us this comparatively simpler error, telling is what line the error came from without the huge `then` chain.

The promise error stack also somewhat misleading, in that the only function name it contains is `doSomething()` which doesn't really help in determining which call of that function caused the error. Conversely, the error stack from `async/await` points to the function that contains the error. When you’re trying to use error logs coming from some server to debug code, this is invaluable. In such cases, knowing the error happened in a specific call of `someFunction()` is significantly better than knowing that the error came from somewhere in a long line of `.then`'s.

# Slide 21

So, wrapping up!

# Slide 22

Our brains plan things out in sequential, blocking, single-threaded semantic ways, but callbacks express asynchronous flow in a rather nonlinear, non-sequential way, which makes reasoning properly about such code much harder. Callbacks suffer from lack of sequentiality and lack of trustability, but they are good in situations where you may just be performing a simple request that's always asynchronous. They're just plain functions, so they also don't require any additional understanding beyond knowing how an asynchronous operation works. They also tend to be more verbose, so coordinating multiple asynchronous requests concurrently can lead to callback hell if you're not actively modularizing your functions. Dealing with errors also tends to be more confusing since there could be many Error objects that all go back to a single error further down the call stack.

Promises are easier to reason about, although they still have their downsides. They're especially useful for coordinating or managing multiple asynchronous operations, propagating errors from nested or deeply nested async operations, and dynamically chaining asynchronous operations, ie those where you would do something asynchronous, examine output, and then do other asynchronous things based on the intermediate value. Errors and error stacks in promises can be a challenge, because they can behave unintuitively in the way they print errors when they're thrown.They brought new changes to the javascript engine, and paved the way for later innovations like `async/await.`

This latest async pattern is essentially syntactical sugar on promises, but it allows for far more intuitive reading of asynchronous code. They also improve error handling compared to traditional promises, and can be handled with simple `try-catch` blocks. It's so easy to use `async/await` for asynchronous operations that one of its slight dangers is that you'll forget you're dealing with asynchronous code at all.

Ultimately, the best tool to use is the one for the job you're doing, but now I hope you'll have a firmer grasp on what exactly makes each of these tools a best fit for certain jobs, and be able to use them with a deeper understanding of what's going on at a granular level.

Thank you!
