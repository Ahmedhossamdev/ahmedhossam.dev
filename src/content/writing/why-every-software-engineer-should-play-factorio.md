---
title: "Why every software engineer should play Factorio"
description: "Playing Factorio made a few software problems easier for me to see."
publishedAt: 2026-09-10
draft: false
tags:
  - software
  - systems
  - games
  - thoughts
---

![A large Factorio factory with production blocks, conveyor belts, and rail lines](/images/factorio-factory-overview.webp)

My friend Yousef introduced me to Factorio. We played together at first, and he taught me enough to get through the confusing first hour. Without him, I probably would have given up.

Then I stopped playing for a while.

After I finished my military service, I went back to play it on my own. I would fix something, then notice another problem somewhere else. Iron was slow, then the furnaces could not keep up, then a belt was full. I got pulled into fixing things one by one and lost track of time.

At first, Factorio is pretty simple. You mine some iron and coal, make a drill and a furnace, and slowly start automating things.

## The bottleneck keeps moving

Early on, I kept thinking, "I need more iron." I added drills, then the ore arrived faster than the furnaces could process it. I added furnaces, then the belt was too slow. After fixing that, the assemblers fell behind. Later, copper became the problem.

![Rows of Factorio furnaces connected by belts carrying ore and metal plates](/images/factorio-smelting-throughput.webp)

Adding more drills did not help because the furnaces were already full. I was already used to this idea in software, but seeing it happen in the game made it easier to notice.

## I was distributing iron badly

One belt could carry iron to several assemblers, but the first machines sometimes took everything and the last ones sat idle. There was enough iron. My layout was the problem.

I added splitters and changed the belts so the machines received iron more evenly. At some point, I realized I was thinking about it like load balancing.

![Factorio assemblers fed by branching and merging conveyor belts](/images/factorio-belt-balancing.webp)

## The queues are on the belts

In software, I usually see queues in a dashboard or a log. In Factorio, the belt is the queue. When miners produce more than the next step can use, the belt fills up. Eventually the machines behind it have nowhere to put their output.

![Dense Factorio conveyor belts carrying several resources through assemblers](/images/factorio-visible-backpressure.webp)

I could add a chest and make things move again for a while. It gave the extra items somewhere to go, but it did not make the next machine faster. It felt similar to adding a bigger buffer to a slow consumer.

## More machines still need supply

Adding more machines helped, but I still had to give them enough ore and move their output somewhere useful. So I stopped looking only at the machine I had just added and started checking what was happening before and after it too.

## A bigger factory is harder to understand

At the start, debugging was simple. I could walk around, see what had run out, and fix it. Later, trains, robots, and production lines covered more of the map. A machine could stop because of something far away.

![A zoomed-out Factorio factory organized around a central bus and production blocks](/images/factorio-system-complexity.webp)

I started checking the production statistics more often because looking at one machine was not enough. It reminded me of why we need observability in software. Once the system gets big enough, you cannot understand everything by looking at one part of it.

## There is always another design to try

The [Factorio community on Reddit](https://www.reddit.com/r/factorio/) is full of people sharing blueprints, debugging train signals, and showing factories much bigger than mine. Some megabases look like cities. I thought some also looked like the inside of a CPU, with repeated blocks and lines carrying things between them.

![An enormous Factorio megabase resembling a dense city or the circuitry inside a processor](/images/factorio-megabase.webp)

There is no single correct factory. Some people spend more than 5,000 hours optimizing these things. I can see how that happens, but it is easy to forget the time when there is always one more thing to fix.

I like Factorio because I can build something, see where it gets stuck, fix it, and then find another problem somewhere else.

And somehow I can spend hours doing that.

I also found this funny video by Tony Zhu about why Factorio teaches software engineering. The title sounds like a joke, but after playing again, I understood why people make that connection.

<div class="video-embed">
  <iframe
    src="https://www.youtube-nocookie.com/embed/vPdUjLqC15Q"
    title="Factorio teaches you software engineering, seriously."
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

*[Factorio teaches you software engineering, seriously](https://www.youtube.com/watch?v=vPdUjLqC15Q), by Tony Zhu.*

*Screenshots courtesy of [Factorio](https://www.factorio.com/), from its official press kit.*
