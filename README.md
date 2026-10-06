# World Signals for Minecraft MakeCode

**Version 0.1.0 — pilot prototype. Not yet validated in Minecraft Education or the PXT compiler.**

Turn a placed lever or button into a coding input without depending on the player's selected hotbar item. Connect the control to a redstone lamp, name the lamp in code, and respond when its sampled state turns on or off.

This is a redstone **signal monitor**, not a native player/block interaction event adapter or a patch to Microsoft's Events extension. It does not require the Events extension. It observes a lamp through the documented MakeCode block-testing API. It cannot identify the player who operated the control. Any source that powers the lamp can trigger the same event, including another player, a pressure plate, an arrow hitting a wooden button, or an automated redstone circuit.

## Try the pilot immediately

1. Use a small Creative test world with cheats/code commands enabled and Minecraft Education's MakeCode editor.
2. Place a redstone lamp and attach a lever or button to it, or wire the control to it. First verify visually that using the control turns the lamp on/off.
3. Turn on **Show Coordinates**. Record the lamp block's coordinates (not your player's feet). The sample uses `10, 5, 10` only as a placeholder.
4. Create a MakeCode project. Switch to JavaScript and paste the complete contents of [student-starter.ts](student-starter.ts). Change the `world(10, 5, 10)` near the bottom to the lamp's actual coordinates.
5. Click **Play**. Return to the world, type `watch` in chat, and wait at least one second for a baseline sample.
6. Select an empty slot. Operate the placed lever/button. The activation counter should increase when the lamp turns on. Wait until it switches off before pressing again.
7. Type `status`: `0` is off, `1` is on, and `-1` means missing/unavailable/not yet sampled. Type `stop` to stop monitoring.

The complete single-file starter includes the library; do not also import the extension into that same project. For the first pilot, stay near the lamp and use one lamp. If this does not pass [the teacher checklist](docs/teacher-pilot.md), report the results before distributing to a class.

## Install as an extension after publishing

This repository has not been published from the authoring session. `OWNER` below is a placeholder, not an existing account or working import URL.

1. Publish the repository using [PUBLISH.md](PUBLISH.md).
2. In a fresh Minecraft MakeCode project, open **Extensions** and paste the real public repository URL: `https://github.com/OWNER/makecode-world-signals`.
3. Look for **World Signals** in the toolbox.
4. Copy [examples/switch-counter.ts](examples/switch-counter.ts) into the project's JavaScript editor, replacing the lamp coordinates. This example does not include library source, because it uses the imported extension.
5. Verify JavaScript compilation and conversion to Blocks, then run the in-game pilot checklist. Students can import a public extension by its URL; they do not need to publish a GitHub repository themselves.

## Blocks and TypeScript API

| Block | Function | Behavior |
|---|---|---|
| watch lamp `name` at `position` | `worldSignals.watchLamp(name, position)` | Start/restart a named watch. Relative positions are converted to fixed world positions. |
| on signal `name` turns on/off | `worldSignals.onSignal(name, edge, handler)` | Register a handler. Also requires a matching watch. |
| stop watching `name` | `worldSignals.stopWatching(name)` | Remove one named watch; retain handlers for later reuse. |
| stop watching all lamps | `worldSignals.stopAll()` | Remove all watches; retain handlers. |
| last state of signal `name` | `worldSignals.currentState(name)` | Last sample: Unknown=-1, Off=0, On=1. |
| lamp state at `position` | `worldSignals.readLampState(position)` | Perform a fresh read. Unlike watchLamp, a relative argument follows the player's position at call time. |
| set scan pause to `milliseconds` ms | `worldSignals.setPollInterval(milliseconds)` | Set a pause of 50–2000 ms between complete scans. Default 100 ms. |

Use `WorldSignalEdge.On` and `WorldSignalEdge.Off` for handlers; compare states against `WorldLampState.Unknown`, `.Off`, or `.On`. Functions return `void` except the two state queries, which return `WorldLampState`.

```typescript
worldSignals.onSignal("doorbell", WorldSignalEdge.On, function () {
    player.say("Someone rang the doorbell!");
});
// Replace with your lamp block's coordinates:
worldSignals.watchLamp("doorbell", world(10, 5, 10));
```

Blocks annotations are supplied. JavaScript execution, Blocks rendering/decompilation, and Python conversion must each be checked in the actual editor; none is claimed as verified by the offline tests.

## Sampling behavior and limits

- Initial observation is silent, even if the lamp is already on. After `watch`, wait for the first scan before operating the control.
- A stable powered lamp produces one on-event, not repeated events. Switching off produces a separate off-event.
- A missing/unavailable lamp produces Unknown and no switch event. Recovery silently establishes a new baseline. The API cannot distinguish an absent lamp from a failed command/unloaded location when both tests return false.
- Polling uses `testForBlock(blockByName("lit_redstone_lamp"), position)` and a corresponding unlit-lamp test. The game's bridge must distinguish these types; this is a required pilot check.
- The 100 ms setting is a pause **after** a complete scan, not a guaranteed detection interval. Minecraft command latency and additional lamps increase the interval. Short pulses can be missed. Start with one lamp; hold a lever state for at least a second. Test buttons repeatedly before using them in a lesson.
- Each listener runs in the background with at most one invocation in flight. Further matching transitions while its handler is busy are dropped. Keep handlers short; this prototype is unsuitable for exact/high-speed counting.
- Lamp turn-off delay and circuit delays affect callback timing. Events describe sampled lamp changes, not exact button release or lever-action timestamps.
- Keep lamps in loaded areas. No device/version or multiplayer compatibility has been established. There is no actor attribution or per-player filtering.
- Re-registering the same named watch replaces its location and resets its baseline. Calling `onSignal` repeatedly adds handlers; normally register handlers once, outside chat commands.
- Stopping/replacing a watch cancels handlers that were queued but have not started. It cannot cancel a handler already running. A runtime error in a user handler is not recovered by this library; correct it and restart the project.

## Checks and release status

Run `node --disable-warning=ExperimentalWarning tests/run.cjs` with Node 24. The tests transform and execute the actual TypeScript source against a mocked Minecraft API and test transitions, missing lamps, replacement, cancellation, independent channels, and busy handlers. They do not substitute for PXT compilation or an in-game run.

See [VALIDATION.md](VALIDATION.md) for the actual results, [teacher-pilot.md](docs/teacher-pilot.md) for the release gate, and [student-quickstart.md](docs/student-quickstart.md) for the student handout. MIT licensed. This is an independent project, not a Microsoft-supported extension.

## Sources and technical basis

- [MakeCode testForBlock](https://minecraft.makecode.com/reference/blocks/test-for-block)
- [MakeCode blockByName](https://minecraft.makecode.com/reference/blocks/block-by-name)
- [MakeCode fixed world positions](https://minecraft.makecode.com/reference/positions/to-world)
- [MakeCode background execution](https://minecraft.makecode.com/reference/loops/run-in-background)
- [Microsoft's vanilla block list](https://github.com/MicrosoftDocs/minecraft-creator/blob/main/creator/Reference/Content/VanillaListingsReference/Blocks.md) lists separate `minecraft:redstone_lamp` and `minecraft:lit_redstone_lamp` block names.
- [MakeCode GitHub extension authoring](https://github.com/microsoft/pxt/blob/master/docs/extensions/github-authoring.md)
- [Minecraft MakeCode GitHub integration](https://minecraft.makecode.com/github)

The existence of Bedrock Script API interaction events does not establish that an ordinary MakeCode extension can subscribe to them. This prototype makes no such claim. A true block-interaction adapter needs a verified Minecraft Education event bridge or a compatible behavior-pack bridge; that work remains separate.

#### Metadata (used for search, rendering)
* for PXT/minecraft
