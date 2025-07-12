extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:lucifer",
    "layer2": "emo:lucifer",
    "wings": "emo:lucifer_wings",
    "yuz": "emo:face"
});

var utils = implement("fiskheroes:external/utils");

var wings;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    wings = renderer.createEffect("fiskheroes:wings");
    wings.texture.set("wings");
    wings.anchor.set("body");

    yuz = renderer.createEffect("fiskheroes:overlay");
    yuz.texture.set("yuz");

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "emo:yok", "head", 0xD3D3D3, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]);
}


function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "falcon.HOVER", "fiskheroes:flight/idle/falcon");
    utils.addFlightAnimation(renderer, "falcon.FLIGHT", getFlightAnimation(), (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, entity.getInterpolatedData("fiskheroes:dyn/flight_super_boost_timer"));
    });

    renderer.reprioritizeDefaultAnimation("RELOAD_GUN", -9);

    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", "fiskheroes:falcon_dive_roll");

    addAnimationWithData(renderer, "falcon.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function getFlightAnimation() {
    return "fiskheroes:flight/falcon.anim.json";
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("fiskheroes:flying") > 0.6) {
        wings.render();
    } 
    if (renderLayer == "CHESTPLATE") {
        yuz.opacity = entity.getInterpolatedData("emo:dyn/el_timer");
        yuz.render();
    }
}
