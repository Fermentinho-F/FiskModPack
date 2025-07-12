extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:grid",
    "layer2": "emo:grid",
    "blade": "fiskheroes:black_manta_dceu_blade"
});

var utils = implement("fiskheroes:external/utils");
var boosters = implement("fiskheroes:external/bloom_booster");
var body_lines = implement("fiskheroes:external/body_lines");

var booster_boots;
var booster_back;

var repulsor;
var blade;
var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    blade = renderer.createEffect("fiskheroes:shield");
    blade.texture.set("blade");
    blade.anchor.set("rightArm");
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:atom_booster");
    var blue_fire = renderer.createResource("ICON", "fiskheroes:deep_blue_fire_layer_%s");
    var color = 0x0033FF;
    booster_boots = boosters.create(renderer, "rightLeg", true, color, blue_fire, beam).setOffset(0.0, 7.0, 2.0).setSize(1.5, 3.0);
    booster_back = boosters.create(renderer, "body", true, color, blue_fire, beam).setOffset(1.5, 6.0, 1.75).setRotation(15.0, 0.0, 5.0);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0x11FF00, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"))
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0x66FF47, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "atom.HOVER", "fiskheroes:flight/idle/default_back");
    utils.addFlightAnimation(renderer, "atom.FLIGHT", "fiskheroes:flight/propelled.anim.json", (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(2, entity.getInterpolatedData("fiskheroes:scale"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        blade.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(blade.unfold * 5, 1);
        blade.setOffset(2.9 + 0.35 * f, 6.0 + 2.5 * f, 0.0);
        blade.render();
    }

    if (!isFirstPersonArm) {
        if (renderLayer == "CHESTPLATE") {
            var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
            booster_back.speedScale = 0.5 * boost;
            booster_back.flutter = 1 + boost;
    
            var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
            f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
            booster_back.setSize(1.5 + f * 2, 3.5 - f * 2);
            booster_back.render(entity, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
        }
        else if (renderLayer == "BOOTS") {
            var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
            booster_boots.speedScale = 0.5 * boost;
            booster_boots.flutter = 1 + boost;

            booster_boots.setRotation(15 - 10 * boost, 0, 0);
            booster_boots.render(entity, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
        }
    }
}