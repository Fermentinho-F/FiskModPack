extend("fiskheroes:hero_basic");
loadTextures({
    "base": "emo:spider",
    "suit": "emo:spider.tx.json",
    "reactor": "emo:spiderpack",
    "backpack": "emo:sari",
    "repulsor": "fiskheroes:iron_man_repulsor",
    "repulsor_left": "fiskheroes:iron_man_repulsor_left",
    "repulsor_boots": "fiskheroes:iron_man_repulsor_boots",
    "segment": "emo:sari",
    "claw": "emo:sari",
    "claw_lights": "fiskheroes:doctor_octopus_claw_lights"
});

var utils = implement("fiskheroes:external/utils");
var mk85_backpack = implement("fiskheroes:external/mk85_backpack");
var iron_man_boosters = implement("fiskheroes:external/iron_man_boosters");

var backpack;
var boosters;

var repulsor;


function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.isDisplayStand()) {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "reactor" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask_lights";
        }
        return !entity.isDisplayStand() && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1 ? "reactor_lights" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    repulsor = renderer.createEffect("fiskheroes:overlay");

    backpack = mk85_backpack.create(renderer, "backpack");
    boosters = iron_man_boosters.create(renderer, "fiskheroes:repulsor_layer_%s", true);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    var ock_arm = utils.createModel(renderer, "fiskheroes:ock_arm", "segment");
    var ock_claw = utils.createModel(renderer, "fiskheroes:ock_claw", "claw", "claw_lights");
    ock_claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [2.0, -7.5, -2.0], "direction": [13.0, -10.0, -10.0] },
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(ock_arm);
    tentacles.setHeadModel(ock_claw);
    tentacles.segmentLength = 1.8;
    tentacles.segments = 16;

    utils.bindParticles(renderer, "fiskheroes:iron_man").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0xFFC462, [
        { "offset": [6.75, 10.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [10.0, 0.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [6.5, -4.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.75, 10.0, 3.0], "size": [2.0, 2.0] },
        { "offset": [-10.0, 0.5, 3.0], "size": [2.0, 2.0] },
        { "offset": [-6.5, -4.5, 3.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
}

    function initAnimations(renderer) {
        parent.initAnimations(renderer);
        renderer.removeCustomAnimation("basic.AIMING");
        addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));
    
        addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
            .priority = 2;
    
        addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
            .priority = 2;
    
        addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
            .priority = 5;
    
        utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
        utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
        utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
        utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
            "fiskheroes:swing_roll",
            "fiskheroes:swing_roll2",
            "fiskheroes:swing_roll5"
        ]);
        utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
        utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
        utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
        utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
            "fiskheroes:swing_dive",
            "fiskheroes:swing_dive2"
        ]);
        utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
        utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
        utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
        utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
        utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
        utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
        utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
            "fiskheroes:swing_rotate_right", "fiskheroes:swing_rotate_right1"
        ]);
        utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
            "fiskheroes:swing_rotate_left", "fiskheroes:swing_rotate_left1"
        ]);

        utils.addFlightAnimationWithLanding(renderer, "iron_man.FLIGHT", "fiskheroes:flight/iron_man.anim.json");
        utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
        utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    
        addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
            .priority = -8;
    
        addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
            .priority = 10;
    }
    

    function render(entity, renderLayer, isFirstPersonArm) {
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_r_timer");
        repulsor.texture.set(null, "repulsor");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_l_timer");
        repulsor.texture.set(null, "repulsor_left");
        repulsor.render();
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        repulsor.texture.set(null, "repulsor_boots");
        repulsor.render();
    
        backpack.render(entity.getInterpolatedData("fiskheroes:beam_charge"));
        boosters.render(entity, renderLayer, isFirstPersonArm, true);
    
    }
    