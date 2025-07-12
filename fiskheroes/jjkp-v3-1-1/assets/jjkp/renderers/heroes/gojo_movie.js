extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:gojo/gojo_movie_layer1",
    "layer2": "jjkp:gojo/gojo_layer2",
    "noblindfold": "jjkp:gojo/gojo_noblindfold_layer1",
    "infinitevoid": "jjkp:gojo/infinite_void"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");

var reversalred
var lapseblue

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "noblindfold";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {

    var shadow_dome = renderer.bindProperty("fiskheroes:shadowdome");
	shadow_dome.texture.set("infinitevoid", "infinitevoid");
	//shadow_dome.setShape(36, 36)

    reversalred = utils.createLines(renderer, "jjkp:reversalred", 0xFF0000, [{
        "start": [0.1, 0.1, 0.1],
        "end": [-0.1, -0.1, -0.1],
        "size": [8, 8]
    }
]);
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:energy_projection");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", beam, "body", 0xBBA1D5, [
        { "firstPerson": [0.2, 4, -4.0], "offset": [0.2, 2, -4.0], "size": [3, 3] },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    reversalred.anchor.set("rightArm");
    reversalred.setOffset(2, 12, 0).setRotation(0.0, 0.0, 0.0).setScale(8);

    lapseblue = utils.createLines(renderer, "jjkp:reversalred", 0x0000FF, [{
        "start": [0.1, 0.1, 0.1],
        "end": [-0.1, -0.1, -0.1],
        "size": [8, 8]
    }
]);
    lapseblue.anchor.set("leftArm");
    lapseblue.setOffset(-2, 12, 0).setRotation(0.0, 0.0, 0.0).setScale(8);
    
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xFF0000);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "head", 0xBB0FFF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [0.0, 0.0, 0.0], "size": [10.5, 10.5] }]);

    var night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.firstPersonOnly = false;
    night_vision.setCondition(entity => {
        night_vision.factor = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        return true;
    });

    speedster.init(renderer);

    utils.bindParticles(renderer, "jjkp:limitless_particles").setCondition(entity => entity.getData("jjkp:dyn/limitless"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
    utils.addHoverAnimation(renderer, "mmcw.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");

    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimationWithData(renderer, "power.CHHARGED_BEAM", "fiskheroes:dual_aiming", "fiskheroes:beam_charge");

    addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData('fiskheroes:beam_charging')) {
        reversalred.render();
        lapseblue.render();
    }
}
