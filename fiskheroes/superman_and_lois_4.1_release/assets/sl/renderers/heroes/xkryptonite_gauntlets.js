extend("fiskheroes:hero_basic");

loadTextures({
    "layer1": "sl:null",
    "model_texture": "sl:k_gauntlet"
});

var utils = implement("fiskheroes:external/utils");
var beam2;
var lGauntlet;
var rGauntlet;

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

addAnimation(renderer, "basic.POSE", "sl:rex")
    .setData((entity, data) => {
        data.load(0, 1);
    });

    addAnimation(renderer, "basic.AIMING", "sl:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
}

function initEffects(renderer) {
var shakehv = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shakehv.factor = (Math.log(1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:beam_shooting"));
    return true;
});
    // Charged Beam
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:mysterio_beam");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", beam, "head", "0xEDB200", [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [2.0, 2.0], "anchor": "rightArm"  },
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [2.0, 2.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "sl:xkryptonite_beam_impact"));

    rGauntlet = renderer.createEffect("fiskheroes:model");
    rGauntlet.setModel(utils.createModel(renderer, "sl:k_gauntlet", "model_texture"));
    rGauntlet.anchor.set("rightArm");
    rGauntlet.setRotation(-90.0, 0.0, 0.0).setOffset(0.9473, 3.3420, 14.3).setScale(0.7);

    lGauntlet = renderer.createEffect("fiskheroes:model");
    lGauntlet.setModel(utils.createModel(renderer, "sl:k_gauntlet", "model_texture"));
    lGauntlet.anchor.set("leftArm");
    lGauntlet.setRotation(-90.0, 0.0, 0.0).setOffset(-0.9473, 3.3420, 14.3).setScale(0.7);

    beam2 = utils.createLines(renderer, ("BEAM_RENDERER", "sl:kryptonite_gauntlet_beam"), 0xEDB200, [
        {"start": [0.0, 1.0, 0.0], "end": [0.0, 1.5, 0.0 ], "size": [12.0, 4.0]},
    ]);
    beam2.setOffset(-1.2, 8.5, 0.0)
    beam2.setScale(5.0, 8.0, 5.0)
    beam2.anchor.set("leftArm");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer === "CHESTPLATE") {
        if (entity.getHeldItem().isEmpty()) {
            beam2.mirror = true;
        } else {
            beam2.mirror = false;
        }
        beam2.opacity = entity.getInterpolatedData("fiskheroes:beam_charge") / 2;
        beam2.render();
    }
    if (entity.getHeldItem().isEmpty()) {
        rGauntlet.render();
    }
    lGauntlet.render();
}
