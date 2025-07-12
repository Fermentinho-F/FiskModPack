extend("fiskheroes:hero_basic");
loadTextures({
    "base": "emo:red_blue_lantern",
    "suit": "emo:lantern_suit.tx.json",
    "lights": "emo:light_red",
    "reactor": "emo:ring",
    "shield": "fiskheroes:iron_man_mk85_shield",
    "shield_handle": "emo:lantern",
    "shield_handle_lights": "emo:lantern",
    "blade": "emo:lantern_blade",
    "blade_lights": "fiskheroes:iron_man_mk85_blade_lights"
});

var utils = implement("fiskheroes:external/utils");

var blade;
var shield;
var shield_handle;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.isDisplayStand()) {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return !entity.isDisplayStand() && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade", "blade_lights");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set(null, "shield");
    shield.anchor.set("rightArm");
    shield.setRotation(55.0, -20.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;
    shield_handle = renderer.createEffect("fiskheroes:shield");
    shield_handle.texture.set("shield_handle", "shield_handle_lights");
    shield_handle.anchor.set("rightArm");
    shield_handle.setOffset(3.5, 7.0, -3.0).setRotation(55.0, -20.0, 20.0).setCurve(100.0, 45.0);

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xFF0400, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "mmcw.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");
}

function render(entity, renderLayer, isFirstPersonArm) {
    blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
    blade.render();

    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
    shield.opacity = 0.25 + 0.25 * shield.unfold * shield.unfold;
    shield.setOffset(3.75 + 2.25 * shield.unfold, 8.75 + 1.5 * shield.unfold, -0.75 * shield.unfold);
    shield.render();

    var shield_timer = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield_handle.unfold = entity.getData("fiskheroes:shield") ? Math.min(shield_timer * 2, 1) : Math.max(shield_timer * 2 - 1, 0);
    shield_handle.render();
}
