extend("fiskheroes:hero_basic");
loadTextures({
    "base": "moopack:fiskfille/crazy_creetle_base",
    "suit": "moopack:mask/crazy_creetle_suit.tx.json",
    "mask": "moopack:mask/crazy_creetle_mask.tx.json",
    "reactor": "moopack:fiskfille/fiskfille_base",
    "shield": "fiskheroes:iron_man_mk50_shield",
    "shield_lights": "fiskheroes:iron_man_mk50_shield_lights",
    "blade": "moopack:dio/knife",
    "cannon1": "fiskheroes:iron_man_mk50_cannon1",
    "cannon2": "fiskheroes:iron_man_mk50_cannon2",
    "cannon1_lights": "fiskheroes:iron_man_mk50_cannon1_lights",
    "cannon2_lights": "fiskheroes:iron_man_mk50_cannon2_lights",
    "cannon_inner": "fiskheroes:iron_man_mk50_cannon_inner"
});

var speedster = implement("fiskheroes:external/speedster_utils");

var utils = implement("fiskheroes:external/utils");
var mk50_cannon = implement("fiskheroes:external/mk50_cannon");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");

var cannon;
var boosters;

var repulsor;
var blade;
var shield;
var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");

    speedster.init(renderer, "moopack:fisk_trail");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "moopack:breach");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "body", 0xFF2300, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "moopack:creetle_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));

    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");
    blade.setOffset(1.5, 8.0, 0.0);
    blade.large = true;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield", "shield_lights");
    shield.anchor.set("rightArm");
    shield.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;

    cannon = mk50_cannon.create(renderer, "rightArm", 0x00ACFF);
    boosters = iron_man_boosters.create(renderer, "moopack:invis_flight_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(blade, shield, cannon.c1, cannon.c2);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindTrail(renderer, "moopack:fisk_trail").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xD9FFFF, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);


}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");

    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function render(entity, renderLayer, isFirstPersonArm) {
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
    repulsor.texture.set(null, "repulsor");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
    repulsor.texture.set(null, "repulsor_left");
    repulsor.render();
    repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
    repulsor.texture.set(null, "repulsor_boots");
    repulsor.render();

    blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
    blade.render();

    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield.setOffset(2.9 + 1.8 * Math.min(shield.unfold * 5, 1), 6.0, 0.0);
    shield.render();

    cannon.render(entity.getInterpolatedData("fiskheroes:aimed_timer"));
    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
