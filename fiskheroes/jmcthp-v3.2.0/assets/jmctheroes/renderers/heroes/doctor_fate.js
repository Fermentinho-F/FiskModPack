extend("fiskheroes:hero_basic");
loadTextures({
    "full": "jmctheroes:fate/doctor_fate",
    "suit": "jmctheroes:fate/doctor_fate_suit.tx.json",
    "cape": "jmctheroes:fate/doctor_fate_cape.tx.json",
    "lights": "jmctheroes:fate/doctor_fate_lights",
    "models": "jmctheroes:fate/doctor_fate_model.tx.json",
    "helm": "jmctheroes:fate/doctor_fate_helmet",
    "shield": "jmctheroes:fate/fate_shield",
    "ankh": "jmctheroes:fate/ankh"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var fate_effect = implement("jmctheroes:external/fate_aim");

var physics;
var chest;
var cape;
var glow;

var ankh_shield;
var ankh_aim;
var ankh;

var fate_aim;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            return entity.getInterpolatedData('jmctheroes:dyn/fate_timer') == 0 ? "helm" : entity.getInterpolatedData('jmctheroes:dyn/fate_timer') > 0 ? "suit" : null
        }
        return "full"
    });
    renderer.setLights((entity, renderLayer) => {
        if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            return entity.getData('jmctheroes:dyn/fate_timer') == 1 ? "lights" : null
        }
        return "lights"
    });

    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}
function initEffects(renderer) {

    var color = 0xA64916;
    var color2 = 0x99F6FF;
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");

    var ankh_big = renderer.createResource("SHAPE", "jmctheroes:ankh_big");
    ankh = renderer.createEffect("fiskheroes:lines").setShape(ankh_big).setRenderer(beam);
    ankh.color.set(0xFFEF87);
    ankh.setOffset(0.0, -5.0, -12.0).setScale(1.0);
    ankh.anchor.set("body");

    var ankh_small = renderer.createResource("SHAPE", "jmctheroes:ankh_small");
    ankh_shield = renderer.createEffect("fiskheroes:lines").setShape(ankh_small).setRenderer(beam);
    ankh_shield.color.set(0xFFEF87);
    ankh_shield.setOffset(1, 12, -3).setRotation(90, 0, 0).setScale(0.1)
    ankh_shield.anchor.set("rightArm");
    ankh_shield.mirror = true;

    var ankh_aiming = renderer.createResource("SHAPE", "jmctheroes:ankh_aim");
    ankh_aim = renderer.createEffect("fiskheroes:lines").setShape(ankh_aiming).setRenderer(beam);
    ankh_aim.color.set(color2);
    ankh_aim.setOffset(1.0, 11.0, 0.0).setScale(3.2);
    ankh_aim.anchor.set("rightArm");
    ankh_aim.mirror = true;

    var fate = renderer.createResource("SHAPE", "jmctheroes:fate_aim");
    fate_aim = fate_effect.create(renderer, color2, fate, beam);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFFEF87);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
//spikes
    spikes = renderer.createEffect("fiskheroes:model");
    spikes.setModel(utils.createModel(renderer, "jmctheroes:fate/FateSpikes", "models", null));
    spikes.anchor.set("body");
//shoulders
    var shoulders = utils.createModel(renderer, "jmctheroes:fate/FateShoulders", "models", null);
    shoulders.generateMirror();
    shouldersEffect = renderer.createEffect("fiskheroes:model");
    shouldersEffect.setModel(shoulders);
    shouldersEffect.anchor.set("rightArm");
    shouldersEffect.mirror = true;
    shouldersEffect.setOffset(0.0, -0.5, 0.0);
//extra arms
    var model = renderer.createResource("MODEL", "jmctheroes:fate/FateArms");
    model.bindAnimation("jmctheroes:fate/fate_arms_model").setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("fiskheroes:beam_charge")));
        data.load(1, Math.max(entity.getInterpolatedData("jmctheroes:dyn/1_timer")));
    }).priority = -1;
    model.texture.set("arms");
    arms = renderer.createEffect("fiskheroes:model").setModel(model);
    arms.anchor.set("body");
//chest
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.0).setYOffset(0.5);
//cape
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

//magic beam
    var magic_beam1 = renderer.createResource("BEAM_RENDERER", "jmctheroes:magic_blast");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", magic_beam1, "body", color, [
        {"offset": [0.0, -1.5, -10.5], "size": [3.0, 3.0]}        
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
//magic blasts
    var magic_beam2 = renderer.createResource("BEAM_RENDERER", "jmctheroes:magic_blast2");
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", magic_beam2, "rightArm", color2, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData("jmctheroes:dyn/random") == 0);
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", magic_beam2, "leftArm", color2, [
        { "firstPerson": [4.5, 3.75, -7.0], "offset": [0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]).setCondition(entity => entity.getData("jmctheroes:dyn/random") == 1);
//hand glow
    arms_blast = utils.createLines(renderer, "jmctheroes:energy_hands", color2, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -0.5, 0.0], "size": [4.8, 4.8]}
    ]);
    arms_blast.anchor.set("rightArm");
    arms_blast.setOffset(1.0, 10.25, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
    arms_blast.mirror = true;
//tp
    utils.bindCloud(renderer, "fiskheroes:teleportation", "jmctheroes:eldritch_breach");
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:breach");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "fate.BLADE", "jmctheroes:fate/fate_arms").setData((entity, data) => {
        data.load(0, Math.max(entity.getInterpolatedData("fiskheroes:beam_charge")));
        data.load(1, Math.max(entity.getInterpolatedData("jmctheroes:dyn/1_timer")));
    });
    addAnimationWithData(renderer, "fate.AIMING", "jmctheroes:dual_aiming", "fiskheroes:aiming_timer")
    addAnimationWithData(renderer, "fate.BLOCKING", "jmctheroes:fate/fate_shield", "fiskheroes:shield_blocking_timer")
        .priority = 5;
    utils.addHoverAnimation(renderer, "fate.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "fate.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    beam = entity.getInterpolatedData("fiskheroes:beam_charge");
    if (renderLayer == "HELMET") {
        spikes.render();
        shouldersEffect.render();

        arms_blast.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer");
        arms_blast.render();

        var beam_charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        if (isFirstPersonArm) {
            ankh.setOffset(0, 8*(0.5-beam_charge), -12).setRotation(0, 0, 0);
        }
        else {
            ankh.setOffset(0, 9*(0.5-beam_charge), -12).setRotation(0, 0, 0);
        }
        ankh.anchor.ignoreAnchor(isFirstPersonArm);
        ankh.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        ankh.scale = (4 * entity.getInterpolatedData("fiskheroes:beam_charge"));
        ankh.render();

        ankh_shield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        ankh_shield.scale = (1 * entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
        ankh_shield.render();

        ankh_aim.progress = entity.getInterpolatedData("fiskheroes:aiming_timer");
        ankh_aim.render();

        fate_aim.render(entity);

        if (beam) {
        arms.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        arms.render();
        }
        if (!isFirstPersonArm) {
            chest.render();
            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
        }
    }
}