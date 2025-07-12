extend("fiskheroes:hero_basic");
loadTextures({
    "base": "jmctheroes:lantern/green/green",
    "suit": "jmctheroes:lantern/green/green_suit.tx.json",
    "ring": "jmctheroes:lantern/green/green_ring",
    "lights": "jmctheroes:lantern/green/green_lights",
    "wall": "jmctheroes:lantern/green/green_wall.tx.json",
    "glove": "jmctheroes:lantern/green/green_lantern_glove.tx.json",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");

var wall;
var glove;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/suit_timer");
            return timer == 0 ? "blank" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/suit_timer");
            return timer == 0 ? "ring" : timer < 1 ? "ring" : "lights";
        }
        return "lights";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var wallconstruct = renderer.createResource("MODEL", "jmctheroes:lantern_wall");

    glove = renderer.createEffect("fiskheroes:model");
    glove.setModel(utils.createModel(renderer, "jmctheroes:lanternglove", null, "glove"));
    glove.anchor.set("rightArm");

    wallconstruct.bindAnimation("jmctheroes:lantern_wall").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:shield_blocking_timer")));
    wallconstruct.texture.set("blank", "wall");
    wall = renderer.createEffect("fiskheroes:model").setModel(wallconstruct);
    wall.anchor.set("body");

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "jmctheroes:green_telekinesis");

    var beam1 = renderer.createResource("BEAM_RENDERER", "jmctheroes:lantern_blast");
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", beam1, "rightArm", 0x15E300, [
        {"firstPerson": [-5.5, 3.75, -8.0], "offset": [-1, 1.5, -0.75], "size": [0.5, 0.5] }
    ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", beam1, "rightArm", 0x15E300, [
        {"firstPerson": [-5.5, 3.75, -8.0], "offset": [-1, 1.5, -0.75], "size": [0.5, 0.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    addAnimation(renderer, "basic.TRANSFORMATION", "jmctheroes:lantern_transformation").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData('jmctheroes:dyn/suit_timer')));
    });

    utils.addFlightAnimation(renderer, "lantern.FLIGHT", "jmctheroes:flight/superman0.anim.json");
    utils.addHoverAnimation(renderer, "lantern.HOVER", "fiskheroes:flight/idle/neutral");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (isFirstPersonArm) {
            wall.setOffset(0, -1.5, -4.5).setRotation(0, 0, 0);
        }
        else {
            wall.setOffset(0, 0, 0).setRotation(0, 0, 0);
        }
        wall.anchor.ignoreAnchor(isFirstPersonArm);
        wall.render();
    }
    if (renderLayer == "CHESTPLATE") {
        glove.render();
    }
}
