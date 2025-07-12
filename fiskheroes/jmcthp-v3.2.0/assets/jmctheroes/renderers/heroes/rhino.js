extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:rhino/rhino_layer1",
    "layer2": "jmctheroes:rhino/rhino_layer2",
    "rhino": "jmctheroes:rhino/rhino_full"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "jmctheroes:invisible", "body", 0x000000, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}]);

    horn = renderer.createEffect("fiskheroes:model");
    horn.setModel(utils.createModel(renderer, "jmctheroes:horn", "rhino", null));
    horn.anchor.set("head");
    chest = renderer.createEffect("fiskheroes:model");
    chest.setModel(utils.createModel(renderer, "jmctheroes:big_chest", "rhino", null));
    chest.anchor.set("body");

    utils.addCameraShake(renderer, 0.25, 0.25, "fiskheroes:energy_projection_timer");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimation(renderer, "rhino.SUIT", "jmctheroes:rhino").setData((entity, data) => {
        data.load(Math.max(entity.isAlive()));
    });
    addAnimation(renderer, "rhino.SPRINT", "jmctheroes:speedsters/rhino_sprint").setData((entity, data) => {
        data.load(1, entity.getInterpolatedData("jmctheroes:dyn/1_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm){
    var stand = entity.isAlive() || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW";
    if (renderLayer == "HELMET" && stand) {
        horn.render();
    }
    if (renderLayer == "CHESTPLATE" && stand) {
        chest.render();
    }
}