extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "jmctheroes:miles/spider_man_miles_ps5_layer1",
    "layer2": "jmctheroes:miles/spider_man_miles_ps5_layer2",
    "spidersense": "jmctheroes:miles/spidersense"
});

var utils = implement("fiskheroes:external/utils");

var sense;
var R_bio_beam;
var L_bio_beam;

function init(renderer) {
    parent.init(renderer);
    sense = renderer.createEffect("fiskheroes:model");
    sense.setModel(utils.createModel(renderer, "jmctheroes:spideysense", null, "spidersense"));
    sense.anchor.set("head");

    renderer.setItemIcon("HELMET", "spider_miles_0");
    renderer.setItemIcon("CHESTPLATE", "spider_miles_1");
    renderer.setItemIcon("LEGGINGS", "spider_miles_2");
    renderer.setItemIcon("BOOTS", "spider_miles_3");
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0xFF6A00);

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        var timer = entity.getInterpolatedData("jmctheroes:dyn/invis_timer");
        var partial = Math.min(Math.max(entity.motion().length() / 20, 0), 0.7);
        return 1 + (partial - 1) * timer;
    });

    var lightning_color = 0xFF6A00;
    var beam_type = renderer.createResource("BEAM_RENDERER", "jmctheroes:bio_electricity");
    R_bio_beam = utils.createLines(renderer, beam_type, lightning_color, [
        {"start": [0.2, 0.0, -1.8], "end": [-2.3, 4.5, -1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 4.5, -1.8], "end": [0.2, 6.0, -1.8], "size": [10.0, 10.0]},

        {"start": [-2.3, 4.5, -1.8], "end": [-2.3, 1.0, 1.8], "size": [10.0, 10.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [-2.3, 4.5, -1.8], "size": [10.0, 10.0]},

        {"start": [0.2, 0.0, 1.8], "end": [-2.3, 1.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 1.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
    ]);
    R_bio_beam.anchor.set("rightArm");
    R_bio_beam.setScale(1.5);
    R_bio_beam.mirror = false;
    
    L_bio_beam = utils.createLines(renderer, beam_type, lightning_color, [
        {"start": [0.2, 0.0, -1.8], "end": [-2.3, 4.5, -1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 4.5, -1.8], "end": [0.2, 6.0, -1.8], "size": [10.0, 10.0]},

        {"start": [-2.3, 4.5, -1.8], "end": [-2.3, 1.0, 1.8], "size": [10.0, 10.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [-2.3, 4.5, -1.8], "size": [10.0, 10.0]},

        {"start": [0.2, 0.0, 1.8], "end": [-2.3, 1.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 1.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
        {"start": [-2.3, 6.0, 1.8], "end": [0.2, 6.0, 1.8], "size": [12.0, 12.0]},
    ]);
    L_bio_beam.anchor.set("leftArm");
    L_bio_beam.setRotation(0, 180.0, 0).setScale(1.5);
    L_bio_beam.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFF6A00, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 7.0, 0.0], "size": [1.5, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "jmctheroes:swing_right2");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "jmctheroes:swing_left2");
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["jmctheroes:swing_upside_down", "jmctheroes:swing_right2", "fiskheroes:swing_default"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["jmctheroes:rockstar_swing", "jmctheroes:miles_roll", "jmctheroes:swing_roll6", "fiskheroes:swing_roll2", "fiskheroes:swing_roll3", "fiskheroes:swing_roll5", "jmctheroes:swing_roll7", "jmctheroes:swing_roll8"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", ["fiskheroes:swing_rotate_right", "fiskheroes:swing_rotate_right1"]),
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", ["fiskheroes:swing_rotate_left", "fiskheroes:swing_rotate_left1"]);
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", ["jmctheroes:swing_dive_miles", "jmctheroes:swing_dive_miles2", "jmctheroes:swing_dive_miles3", "jmctheroes:swing_dive_miles4", "jmctheroes:swing_dive_miles5","fiskheroes:swing_dive", "fiskheroes:swing_dive2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", ["fiskheroes:swing_springboard", "jmctheroes:swing_roll6"]);
}

function render(entity, renderLayer, isFirstPersonArm){
    if (renderLayer == "CHESTPLATE"){
        R_bio_beam.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        R_bio_beam.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        R_bio_beam.render();
        L_bio_beam.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        L_bio_beam.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:energy_charge')) * 1, 0);
        L_bio_beam.render();
    }
    var slow = entity.getData("fiskheroes:slow_motion");
    if (renderLayer == "HELMET" && slow) {
        sense.render();
    }
}