### Slide 1: What is Electron? [0M:38S]

Before I really dive into this talk, I'd like to do a brief overview of Electron. At the highest level, it's a javascript framework that first sprang into existence about five years ago. Its impact lies in its capability to, for the first time, allow developers to write applications for desktop platforms using web technologies, like JS, CSS, and HTML, instead of system languages like **Objective-C** and **C++**.

Electron embeds **Chromium** and **Node.js**, which comprise front and back-end components originally developed from web applications.

### Slide 2: What Can It Do? [1M:20S]

These embedded components allow Electron to do a large range of things. For example, Electron has access to all of Node's native modules, so you can interact with the filesystem through the `fs` module. You can also create menus, windows, and communicate between different types of processes. With these capabilities, you can bring features and processes to previously confined only to the web to desktop applications.

### Slide 3: In The Wild [2M:1S]

Here you can see a small handful of the more well-known Electron apps, which I've chosen to showcase some of its abilities. Electron enables cross platform desktop development by lowering the barrier to entry, which means that a smaller team can access multiple development platforms more cheaply than if they had to build and maintain multiple separate desktop apps. Electron also allows developers to build things that weren't previously possible. One example of this is the peer-to-peer space; because of Chromium, developers now have access to WebRTC, so streaming peer-to-peer content over the internet is simpler than ever before.

### Slide 4: What's Changed? [2M:22S]

Now, let's dive into the Electron ecosystem and talk about where we've been, where we find ourselves now, and where we think we're going. We'll do this by looking at four ways Electron's changed in the last year: Roadmapping, Upgrades, Community, and Processes.

### Slide 5: Community [5M:33S]

I'll start with community. When I joined the team a year ago, Electron had a healthy developer community, but the core developer team was small and so time constraints meant that we needed to spent most of our time looking internally. As a result, we were not able to engage with the larger community working on Electron as much as we wanted.

As the ecosystem and usage of Electron has grown, our core team has grown as well. This has given us more bandwidth to address developers' needs and work more closely with external contributors. We're actively trying to recognize everyone who adds value to Electron, whether they contribute by pushing code or in other ways. One key example of this would be the work that we've done in the past year around i18n of our documentation and website. This effort makes Electron more accessible to developers around the world, and it would absolutely not be possible without the work of contributors taking time to translate our documentation and work with us to crowdsource changes through all stages of the process.

Right now, community decisions are made through a democratic consensus process, which has worked well and allowed us to move forward effectively. Soon, however, we may move to formalize and alter this process in order to set Electron up for the highest chance of long-term success. I'll dive deeper into our plans for governance a little later on in this talk.

Involvement in the community ranges significantly, in terms of degree and of type of involvement that an individual can possible have. I mentioned our translators earlier, who help show that what constitutes involvement can't be unilaterally defined. Instead, the success of the Electron community is a function of the fact that our members _don't_ have all the same needs, interests, and skills.

Finally, how can you get involved in Electron? This is something we've worked to clarify over the past year by adding documentation around how our team approaches development and how you can find your niche within that. We've also been focusing on labeling issues as "good first issues" when we think it will help a contributor  familiarize themselves with the codebase. Core team members have also paired with developers looking to break into open source development, and have successfully helped them get both fixes and features merged into Electron core. These efforts have prompted the team to improve our own workflows, as sometimes it's hard to see what's unclear or could be improved about things you look at day in and day out.

### Slide 6: How Do We Work? [6M:36S]

While Electron was initially a GitHub project, it has greatly grown since then. Now, its core team is made up of folks from a variety of companies including Slack, Microsoft, and Atlassian, who employ folks to work directly on Electron. We’re spread out across time-zones and countries ranging from the US to India to Australia, which means we have to leave behind older synchronous ways of doing things since that’s near-impossible when your coworker wakes up at your bedtime.

As in any distributed open source project, meetings are hard, but we work to accommodate everyone's needs as we maintain what is functionally a 24-hour development cycle. We also work as a cross-company team: even though we’re employed by different companies we meet with each other directly and attend all the same stand-ups for Electron-related topics.

### Slide 7: Upgrades [10M:20S]

Next, let’s talk a little about upgrades. We vendor a few dependencies in Electron, but the two that require continual upgrading and maintenance are Node.js and Chromium. We maintain a fork of Node in our organization, as well as a fork of Chromium we called `libchromiumcontent`. The name `libchromiumcontent` is such because it's a shared library build of Chromium’s Content module; we selectively pull in a few other aspects of Chromium's source code as well but really only bundle the Content module. contrary to some conception that we pull all of it. In the past year we've seen significant changes around how we maintain of both of these dependencies.

**Node:**

Regarding Node maintenance, we're working more closely with Node Core and its surrounding community, which allows us to anticipate changes between Node versions and prepare for how they'll affect our own code. We also maintain 20 or so patches we apply to each successive Node upgrade in our personal fork. While the patches work for now, we'd like to have to patch less so that our maintenance burden is correspondingly decreased. To that end, we're also now working with Node developers to upstream patches to Node core in a way that benefits everyone. One last key thing here is that just because a patch applies cleanly doesn't mean you can necessarily assume it has the same effect that it always has. In one fun recent example, I went digging around source code of one method to figure out how to best upstream it, and in the process found that the thing it was originally designed to do actually hadn't been happening for the past 3 years. It turned out it was fixed upstream in a way that let the patch apply cleanly and we just never realized it.

**Chromium:**

Now, i'll turn to Chromium.When I started, we were consistently 8ish versions behind Chromium's current stable version. Our goal has been to catch up to that stable and beyond, and while we haven't reached our goal yet, we've gotten progressively closer as time has passed. Right now Chromium, which releases every six weeks, is at version 67. Electron is using Chromium 66 in a beta cycle.

So, what changed? For one, we got more efficient at upgrading, and now have more resources and engineers who devote their time to the process. It's also important to discuss here _why_ we care significantly about catching up to Chromium. If Electron can track stable more closely, our team can communicate with the Chromium team to better prepare for breaking changes to any functionalities Electron relies on. In this way, upgrading Electron to stay in stride with Chromium is a positive feedback loop: the closer we get, the easier it becomes. Ideally, we want to end up tracking Chromium's canary such that we can see how their changes affect us immediately and not some months down the line.

### Slide 8: Processes [14M:25S]
By processes here, I mean nontechnical processes, or guides we have created to systematically address different problems as they arise. Recent changes focus on defining and implementing process to be clear and extensible, which in turn helps the core team move forward quickly and efficiently. The first of the three main areas we’ve improved processes is n our approach to

**End of Life:**

Previously, we had several release line branches we cut from but it wasn't very clear to a user to what degree of maintenance each branch was under, and what they could expect moving forward in terms of support for a given branch. We spent time discussing the trade-offs of each particular form of EOL, and eventually settled on a process whereby the latest three release branches are supported by the Electron team. To put it in more concrete terms, our latest stable release line is 2.0.X, and so we currently support that line in addition to the `1.8.X` and `1.7.X` release lines. When `3-0-X` enters stable, developers can now know we no longer actively supported `1.7.X` and update accordingly.

**Issue Triage and Tracking:**

We still use our issue tracker to see what the primary issues are that users experience for each new version and what new features they would like to see in future versions. We found, though, that since we have such a wide range of use cases, it was difficult to figure out what bugs prevented app developers from upgrading to more recent versions, and to answer the question of "when does a beta become stable?".

In response to this question we started what we’re calling the App Feedback Program. Developers who track bug metrics on their Electron apps can participate by deploying with our betas and letting us know how many user-hours of testing they've had and which issues they're seeing. This measurement strategy has several angles: it not only lets us know what bugs are cropping up, but also how frequently they’re being seen, and the types of impact they have on end users. With that information, we can better prioritize what next steps are and answer the question of what determines stability in a more empirical and less anecdotal way.

**Backporting:**

Our backporting process highlights the line dividing what can be automated away and what can't. During a hack-week a few months ago, several of us drank what was probably way too much coffee and used GitHub apps and Probot to create a bot that responds to events on GitHub. It functions by opening up backport pull requests to specified release line branches when pull requests are merged to `master`. We tag PRs with labels to let the bot know where to backport them, but whitelisted developers can also post a comment to the PR that will manually trigger the process. Recently, GitHub exposed an API endpoint to GitHub apps that allows them to merge PRs by themselves, but after discussion we decided that the approval and merge process should not be automated. Even if the patches applied cleanly and CI testing passed, the careful once-over required to approve a pull request can’t sufficiently be replicated by a bot just yet.

### Slide 9: Roadmapping [15M:15S]

I've talked a bit about how we react to bugs and short term feature requests, but now I'd like to talk a bit about how we plan for the not-so-immediate future. For our team, this happens twice a year, at bi-annual planning summits. Importantly, these do not just involve the small core team, but also members of the community invested in the long term success of Electron and the tools around it. Our last summit was held with about 40 attendees, representing a wide range of products and interests. At these summits we break out into groups to discuss topics of most interest as decided at the beginning of the summit. At summit's end, we organize all of these output items and distill them into more actionable goals that individuals or small groups can then assume responsibility for and drive to the finish line.

### Slide 10: How Do We Prioritize? [15M:58S]

Given the vast amount of things we're working on at any given moment, how do we decide what the best uses of our time are? How do we choose the items that are best left to the backburner, and which are not? It's probably most accurate to say that at a given time we each have a set of individual priorities and a set of group priorities. These individual priorities might be a small feature or persnickety bug someone's been trying to fix for ages, and a group priority would be a task towards a larger overarching group goal like a blocker for the next beta version.

### Slide 11: What's Next? [20M:07S]

I've talked a lot about where we are now and where we've been, but where do we really want to go in the next year? After that? At present, we've grouped the output items from our last summit into four big buckets: Governance, Transparency, Release Process, and Security. We'll start with Governance, which I mentioned briefly earlier and can now dive more deeply into.

**Governance:**

As we've grown over the past year, we've started to recognize the need for a more clearly delineated governance system then we've had for the past several years. That's not to say that what we've had has proven itself to be insufficient, rather, that we want to set ourselves up for the greatest level of success as we see ourselves on a trajectory where it may become insufficient. We believe this change will allow for newer developers to start contributing to the community and understand its processes as well as the ways in which they can make their opinions heard and know whom to talk to about a given topic or initiative.

**Transparency:**

In terms of transparency, we're an open source project, which by nature means that all of our source code is public and all its history viewable and searchable. However, that's not the end of the story. We have project boards that aren't always viewable or discoverable, as well as meetings and meeting notes that are accessible but which developers looking to gain better insight may not know about or be able to find. To address these gaps, we're working to decide how to make our activities more available. It's also difficult to know what provides the most value to the community, so to gain a better understanding of that we're currently soliciting feedback from our ecosystem. In the near future, you'll see a more complete picture of our progress as well as what our short and long-term goals are.

**Release Process:**

We made some significant updates to our release process in the past year, namely switching to semantic versioning starting with 2.0.0 and organizing releases around upgrades so that major version bumps correspond to Chromium version upgrades. This makes for a faster release cadence, but we still feel we have a lot to iterate on and improve. We introduced beta versions recently, and in the near future you'll be able to expect a more predictable timeline for beta cycle and stable release versions. We're also moving to nightly builds, which we think will help developers feel more confident in upgrading as they'll these builds immediate feed back to developers for how changes in Electron may have broken their build in more incremental and digestible ways.

**Security:**

Security is something that is broached a lot by core developers and users of the framework, and is something we're aware of and working to improve proactively rather than reactively. We're moving towards a more secure by default model, which will entail changes to the `<webview>` tag, url handling, navigation, web contents, and permission handling. We'd also like to improve our story around sandboxing, which we've had for a while but which could always stand to be improved and would help developers feel more confident in the security status of their apps.

### Slide 12: Thank you! [20M:20S]

As we continue to grow and improve as a team, we'd love to help if you have questions or are interested in contributing or giving us feedback so please feel free to reach out! Thank you!