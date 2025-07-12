extend("fiskheroes:hero_basic");
loadTextures({
    "base": "dmh:yt_suits/butterstrike/bs_watch",
    "base_lights": "dmh:yt_suits/butterstrike/bs_watch_lights",
    "suit": "dmh:yt_suits/butterstrike/bs_up_ns.tx.json",
    "transformed": "dmh:yt_suits/butterstrike/bs_up_ns",
    "mask": "dmh:yt_suits/butterstrike/bs_up_ns_nhood",
    "shield": "dmh:yt_suits/butterstrike/bs_shield",
    "shield_lights": "dmh:yt_suits/butterstrike/bs_shield_lights",
    "butter_lights_display": "dmh:yt_suits/butterstrike/bs_up_butter_lights_butter",
    "butter_lights": "dmh:yt_suits/butterstrike/bs_up_butter_lights_butter.tx.json",
    "kinetic_lights": "dmh:yt_suits/butterstrike/bs_up_lights_kinetic.tx.json",
    "butter_lights_mask": "dmh:yt_suits/butterstrike/bs_up_butter_lights_butter_mask",
    "kinetic_lights_mask": "dmh:yt_suits/butterstrike/bs_up_lights_kinetic_mask",
    "null": "dmh:null"
});

var utils = implement("fiskheroes:external/utils");
var shield;
var arm;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35) {
            return "mask";
        } else if (!entity.is("DISPLAY")) {
            return entity.getData("dmh:dyn/transform_timer") == 0 ? "base" : "suit";
        }
        return "transformed";
    });
    renderer.setLights((entity, renderLayer) => {
        if (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35) {
            return entity.getData("dmh:dyn/transform2") ? "kinetic_lights_mask":  "butter_lights_mask";
        } else if (!entity.is("DISPLAY")) {
            return entity.getData("dmh:dyn/transform_timer") == 0 ? "base_lights" : entity.getData("dmh:dyn/transform2") ? "kinetic_lights":  "butter_lights";
        }
        return "butter_lights_display";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield", "shield_lights");
    shield.anchor.set("rightArm");
    shield.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 35.0);
    shield.large = true;

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "dmh:butter").setCondition(entity => entity.getData("fiskheroes:shadowform"));

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "dmh:invis", "rightArm", 0x0059FF, [{
                "firstPerson": [0.0, 0.0, 0.0],
                "offset": [0.0, 0.0, 0.0],
                "size": [0.0, 0.0]
            }
        ]);

    arm = utils.createLines(renderer, "dmh:kinetic", 0x0059FF, [{
                    "start": [-2.0, 8.0, -2.0],
                    "end": [-2.0, 0.1, -2.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [-1.0, 8.0, -2.0],
                    "end": [-1.0, 0.1, -2.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [0.0, 8.0, -2.0],
                    "end": [0.0, 0.1, -2.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [-2.0, 8.0, 2.0],
                    "end": [-2.0, 0.1, 2.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [-1.0, 8.0, 2.0],
                    "end": [-1.0, 0.1, 2.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [0.0, 8.0, 2.0],
                    "end": [0.0, 0.1, 2.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [-3.0, 8.0, -1.0],
                    "end": [-3.0, 0.1, -1.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [-3.0, 8.0, 0.0],
                    "end": [-3.0, 0.1, 0.0],
                    "size": [8.0, 8.0]
                }, {
                    "start": [-3.0, 8.0, 1.0],
                    "end": [-3.0, 0.1, 1.0],
                    "size": [8.0, 8.0]
                }
            ]);
    arm.anchor.set("rightArm");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "dmh:butter_beam", "body", 0xe5b161, [{
                "firstPerson": [0.0, 6.0, 0.0],
                "offset": [0.0, 5.0, -4.0],
                "size": [4.0, 4.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:impact_butter_beam"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:butter_beam", "rightArm", 0xe5b161, [{
                "firstPerson": [-4.5, 3.75, -8.0],
                "offset": [-0.5, 9.0, 0.0],
                "size": [3.0, 3.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:impact_butter_blast"));

    var bindTrail = (trailType) => {
        var prop = renderer.bindProperty("fiskheroes:trail");
        prop.setTrail(renderer.createResource("TRAIL", trailType));
        return prop;
    };
    bindTrail("dmh:butter/kinetic_speed").setCondition(entity => entity.getData("dmh:dyn/kinetic") == 0 && entity.getData("fiskheroes:speeding"));
    bindTrail("dmh:butter/kinetic_charge_speed").setCondition(entity => entity.getData("dmh:dyn/kinetic") > 0 && entity.getData("dmh:dyn/kinetic") < 1 && entity.getData("fiskheroes:speeding"));
    bindTrail("dmh:butter/kinetic_charged_speed").setCondition(entity => entity.getData("dmh:dyn/kinetic") == 1 && entity.getData("fiskheroes:speeding"));
    bindTrail("dmh:butter/kinetic_charge").setCondition(entity => entity.getData("dmh:dyn/kinetic") > 0 && entity.getData("dmh:dyn/kinetic") < 1 && !entity.getData("fiskheroes:speeding"));
    bindTrail("dmh:butter/kinetic_charged").setCondition(entity => entity.getData("dmh:dyn/kinetic") == 1 && !entity.getData("fiskheroes:speeding"));

    utils.bindParticles(renderer, "dmh:butter_kinetic_burst")
    bindTrail("dmh:butter/kinetic_burst").setCondition(entity => entity.getData("dmh:dyn/ignite") && entity.getData("dmh:dyn/ignite_timer") > 0.4 && entity.getData("dmh:dyn/ignite_timer") < 0.6);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "butterstrike.BLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
    addAnimationWithData(renderer, "butterstrike.SPEED", "fiskheroes:speedster_sprint", "fiskheroes:dyn/speed_sprint_timer");
    addAnimationWithData(renderer, "butterstrike.BURST", "dmh:butter_kinetic_burst", "dmh:dyn/ignite_timer").setCondition(entity => entity.getData("dmh:dyn/ignite"));
    addAnimation(renderer, "butterstrike.MASK", "fiskheroes:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield.setOffset(2.9 + 1.8 * Math.min(shield.unfold * 5, 1), 6.0, 0.0);
    shield.render();

    arm.progress = entity.getInterpolatedData("fiskheroes:energy_charge");
    arm.render();

}
