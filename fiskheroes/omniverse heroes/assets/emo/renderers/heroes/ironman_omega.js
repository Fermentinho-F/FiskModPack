extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:ironman_omega",
    "layer2": "emo:ironman_omega",
    "lights_layer1": "fiskheroes:iron_man_mk46c_lights_layer1",
    "lights_layer2": "fiskheroes:iron_man_mk46c_lights_layer2",
    "lights_suit": "fiskheroes:iron_man_mk46c_lights_suit.tx.json",
    "suit": "emo:omega.tx.json",
    "mask": "emo:omega_mask.tx.json",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
    "blade": "fiskheroes:agent_liberty_blade"
});

var utils = implement("fiskheroes:external/utils");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");
var iron_man_helmet = implement("fiskheroes:external/iron_man_helmet");

var helmet;
var boosters;

var repulsor;
var metal_heat;
var blade;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && hasFoldingHelmet() && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "layer2";
        }
        return entity.getData("fiskheroes:suit_open_timer") > 0 ? "suit" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return null;
        }
        else if (renderLayer == "BOOTS" && !hasBootLights()) {
            return null;
        }
        return entity.getData('fiskheroes:suit_open_timer') > 0 ? "lights_suit" : renderLayer == "LEGGINGS" ? "lights_layer2" : "lights_layer1";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");

    if (hasFoldingHelmet()) {
        helmet = iron_man_helmet.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");
    }
    else {
        helmet = iron_man_helmet.createFaceplate(renderer, "mask", null);
    }

    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(helmet.effect);


    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0xFF0000, [
        { "firstPerson": [0.0, 4.0, 0.0], "offset": [0.0, 3.0, -2.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "rightArm", 0xFF0000, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "mando.HEAT_VISION", "fiskheroes:aiming", "fiskheroes:heat_vision");
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
}

function hasFoldingHelmet() {
    return false;
}

function hasBootLights() {
    return true;
}

function render(entity, renderLayer, isFirstPersonArm) {
    boosters.render(entity, renderLayer, isFirstPersonArm, false);
    if (renderLayer == "CHESTPLATE") {
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.1 * f, 6.0 + 3.0 * f, 0.0);
        blade.render();
    }
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            if (hasFoldingHelmet()) {
                helmet.render(entity);
            }
            else {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
        }
        else if (renderLayer == "CHESTPLATE") {
            repulsor.opacity = Math.max(Math.min(entity.getInterpolatedData("fiskheroes:aimed_timer") * 2, 1), entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer"));
            repulsor.texture.set(null, "repulsor");
            repulsor.render();
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
            repulsor.texture.set(null, "repulsor_left");
            repulsor.render();
        }
        else if (renderLayer == "BOOTS") {
            repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            repulsor.texture.set(null, "repulsor_boots");
            repulsor.render();
        }
    }

    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}
