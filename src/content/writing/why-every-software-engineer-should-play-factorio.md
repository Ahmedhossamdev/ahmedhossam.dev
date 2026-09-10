---
title: "Why every software engineer should play Factorio"
description: "A factory-building game made bottlenecks, queues, scaling, and system design feel surprisingly real."
publishedAt: 2026-09-10
draft: true
tags:
  - software
  - systems
  - games
  - thoughts
---

![A large Factorio factory with production blocks, conveyor belts, and rail lines](/images/factorio-factory-overview.webp)

My friend Yousef introduced me to Factorio. We played it together at first, and he taught me the basics. Without him, I probably would have given up during that confusing first hour.

Then I stopped playing anyway.

When I came back later, something clicked. I kept fixing one small problem after another and got completely lost in the factory.

The premise is simple: you crash on an alien planet with almost nothing. You mine iron, collect coal, craft a drill, and build a furnace. Soon you have belts and assemblers too. Without really noticing, you stop collecting resources and start designing a system.

That is what got me. Factorio makes software-engineering problems physical: throughput travels on belts, queues pile up in front of you, and one bad dependency can stop half the factory.

I also saw this funny video by comedian Tony Zhu about why Factorio teaches you software engineering. The title sounds like a joke, but after getting lost in the game again, it made a lot of sense.

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

## The bottleneck always moves

Early in the game, the problem is usually obvious:

> I need more iron.

You add drills. Soon they produce ore faster than the furnaces can process it, so iron piles up. Add furnaces and the belt becomes too slow. Upgrade the belt and the assemblers fall behind. Fix those, and suddenly copper is running out.

You solved the iron problem and created a copper problem. Congratulations.

![Rows of Factorio furnaces connected by belts carrying ore and metal plates](/images/factorio-smelting-throughput.webp)

Making one component faster does not necessarily make the system faster. Twenty drills feeding two furnaces are still limited by two furnaces. Application servers handling 10,000 requests per second are still limited by a database that tops out at 2,000.

What matters is the whole path. Improve its slowest part, measure again, and find where the constraint moved.

## Load balancing, but with iron

One belt might carry iron to six assemblers, but a poor layout lets the first few machines take everything while the last ones sit idle. The factory has enough iron; it just distributes it badly.

So you add splitters. One belt becomes two, then four, until you zoom out and realize: I'm load balancing iron.

![Factorio assemblers fed by branching and merging conveyor belts](/images/factorio-belt-balancing.webp)

The input is not HTTP requests and the consumers are not servers, but the question is familiar: how do I distribute work without overwhelming one consumer and starving another? Here, the idle machine is right in front of you.

## Queues you can stand next to

Software queues are usually numbers. A dashboard says `queue_length = 14,382`, and you know it is time to investigate.

In Factorio, the queue is the belt. When miners outrun the next stage, it fills until the machines behind it have nowhere to put their output. You can watch congestion travel backward through the factory.

That is backpressure, except you can walk around it.

![Dense Factorio conveyor belts carrying several resources through assemblers](/images/factorio-visible-backpressure.webp)

Add a chest and everything moves again. For a while. The buffer absorbs a spike but does not create capacity. Software queues also buy time, but a larger queue cannot fix a permanently slow consumer. Sometimes it only hides the fire behind a larger wall.

## Scaling one layer is not enough

Many Factorio problems get the same answer: build more machines. One furnace becomes four, then twenty. That is horizontal scaling in work boots.

But you still have to feed them and move their output. Ten assemblers are useless if the belt supplies only three. Faster machines do not help when the next belt is full.

It teaches you to care about end-to-end throughput. Making one function 50% faster feels good, but did the request get faster?

Local optimization can even hurt the whole factory. Speed up one line and it may consume so much iron that another stops. One team's metrics improve while total output falls; service boundaries do not break dependencies.

The game also lets you perfect a belt balancer nobody needs. That's the equivalent of optimizing a two-millisecond function beside an 800-millisecond database query. Four full belts look wonderful, but good engineering means understanding demand, not maximizing every number.

## Creativity has no limit

There is no correct factory. You can build tidy production blocks, chaotic spaghetti belts, giant rail networks, circuit-controlled systems, or something nobody else would think of.

The [Factorio community on Reddit](https://www.reddit.com/r/factorio/) is part help desk, part engineering gallery. People share blueprints, debug train signals, compare absurd designs, and build megabases that stop looking like factories.

![An enormous Factorio megabase resembling a dense city or the circuitry inside a processor](/images/factorio-megabase.webp)

Zoom out and some factories look like cities. Others look like the inside of a CPU, with repeated blocks, branching paths, signals, inputs, and outputs packed into one machine. There is always another design to try and another percentage to optimize.

Some players spend more than 5,000 hours doing exactly that. That is fine if it is a hobby they love, but Factorio makes one more improvement feel urgent. The factory can wait. Enjoy the game, look at the clock, and take care of your time too.

## Complexity changes how you work

A small factory is easy to debug: walk around, find what ran out, and fix it. Later, trains, robots, and production lines cover the map. A failure can begin far away and reveal itself when one machine beside you stops.

By then, the factory is a dependency graph. Circuits need copper and iron; advanced products need circuits; miners need electricity. Lose copper and several lines fail. Lose power and almost everything stops.

Software has the same hidden chains: one service depends on another, then Redis, networking, and storage. And somewhere a certificate is waiting to expire on Friday night.

![A zoomed-out Factorio factory organized around a central bus and production blocks](/images/factorio-system-complexity.webp)

At that scale, individual machines tell you too little. You check production statistics. In software, that becomes metrics, logs, traces, and alerts. Observability becomes part of operating the system.

You also plan for failure. What happens when this ore patch runs out? Can another train reach the factory? Can the power grid handle every machine at once? Eventually, designing only for the happy path feels reckless.

## The factory must grow

There is a running joke: the factory must grow. One tiny drill becomes a mess of belts, trains, robots, and machines, and somehow you know what most of it does.

But that is why I like the game. It keeps asking the same questions good engineers should ask:

- Where is work waiting?
- What is limiting the system right now?
- What breaks if this component disappears?
- Will this change improve the final output?

Factorio does not explain that scaling one component cannot scale the system. It lets you build twenty machines and watch seventeen sit idle. It does not define backpressure; it lets you watch a belt fill until everything behind it stops.

You build something, find a problem, understand it, and fix it. The system works better. For about five minutes. Then the next bottleneck appears, and the factory grows again.

*Screenshots courtesy of [Factorio](https://www.factorio.com/), from its official press kit.*
