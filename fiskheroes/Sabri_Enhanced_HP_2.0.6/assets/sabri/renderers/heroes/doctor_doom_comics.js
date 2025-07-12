extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:doctor_doom_comics_layer1",
    "layer2": "sabri:doctor_doom_comics_layer2",
    "chest": "sabri:doctor_doom_comics_chest",
    "cape": "sabri:doctor_doom_comics_cape",
    "booster": "sabri:doctor_doom_comics_booster"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var dark_magic = implement("sabri:external/dark_magic");
var mystical_magic = implement("sabri:external/mystical_magic");
var doctor_doom_comics_boosters = implement("sabri:external/doctor_doom_comics_boosters");

var cape;
var overlay;
var glow;
var booster;
var boosters;
var telekinesis;
var portal;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "chest" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.3;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;
    cape = capes.createDefault(renderer, 23, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 17;

    var color = 0x26A826;

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(color);
    magic.colorAtmosphere.set(color);
    magic.colorWhip.set(0xFF4800);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sabri:doctor_doom_comics_beam", "rightArm", color, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [5.0, 5.0, -5.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [5.0, 5.0, -5.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    beam_arms_core = utils.createLines(renderer, "sabri:doctor_doom_comics_hands", color, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, 0.0], "size": [10.0, 3.0]},
    ]);
    beam_arms_core.anchor.set("rightArm");
    beam_arms_core.setOffset(1, 4.75, 0).setRotation(0.0, 0.0, 0.0).setScale(8.35, 6.0, 8.35);
    beam_arms_core.mirror = false;

    beam_arms_core1 = utils.createLines(renderer, "sabri:doctor_doom_comics_hands", color, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, 0.0], "size": [10.0, 3.0]},
    ]);
    beam_arms_core1.anchor.set("leftArm");
    beam_arms_core1.setOffset(-1, 4.75, 0).setRotation(0.0, 0.0, 0.0).setScale(8.35, 6.0, 8.35);
    beam_arms_core1.mirror = false;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(color);
    forcefield.setShape(36, 18).setOffset(0.0, 10.0, 0.0).setScale(2.4);
    forcefield.setCondition(entity => {
        var shield = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        var t = 5;
        forcefield.opacity = 0.15 * shield + Math.max(Math.sin(Math.PI * (Math.min(entity.getInterpolatedData("fiskheroes:ticks_since_shield_damaged"), t) / t)), 0) * (shield * 0.25);
        return true;
    });

    utils.bindParticles(renderer, "sabri:doctor_doom_comics_portal").setCondition(entity => entity.getData("sabri:dyn/teleport_timer") >= 0.85);
    utils.bindParticles(renderer, "sabri:doctor_doom_comics").setCondition(entity => entity.getData("fiskheroes:flying"));

    boosters = doctor_doom_comics_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    booster = renderer.createEffect("fiskheroes:model");
    booster.setModel(utils.createModel(renderer, "sabri:doctor_doom_comics_booster", "booster"));
    booster.anchor.set("body");
    booster.setOffset(5.0, -9.0, 0.0);
    booster.mirror = true;

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(booster, cape.effect);
    glow.color.set(0xFFFFFF);

    telekinesis = dark_magic.create(renderer);
    portal = mystical_magic.create(renderer);

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "sabri:doctor_doom_comics_telekinesis");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "doom_comics.CHARGED_BEAM", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    addAnimationWithData(renderer, "doom_comics.FORCEFIELD", "sabri:doctor_doom_comics_blocking", "fiskheroes:shield_blocking_timer");

    renderer.reprioritizeDefaultAnimation("BLOCK_CAPS_SHIELD", -9);

    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "doom_comics.TELEKINESIS", "fiskheroes:aiming", "sabri:dyn/aiming_timer")
        .priority = 10;

    addAnimationWithData(renderer, "doom_comics.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    utils.addFlightAnimation(renderer, "doom_comics.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "doom_comics.HOVER", "fiskheroes:flight/idle/default_back");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        cape.render(entity);
        booster.render();
        telekinesis.render(entity, isFirstPersonArm);
        portal.render(entity, isFirstPersonArm);
    }

    beam_arms_core.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
    beam_arms_core.render();
    beam_arms_core1.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
    beam_arms_core1.render();
    
    boosters.render(entity, renderLayer, isFirstPersonArm, true);

    glow.opacity = entity.getInterpolatedData("sabri:dyn/teleport_timer");
    glow.render();
}