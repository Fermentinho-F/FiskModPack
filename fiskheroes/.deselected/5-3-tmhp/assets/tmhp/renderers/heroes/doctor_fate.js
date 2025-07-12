extend("fiskheroes:hero_basic");
loadTextures({
    "base": "tmhp:dc/young_justice/dr_fate/base",
    "helmet": "tmhp:dc/young_justice/dr_fate/helmet",
    "hand": "tmhp:dc/young_justice/dr_fate/hand",
    "cape": "tmhp:dc/young_justice/dr_fate/cape",
    "ankh": "tmhp:dc/young_justice/dr_fate/ankh",
    "null": "tmhp:null"
});

var flames = implement("fiskheroes:external/flames");
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var hand_flames;
var physics;
var cape;
var ankh;
var collar;
var hand;
var helmet;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY")) {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "null" : timer < 0.6 ? "null" : "base";
        }
        return "base";
    });

    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.setItemIcons("doctor_fate_helmet", "%_2", "%s_2", "%s_3");
}
function initEffects(renderer) {
    helmet = renderer.createEffect("fiskheroes:opening_mask");
    helmet.texture.set("helmet");
    helmet.anchor.set("head");
    helmet.setOffset(0.0, -7.0, 0.0).setRotation(0.0, 0.0, 0.0);

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

    utils.bindCloud(renderer, "fiskheroes:teleportation", "tmhp:doctor_fate");
    ankh = renderer.createEffect("fiskheroes:model");
    ankh.setModel(utils.createModel(renderer, "tmhp:ankh", null, "ankh"));
    ankh.anchor.set("body");
    ankh.mirror = false;

    collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -7;
    collar.inset = -0.065;

    var fire = renderer.createResource("ICON", "fiskheroes:fire_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);

    hand = renderer.createEffect("fiskheroes:overlay");
    hand.texture.set(null, "hand");
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFFFF32);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(0xFFFF32);
    magic.colorAtmosphere.set(0xFFFF32);

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xFFFF32);

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x1152FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xFFFF32, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimation(renderer, "basic.BLOCKING", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getData("fiskheroes:shield_blocking") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimation(renderer, "basic.BLOCKING", "tmhp:holding_helmet").setData((entity, data) => {
        var charge = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
        data.load(Math.max(!entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"), !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    }).setCondition(entity => !entity.is("DISPLAY"));
    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "HELMET" && entity.getData("fiskheroes:dyn/nanite_timer") > 0.6 || entity.is("DISPLAY")) {
        collar.render();

            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
    }
    if (!isFirstPersonArm && renderLayer == "HELMET" && entity.getData('fiskheroes:teleport_timer') || entity.getData('fiskheroes:dyn/nanite_timer') > 0 && entity.getData('fiskheroes:dyn/nanite_timer') < 1) {
        ankh.render();
    }
    if (renderLayer == "HELMET") {
        hand.opacity = entity.getInterpolatedData("fiskheroes:beam_charging");
        hand.render();
    }
    if (renderLayer == "HELMET" && !entity.is("DISPLAY")) {
       helmet.render();
       helmet.progress = !entity.getData('fiskheroes:dyn/nanite_timer');
    }
    if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:aiming_timer")) {
       hand_flames.render(1);
    }
    glow.opacity = entity.getData('fiskheroes:dyn/nanite_timer') > 0 && entity.getData('fiskheroes:dyn/nanite_timer') < 1;
    glow.render();
}