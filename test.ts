// MakeCode smoke program, used only while editing this extension itself.
// Replace these coordinates with those of a placed redstone lamp before running.
worldSignals.onSignal("switch", WorldSignalEdge.On, function () {
    player.say("Signal ON");
});
worldSignals.onSignal("switch", WorldSignalEdge.Off, function () {
    player.say("Signal OFF");
});
// Start monitoring manually, after placing and wiring the lamp.
player.onChat("watch", function () {
    worldSignals.watchLamp("switch", world(10, 5, 10));
    player.say("Watching. Wait a second, then operate the lever or button.");
});
player.onChat("stop", function () {
    worldSignals.stopAll();
});
