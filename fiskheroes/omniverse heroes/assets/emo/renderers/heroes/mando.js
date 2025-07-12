extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:mando",
    "layer2": "emo:mando",
    "wings": "emo:yok",
    "jetpack": "emo:mando_jetpack",
    "jetpack_lights": "emo:yok",
    "el": "emo:mandoel",
    "eyes": "emo:yok",
});

var utils = implement("fiskheroes:external/utils");
var mantapack = implement("fiskheroes:external/mantapack");

var jetpack;
var el;

var blade;
var overlay;
var booster_boots;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : "lights");
}

function initEffects(renderer) {
    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    var red_fire = renderer.createResource("ICON", "fiskheroes:red_fire_layer_%s");
    booster_boots = renderer.createEffect("fiskheroes:booster");
    booster_boots.setIcon(red_fire).setOffset(0.0, 8.5, 2.0).setSize(1.5, 4.0);
    booster_boots.anchor.set("rightLeg");
    booster_boots.mirror = true;
    booster_boots.opacity = 0.7;
    jetpack = mantapack.create(renderer, "jetpack", "jetpack_lights", red_fire);

    el = renderer.createEffect("fiskheroes:model");
    el.setModel(utils.createModel(renderer, "emo:mandoel", "el"));
    el.anchor.set("rightArm");
    el.mirror = false;

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xFF0000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.55, "offset": [0.5, 4.5, 3.0], "rotation": [0.0, -90.0, 35.0] }
    ]);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFF0000, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:heat_vision", "rightArm", 0xFF0000, [
        { "firstPerson": [-4.30, 10.20, -0.10], "offset": [-4.30, 10.20, -0.10], "size": [1.0, 0.5] },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "mando.HEAT_VISION", "fiskheroes:aiming", "fiskheroes:heat_vision");
    utils.addFlightAnimation(renderer, "manta.FLIGHT", "fiskheroes:flight/propelled.anim.json");
    utils.addHoverAnimation(renderer, "manta.HOVER", "fiskheroes:flight/idle/manta");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.35 * f, 6.0 + 2.5 * f, 0.0);
        blade.render();

        if (!isFirstPersonArm) {
            jetpack.render(entity);
        }
    }
    if (renderLayer == "CHESTPLATE") {
        el.render();
    }
    if (!isFirstPersonArm) {
       if (renderLayer == "BOOTS") {
            var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
            booster_boots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            booster_boots.speedScale = 0.5 * boost;
            booster_boots.flutter = 1 + boost;

            booster_boots.setRotation(20 - 10 * boost, 0, 0);
            booster_boots.render();
        }
    }
}