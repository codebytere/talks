# Intro

## Who Am I?

Shelley Vohr, a software engineer at GitHub working on open source. I help build and maintain Electron, which is a javascript framework that allows you to use web technologies to build cross-platform native desktop apps.

## Why Am I Here?

Today, I want to do a deep dive into the mechanics of asynchronous programming in javascript. To make sure we're all on the same page before I really get started, I'll go over basic principles of async. Then, I'll get into the timeline of its development within the javascript ecosystem, and we'll launch into different methodologies and the nuances of what exactly differentiates them.

# Basic Async

So, asynchronous programming. Let's say you have a little program written in a single file, index.js. It might all be in the same file, but it's made up of functions, and at any given time only one of these is going to be executing _now_. The rest will execute _later_, at some point in the future. That, there, is the crux of async: the relationship between now and later, and how you manage this relationship with your code. What is key here, however, and what causes some of the most difficulties for developers when they're just starting out, is that _later_ doesn't mean strictly and immediately after _now_. We won't have blocking behavior as you might intuitively expect or want from your code.

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

Now that we've covered the basic conceptual underpinnings of asynchrony, let's move on to what async has looked like in previous years, and where we are now. If we look at the example I had up earlier, we can see javascript clearly allowing for asynchrony. However, before ES6, there actually was no notion of now and later built into the engine itself. It only ran exactly what you told it to run. However, it is this in itself that originally allowed for the notion of time to be used in javascript; the javascript engine runs inside a hosting environment, and it is this environment that historically scheduled javascript code executions. We'll go into callbacks in a minute or two, but let's say your program needs to make a network request to get all the restaurants within a 50 mile radius of your house. When you have this data, you'll sort the restaurants by distance. However, you need to somehow wait for the data to come back before you can perform this sorting. Here, the JS engine would tell the hosting environment, "Hey, I'm going to suspend execution for now, but whenever you've got all that restaurant data back, please call this response function back." The browser is then set up to listen for the response from the network, and when it has the data back that you asked for, it schedules the "response", or callback function to be executed by inserting it into the event loop.

 << i need to talk about the event loop here, but is this the best place to do it? >>

## Callbacks

Ok, so I started talking about callbacks before, so let's step back a bit and look at exactly what this means and how it's used.

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
