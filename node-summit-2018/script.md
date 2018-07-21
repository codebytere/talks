### Slide 1: What is Electron?

Before I really dive into this talk, i'd like to do a brief overview of the Electron project. At the highest level, it's a javascript framework that first sprang into existence about five years ago in 2015. Its impact lay in its capability to, for the first time, allow developers to use web technology, like JS, CSS, and HTML, instead of system languages like **Objective-C** and **C++**, to write applications for desktop platforms.

It embeds front and back-end components originally developed from web applications: **Chromium** and **Node.js**.

### Slide 2: What Can It Do?

These embedded components allow it to do a large range of things. For example, with Node, you have access to all of Node's native modules, so you could interact with the filesystem through the `fs` module. You can also create menus, windows, and communicate between processes. With these capabilities, you can bring features and processes to desktop that were previously confined only to the web.

### Slide 4: In The Wild

Here you can see a small handful of the more well-known Electron apps, designed to showcase some of its abilities. It enabled cross platform desktop development by lowing the barrier to entry, and also allows developers to build things that weren't previously possible. One example of this would be the P2P space; developers now have access to WebRTC
such that streaming peer-to-peer content over the internet is simpler than ever before.

### Slide 5: What's Changed?

Now, let's dive into the Electron ecosystem and talk about where we've been, where we find ourselves now, and where we think we're going. To guide this presentation, we're going to center around four primary loci of change: Roadmapping, Upgrades, Community, and Processes. Over the past year, these have been the larger categories where we've seen the most growth and continual definition. These categories are vague on their face, but i'll unpack each in more detail as we proceed.

### Slide 6: Community

A year ago, as I joined the team, Electron had a healthy developer community, but the core developer team was small

- couldn't engage with the community as well as we necessarily wanted
-
- mention that not all of our contributors push code (translators and others)

### Slide 7: How Do We Work?

The Electron team, while a GitHub project initially, has grown beyond our walls and now has a core team comprised of folks from a variety of companies. A small number of companies including Slack, Microsoft, and Atlassian employ folks to work directly on Electron, spread out across timezones and countries. As in any distributed large-scale open source project, meetings are hard, but we work to accommodate everyone's needs with multiple meetings as we maintain what is functionally a 24-hour development cycle.

### Slide 8: Upgrades

We vendor several dependencies in Electron, but the two that require continual upgrading and maintenance are Node.js and Chromium. We maintain a fork of Node in our organization, as well as a fork of Chromium we call `libchromiumcontent`. The name is resultant of the fact that we don't actually bundle all of Chromium, rather, we bundle the content layer and then selectively pull in several more pieces as they're needed. In the past year we've seen significant changes around how we approach and handle this maintainance.

**Node**
We're working more closely with Node Core and its community now, which allows us to more easily anticipate changes to Node versions and prepare for how they'll affect our own code. We also maintain 20 or so patches we apply to each successive Node upgrade in our fork, whivch is a number we'd like to reduce. As a result, we're also now working with Node developers to upstream patches to Node core in a way that's extensible and benefits other embedders beyond Electron.

**Chromium**
When I started, we were consistently 8-9 versions behind Chromium's current stable, and while we haven't reached our goal yet, we've gotten progressively closer as time has passed. At present, we have Chromium 66 in `master` currently while and stable is 67 and an upgrade is in progress. So, what changed? Primarily, we got more efficient at upgrading, and now have more resources and talented engineers who devote their time to the process. It's also important to discuss here _why_ we care significantly about catching up to Chromium. If we can track stable more closely, we can better communicate with the Chromium team and better prepare for breaking changes and deprecations of APIs that we're using in our own code. In this way, upgrading functions as a positive feedback loop, where the the closer we get the easier it becomes.

### Slide 9: Processes

Changes here mostly center around defining and implementing processes to be clearer and more maintainable, and to improve the core team's forward velocity as we continue to work towards improving Electron. By processes, here, I primarily want to focus on nontechnical processes, or the steps we've outlined for ourselves in several specific areas to guide out approaches to different problems. The first of these three areas is our approach to

**End of Life**
Previously, we had several release line branches we cut from but it wasn't very clear to a user to what degree of maintenance each branch was under, and what they could expect moving forward in terms of support for a given branch. We spent time discussing the trade-offs of each particular form of EOL, and eventually landed on a process you can now find in our docs on *electronjs.org*.

**Issue Triage and Tracking**
We still use our issue tracker to see what the primary issues are that users experience for each new version and what new features they would like to see in future versions. However, we found that since we have such a wide range of use cases, it was difficult to discern the impact of certain bugs as blockers on larger-scale apps in the Electron ecosystem. As a result, we recently we implemented something we think will go a long way towards allowing us to better prioritize and make sure we're best addressing their needs as well as the needs of less widely used apps in the ecosystem. We're calling it the App Feedback Program, and it allows for large-scale Electron apps to report app-specific bugs, blockers, and feature requests to the team. It remains in earlier stages, but at present we would like apps to run for a certain number of user hours during the beta cycle, and then report in with the blocking bugs that they find. We then add these to our project board for stability of each release line, and have a clearer and more actionable idea of what it will take for us to reach stability.

**Backporting**
Our backporting process highlights the line dividing what we can automate and what we can't. During a hackweek a few months ago, several of us drank what was probably way too much coffee and use GitHub apps and Probot to create a bot that responds to events on GitHub. It opens up backport pull requests to specified release line branches when pull requests are merged to `master`. We tag PRs with labels to let the bot know where to backport them, but whitelisted developers can also post a comment to the PR that will manually trigger the process. Recently, GitHub exposed the API endpoint to GitHub apps that allows them to merge PRs by themselves, but after discussion we decided clearly that the approval and merge process should not be automated, as it currently couldn't replicate the careful once-over of a human even if the patches applied cleanly.

### Slide 10: Roadmapping

### Slide 11: How Do We Prioritize?

### Slide 12: What's Next?


