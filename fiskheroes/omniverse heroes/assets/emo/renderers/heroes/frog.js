extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:frog",
    "layer2": "emo:frog",
    "mjolnir": "emo:cekic",
    "cape": "emo:red_cape"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var mjolnir;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.opacity = 0.85;

    mjolnir = renderer.createEffect("fiskheroes:model");
    mjolnir.setModel(utils.createModel(renderer, "emo:cekic", "mjolnir"));
    mjolnir.anchor.set("rightArm");
    mjolnir.setOffset(1.0, 6.4, -4.0).setRotation(10.0, 0.0, 0.0).setScale(0.4);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x24B6FF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "emo:bf");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:bf");
    utils.bindTrail(renderer, "emo:lightning_thor");
    utils.bindTrail(renderer, "emo:lightning_thor1");

      // charged beam
      utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0x24B6FF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, -8.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "mmcw.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (renderLayer == "CHESTPLATE") {
        mjolnir.opacity = entity.getInterpolatedData("fiskheroes:shield");
        mjolnir.render();
    }
}
