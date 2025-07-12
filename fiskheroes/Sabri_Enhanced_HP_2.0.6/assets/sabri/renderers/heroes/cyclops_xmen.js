extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:cyclops_xmen_layer1",
    "layer2": "sabri:cyclops_xmen_layer2",
    "visor": "sabri:cyclops_xmen_visor",
    "lit": "sabri:cyclops_xmen_lit",
    "eyes": "sabri:cyclops_xmen_eyes"
});

var utils = implement("fiskheroes:external/utils");

var overlay;
var eyes;

function initEffects(renderer, isFirstPersonArm) {
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sabri:cyclops_xmen_optic_blast", "head", 0xFF0019, [
        { "firstPerson": [0.0, 0.0, 2.0], "offset": [0.0, -3.3, -4.0], "size": [5, 0.5], },
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sabri:cyclops_xmen_optic_blast"))

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "sabri:cyclops_xmen_optic_blast", "head", 0xFF0019, [
        { "firstPerson": [0.0, 0.0, 2.0], "offset": [0.0, -3.3, -4.0], "size": [5, 0.5], }
    ]);

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "sabri:cyclops_xmen_chaos_blast", "head", 0xFF0019, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sabri:cyclops_xmen_optic_blast"));
    
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "lit");

    eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set(null, "eyes");

    utils.addCameraShake(renderer, 0.015, 0.75, "fiskheroes:heat_vision_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.getInterpolatedData("fiskheroes:heat_vision_timer") > 0 ? entity.getInterpolatedData("fiskheroes:heat_vision_timer") : 0;
        return true;
    });
    shake.intensity = 0.0;

    var model = renderer.createResource("MODEL", "sabri:head_model");
    model.bindAnimation("sabri:glasses_up").setData((entity, data) => {
        return data.load(0, entity.getData("fiskheroes:mask_open") ? Math.max(entity.getInterpolatedData("fiskheroes:mask_open_timer2") * 1.3 - 0.3, 0) : Math.min(entity.getInterpolatedData("fiskheroes:mask_open_timer2") * 2, 1))
    });
    model.texture.set("visor");
    visor = renderer.createEffect("fiskheroes:model").setModel(model);
    visor.anchor.set("head");
    visor.setOffset(0, -24, 0)
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "cyclops.VISOR", "sabri:toggle_glasses")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });

    addAnimation(renderer, "cyclops.SHOT", "sabri:cyclops_blast")
        .setData((entity, data) => {
            var a = (entity.getInterpolatedData("fiskheroes:aiming_timer") + entity.getInterpolatedData("fiskheroes:aimed_timer")) / 2;
            data.load(a > 2/3 ? 1 : a * 1.5);
        });

    addAnimationWithData(renderer, "cyclops.BLAST", "sabri:cyclops_blast", "sabri:dyn/aiming_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET" && !isFirstPersonArm) {
        overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        overlay.render();

        visor.render();

        if (entity.getData("fiskheroes:mask_open_timer2") > 0.55) {
            eyes.opacity = entity.getInterpolatedData("fiskheroes:heat_vision_timer");
            eyes.render();
        }
    }
}
