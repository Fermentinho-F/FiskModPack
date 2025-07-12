extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/teen_titans/raven/suit",
    "hood": "tmhp:dc/teen_titans/raven/hood",
    "cape": "tmhp:dc/teen_titans/raven/cape",
    "red_eyes": "tmhp:dc/teen_titans/raven/red_eyes"
});

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

var capes = implement("fiskheroes:external/capes");
var utils = implement("fiskheroes:external/utils");

var physics;
var cape;

var red_eyes;
var chest;
var hood;
var spell;

function initEffects(renderer) {
    red_eyes = renderer.createEffect("fiskheroes:overlay");
    red_eyes.texture.set(null, "red_eyes");

    hood = renderer.createEffect("fiskheroes:overlay");
    hood.texture.set("hood");

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.65).setYOffset(0.5);

    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 8;
    physics.setTickHandler(entity => {
        var f = 1 - entity.getData("fiskheroes:flight_timer");
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 20;
        physics.restAngle = f * 40;
        physics.restFlare = f * 0.7;
        physics.idleFlutter = 0.15 + 0.25 * f;
        physics.flutterSpeed = f * 0.3;
    });

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("cape");

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "tmhp:raven");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "tmhp:raven");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFF1111);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "rightArm", 0xFF0000, [
        { "firstPerson": [-4.50, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "head", 0x220022, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [6.0, 6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));

    var color = 0xFF0000;
    var tao_mandala = renderer.createResource("SHAPE", "fiskheroes:tao_mandala");
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");
    spell = renderer.createEffect("fiskheroes:lines").setShape(tao_mandala).setRenderer(beam);
    spell.color.set(color);
    spell.setOffset(-4.0, 13.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(16.0);
    spell.anchor.set("rightArm");
    spell.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) {
        if (!isFirstPersonArm) {
            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
        }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
    if (renderLayer == "CHESTPLATE") {
        hood.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer");
        hood.render();
    }
    if (renderLayer == "CHESTPLATE") {
        red_eyes.opacity = entity.getInterpolatedData("fiskheroes:beam_charging");
        red_eyes.render();
    }
    if (renderLayer == "CHESTPLATE") {
        spell.progress = entity.getInterpolatedData("fiskheroes:beam_charge");
        spell.render();
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.ENERGY_PROJ", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:energy_projection") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimation(renderer, "basic.BLOCKING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getData("fiskheroes:shield_blocking") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}