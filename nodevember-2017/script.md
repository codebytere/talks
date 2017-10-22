# Intro

## Who Am I?

Shelley Vohr, a software engineer at GitHub working on open source. I help build and maintain Electron, which is a javascript framework that allows you to use web technologies to build cross-platform native desktop apps.

## Why Am I Here?

Today, I want to do a deep dive into the mechanics of asynchronous programming in javascript. To make sure we're all on the same page before I really get started, I'll go over basic principles of async. Then, I'll get into the timeline of its development within the javascript ecosystem, and we'll launch into different methodologies and the nuances of what exactly differentiates them.

# Basic Async

So, asynchronous programming. Let's say you have a little program written in a single file, index.js. It might all be in the same file, but it's made up of functions, and at any given time only one of these is going to be executing _now_. The rest will execute _later_, at some point in the future. That, there, is the crux of async: the relationship between now and later, and how you manage this relationship with your code. What is key here, however, and what causes some of the most difficulties for developers when they're just starting out, is that _later_ doesn't mean strictly and immediately after _now_. We won't have blocking behavior as you might naturally expect from your code.

```javascript
function now() {
  console.log("i am executing right now!")
}

function later() {
  console.log("i executed later, after now()!")
}

const answer = now();
setTimeout(later, 1000);
```

# The Current Landscape

Now that we've covered the basic conceptual underpinnings of asynchrony, let's move on to what async has looked like in previous years, and where we are now. If we look at the example I had up earlier, we can see javascript clearly allowing for asynchrony. However, before ES6, there actually was no notion of now and later built into the engine itself. It only ran exactly what you told it to run. However, it is this in itself that originally allowed for the notion of time to be used in javascript; the javascript engine runs inside a hosting environment, and it is this environment that historically scheduled javascript code executions. We'll go into callbacks in a minute or two, but let's say your program needs to make a network request to get all the restaurants within a 50 mile radius of your house. When you have this data, you'll sort the restaurants by distance. However, you need to somehow wait for the data to come back before you can perform this sorting. Here, the JS engine would tell the hosting environment, "Hey, I'm going to suspend execution for now, but whenever you've got all that restaurant data back, let me know and i'll hop back into action" The browser is then set up to listen for the response from the network, and when it has the data back that you asked for, it schedules the response to be executed by inserting it into the event loop.

What's the event loop? This changed a bit with ES6, but as I said before there was no concept of asynchrony innate to the JS engine. The event loop, thus, can best be conceptualized as an endlessly running. singly-threaded loop, where each iteration ran a small chunk of the code in the program currently being executed. If you wanted to run a chunk of code at a later time, that chunk would simply be added to a queue for the event loop, and when the time came that you desired it to execute it would be dequeued and executed. With ES6 came a new concept called the job queue, but we'll save that for a little later, and launch into the specifics of how this "response" code.

## Callbacks

When I talk about "response" code in the pre-ES6 era, what I really mean is callbacks. I'm sure most all of you are familiar with or have encountered callbacks, so i'm going to focus more on how they fit into the async landscape as a whole. Let's start by looking at the functions I have on the screen here, and talking about it in context.

```javascript
doA(function() {
  doB();
  doC(function() {
    doD();
  })
  doE();
});
doF();
```

```js
doA(function() {
  doC();
  doD(function() {
  	doF();
  })
  doE();
});
doB();
```

So you can see I have two functions side by side, and your eyes have to do a significant amount of jumping around to discern the order in which the functions are executing. On the right side, i've mapped the letters to the order in which they run.

### How It Works

### Errors

### Conditionals

### Intermediate Values

### Debugging

## Generators

### How It Works

### Errors

### Conditionals

### Intermediate Values

### Debugging

## Promises

### How It Works

### Errors

### Conditionals

### Intermediate Values

### Debugging

## Async/Await

### How It Works

### Errors

### Conditionals

### Intermediate Values

### Debugging

# Comparisons

## When Do I Want To Use Each?

### Use Cases

## Is There a Best?

### Why/Why Not?

# Wrapping Up

## What's the Takeaway?

Thank you!
