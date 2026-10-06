// World Signals 0.1.0: complete single-file pilot.
// Paste into a NEW Minecraft MakeCode JavaScript project.
// Do not also import the World Signals extension.
// Teacher: run docs/teacher-pilot.md before class distribution.

/** Redstone-lamp signal monitoring for Minecraft Education MakeCode. */
enum WorldSignalEdge {
    //% block="turns on"
    On = 1,
    //% block="turns off"
    Off = 0
}

enum WorldLampState {
    //% block="missing or unavailable"
    Unknown = -1,
    //% block="off"
    Off = 0,
    //% block="on"
    On = 1
}

//% color=#00796B weight=75 icon="\uf0eb" block="World Signals"
namespace worldSignals {
    class Watch {
        name: string;
        position: Position;
        state: WorldLampState;
        active: boolean;
        constructor(name: string, position: Position) {
            this.name = name;
            this.position = position;
            this.state = WorldLampState.Unknown;
            this.active = true;
        }
    }

    class Listener {
        name: string;
        edge: WorldSignalEdge;
        handler: () => void;
        busy: boolean;
        constructor(name: string, edge: WorldSignalEdge, handler: () => void) {
            this.name = name;
            this.edge = edge;
            this.handler = handler;
            this.busy = false;
        }
    }

    let watches: Watch[] = [];
    let listeners: Listener[] = [];
    let pollingStarted = false;
    let interval = 100;

    /** Read the lamp at a position. Missing/unavailable lamps return Unknown. */
    //% blockId=world_signals_read_lamp block="lamp state at $position"
    //% group="Diagnostics" weight=20
    export function readLampState(position: Position): WorldLampState {
        if (blocks.testForBlock(blocks.blockByName("lit_redstone_lamp"), position)) {
            return WorldLampState.On;
        }
        if (blocks.testForBlock(blocks.blockByName("redstone_lamp"), position)) {
            return WorldLampState.Off;
        }
        return WorldLampState.Unknown;
    }

    function dispatch(listener: Listener, watch: Watch) {
        // Keep one invocation per listener in flight; never pile up slow handlers.
        if (listener.busy) return;
        listener.busy = true;
        loops.runInBackground(function () {
            if (watch.active) listener.handler();
            listener.busy = false;
        });
    }

    function sample(watch: Watch) {
        if (!watch.active) return;
        let next = readLampState(watch.position);
        // Minecraft commands may yield: ignore a watch replaced during the read.
        if (!watch.active) return;
        let previous = watch.state;
        watch.state = next;
        // Initial/recovery samples establish a baseline, not a switch event.
        if (previous == WorldLampState.Unknown || next == WorldLampState.Unknown || previous == next) return;
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];
            if (listener.name == watch.name && listener.edge == (next == WorldLampState.On ? WorldSignalEdge.On : WorldSignalEdge.Off)) {
                dispatch(listener, watch);
            }
        }
    }

    function startPolling() {
        if (pollingStarted) return;
        pollingStarted = true;
        loops.forever(function () {
            // Snapshot because chat handlers can change the watch list during reads.
            let snapshot = watches.slice();
            for (let i = 0; i < snapshot.length; i++) sample(snapshot[i]);
            loops.pause(interval);
        });
    }

    /** Watch a placed redstone lamp. Relative positions are fixed at registration. */
    //% blockId=world_signals_watch_lamp block="watch lamp $name at $position"
    //% name.defl="switch"
    //% group="Setup" weight=100
    export function watchLamp(name: string, position: Position): void {
        let fixed = position.toWorld();
        stopWatching(name);
        watches.push(new Watch(name, fixed));
        startPolling();
    }

    /** Run after a sampled on/off transition. Does not identify who used the control. */
    //% blockId=world_signals_on_signal block="on signal $name $edge"
    //% name.defl="switch" blockAllowMultiple=1
    //% group="Events" weight=90
    export function onSignal(name: string, edge: WorldSignalEdge, handler: () => void): void {
        listeners.push(new Listener(name, edge, handler));
    }

    /** Stop watching this name. Event registrations remain available for reuse. */
    //% blockId=world_signals_stop block="stop watching $name"
    //% name.defl="switch" group="Setup" weight=50
    export function stopWatching(name: string): void {
        for (let i = watches.length - 1; i >= 0; i--) {
            if (watches[i].name == name) {
                watches[i].active = false;
                watches.removeAt(i);
            }
        }
    }

    /** Stop all watches. Event registrations remain available for reuse. */
    //% blockId=world_signals_stop_all block="stop watching all lamps"
    //% group="Setup" weight=40
    export function stopAll(): void {
        for (let i = 0; i < watches.length; i++) watches[i].active = false;
        watches = [];
    }

    /** Last sampled state, or Unknown for an unwatched/missing lamp. */
    //% blockId=world_signals_current_state block="last state of signal $name"
    //% name.defl="switch" group="Diagnostics" weight=30
    export function currentState(name: string): WorldLampState {
        for (let i = 0; i < watches.length; i++) {
            if (watches[i].name == name) return watches[i].state;
        }
        return WorldLampState.Unknown;
    }

    /** Set the pause between complete scans. Command latency adds to this time. */
    //% blockId=world_signals_interval block="set scan pause to $milliseconds ms"
    //% milliseconds.defl=100 milliseconds.min=50 milliseconds.max=2000
    //% group="Setup" advanced=true weight=10
    export function setPollInterval(milliseconds: number): void {
        interval = Math.max(50, Math.min(2000, Math.round(milliseconds)));
    }
}

// ---- STUDENT PROGRAM: change the lamp coordinates below ----
// Change 10, 5, 10 to your redstone lamp's WORLD coordinates.
let presses = 0;
worldSignals.onSignal("switch", WorldSignalEdge.On, function () {
    presses += 1;
    player.say("Activations: " + presses);
});
worldSignals.onSignal("switch", WorldSignalEdge.Off, function () {
    player.say("Ready for the next activation");
});
player.onChat("watch", function () {
    worldSignals.watchLamp("switch", world(10, 5, 10));
    player.say("Watching the lamp. Wait a second before using the control.");
});
player.onChat("status", function () {
    player.say("Lamp state: " + worldSignals.currentState("switch"));
});
player.onChat("stop", function () {
    worldSignals.stopAll();
});
