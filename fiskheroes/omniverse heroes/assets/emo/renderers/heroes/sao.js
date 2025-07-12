extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:sao",
    "layer2": "emo:sao",
    "sword": "emo:swordsatan",
    "omuz": "emo:moa",
    "boy": "emo:moa",
    "cape": "emo:satan_cape"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

var sword;
var omuz;
var boy;

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.3;
    physics.maxFlare = 0.6;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 16;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xAA00FF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:swordsatan", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    omuz = renderer.createEffect("fiskheroes:model");
    omuz.setModel(utils.createModel(renderer, "emo:omuz", "omuz"));
    omuz.anchor.set("body");
    omuz.mirror = false;

    boy = renderer.createEffect("fiskheroes:model");
    boy.setModel(utils.createModel(renderer, "emo:boy", "boy"));
    boy.anchor.set("head");

   
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:soa");
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "emo:soa");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xAA00FF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");

    addAnimationWithData(renderer, "strange.SWORD_POSE", "fiskheroes:sword_pose", "emo:dyn/sword_timer");
    
    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (renderLayer == "CHESTPLATE") {
        omuz.render();
    }
    if (entity.getData("emo:dyn/sword") > 0.6) {
        sword.render();
    } 
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            boy.render();
        }
    }
}
