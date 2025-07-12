extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:moth/killer_moth_layer1",
    "layer2": "jmctheroes:moth/killer_moth_layer2",
    "wings": "jmctheroes:moth/moth_wings",
    "gun": "jmctheroes:moth/moth_gun"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    moth = renderer.createEffect("fiskheroes:model");
    moth.setModel(utils.createModel(renderer, "jmctheroes:mothHead", "layer1", null));
    moth.anchor.set("head");

    var wings = renderer.createResource("MODEL", "jmctheroes:mothWings");
    wings.bindAnimation("jmctheroes:mothwings").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/moving_timer") || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW");
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_timer") && Math.sin((2*entity.loop(3))*Math.PI)/2);
    });
    wings.texture.set("wings");
    mothWings = renderer.createEffect("fiskheroes:model").setModel(wings);
    mothWings.anchor.set("body");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "moth.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "moth.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });

    renderer.reprioritizeDefaultAnimation("RELOAD_GUN", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {
    var stand = entity.isAlive() || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
    if (renderLayer == "HELMET" && stand) {
        moth.render();
    }
    if (renderLayer == "CHESTPLATE" && stand) {
        mothWings.render();
    }
}