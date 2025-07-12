extend("fiskheroes:hero_basic");
loadTextures({
    "ssjtransform": "db:goku/gokussj.tx.json",
    "ssj": "db:goku/gokussjaura",
    "baseaura": "db:goku/baseaura",
    "gokussj": "db:goku/gokussj",
    "gokubase": "db:goku/gokubase",
    "layer2": "db:goku/null",
    "helmet": "db:goku/null",
    "arms": "db:goku/arms",
    "hair": "db:goku/hair",
    "ssjhair": "db:goku/ssjhair",
    "ssjhairaura": "db:goku/ssjhairaura",
    "eyes": "db:goku/eyes",
    "ssjeyes": "db:goku/ssjeyes",
    "ssjeyesglow": "db:goku/ssjeyesglow",
    "blancoarms": "db:goku/blancoarms",
    "ssjarms": "db:goku/ssjarms"
});

var utils = implement("fiskheroes:external/utils");
var utils2 = implement("fiskheroes:external/utils");

var overlay;
var glow;
var glow2;
var vibration;
var leftarm;
var rightarm;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
            if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "gokubase" : timer < 1 ? "ssjtransform" : "gokussj";
        }
        return "gokubase";
    });

    renderer.showModel("BOOTS", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "db:leftarm");
    model.bindAnimation("db:kicharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model.bindAnimation("db:kichargessj").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model.texture.set("arms");
    leftarm = renderer.createEffect("fiskheroes:model").setModel(model);
    leftarm.anchor.set("rightArm");



    var model2 = renderer.createResource("MODEL", "db:rightarm");
    model2.bindAnimation("db:kicharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model2.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model2.bindAnimation("db:kichargessj").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model2.texture.set("arms");
    rightarm = renderer.createEffect("fiskheroes:model").setModel(model2);
    rightarm.anchor.set("leftArm");






    var modelssj = renderer.createResource("MODEL", "db:leftarm");
    modelssj.bindAnimation("db:kichargessj").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    modelssj.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    modelssj.texture.set("arms");
    leftarmssj = renderer.createEffect("fiskheroes:model").setModel(modelssj);
    leftarmssj.anchor.set("rightArm");

    var model2ssj = renderer.createResource("MODEL", "db:rightarm");
    model2ssj.bindAnimation("db:kichargessj").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model2ssj.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model2ssj.texture.set("arms");
    rightarmssj = renderer.createEffect("fiskheroes:model").setModel(model2ssj);
    rightarmssj.anchor.set("leftArm");






    var model5 = renderer.createResource("MODEL", "db:rightarm");
    model5.bindAnimation("db:kicharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model5.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model5.texture.set(null, "arms");
    leftarmbaseglow = renderer.createEffect("fiskheroes:model").setModel(model5);
    leftarmbaseglow.anchor.set("leftArm");





    var model6 = renderer.createResource("MODEL", "db:leftarm");
    model6.bindAnimation("db:kicharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model6.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model6.texture.set(null, "arms");
    rightarmbaseglow = renderer.createEffect("fiskheroes:model").setModel(model6);
    rightarmbaseglow.anchor.set("rightArm");




   

    var model7 = renderer.createResource("MODEL", "db:rightarm");
    model7.bindAnimation("db:kichargessj").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model7.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model7.texture.set(null, "ssjarms");
    leftarmssjglow = renderer.createEffect("fiskheroes:model").setModel(model7);
    leftarmssjglow.anchor.set("leftArm");





    var model8 = renderer.createResource("MODEL", "db:leftarm");
    model8.bindAnimation("db:kichargessj").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
        });
    model8.bindAnimation("db:kamecharge").setData((entity, data) => {
             if (cancelAnimations) {
                data.load(0, 0);
                return;
            }
            data.load(0, !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge"));
        });
    model8.texture.set(null, "ssjarms");
    rightarmssjglow = renderer.createEffect("fiskheroes:model").setModel(model8);
    rightarmssjglow.anchor.set("rightArm");


    var model9 = renderer.createResource("MODEL", "db:gokuhair");
	model9.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') && entity.loop(4)));
        model9.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:flight_boost_timer') > 0.8 && entity.loop(11)));
        model9.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aiming_timer') > 0.8 && entity.loop(2)));
        model9.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aimed_timer') ));
        model9.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') ));
    model9.texture.set("hair");
    hair = renderer.createEffect("fiskheroes:model").setModel(model9);
    hair.anchor.set("head");


    var model10 = renderer.createResource("MODEL", "db:gokuhair");
        model10.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') && entity.loop(4)));
	model10.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:flight_boost_timer') > 0.8 && entity.loop(11)));
        model10.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aiming_timer') > 0.8 && entity.loop(2)));
        model10.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aimed_timer') ));
        model10.bindAnimation("db:gokubasehairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') ));
    model10.texture.set(null, "hair");
    hairglow = renderer.createEffect("fiskheroes:model").setModel(model10);
    hairglow.anchor.set("head");






    var model9ssj = renderer.createResource("MODEL", "db:gokussjhair");
	model9ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') && entity.loop(4)));
        model9ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:flight_boost_timer') > 0.8 && entity.loop(11)));
        model9ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aiming_timer') > 0.8 && entity.loop(2)));
        model9ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aimed_timer') ));
        model9ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') ));
    model9ssj.texture.set("ssjhair");
    ssjhair = renderer.createEffect("fiskheroes:model").setModel(model9ssj);
    ssjhair.anchor.set("head");


    var model10ssj = renderer.createResource("MODEL", "db:gokussjhair");
        model10ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') && entity.loop(4)));
	model10ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:flight_boost_timer') > 0.8 && entity.loop(11)));
        model10ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aiming_timer') > 0.8 && entity.loop(2)));
        model10ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:aimed_timer') ));
        model10ssj.bindAnimation("db:gokussjhairanimation").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:beam_shooting') ));
    model10ssj.texture.set(null, "ssjhairaura");
    ssjhairglow = renderer.createEffect("fiskheroes:model").setModel(model10ssj);
    ssjhairglow.anchor.set("head");




    var model11 = renderer.createResource("MODEL", "db:gokueyes");
    model11.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
    });
    model11.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:beam_charging"));
    });
    model11.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("db:dyn/glow_timer"));
    });
    model11.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        });
    model11.texture.set("eyes");
    eyes = renderer.createEffect("fiskheroes:model").setModel(model11);
    eyes.anchor.set("head");


    var model12 = renderer.createResource("MODEL", "db:gokueyes");
    model12.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer"));
    });
    model12.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:beam_charging"));
    });
    model12.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("db:dyn/glow_timer"));
    });
    model12.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        });
    model12.texture.set(null, "eyes");
    eyesglow = renderer.createEffect("fiskheroes:model").setModel(model12);
    eyesglow.anchor.set("head");




    var model13 = renderer.createResource("MODEL", "db:ssjgokueyes");
    model13.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
        });
    model13.texture.set("ssjeyes");
    ssjeyes = renderer.createEffect("fiskheroes:model").setModel(model13);
    ssjeyes.anchor.set("head");


    var model14 = renderer.createResource("MODEL", "db:ssjgokueyes");
    model14.bindAnimation("db:gokueyesanimation").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
        });
    model14.texture.set(null, "ssjeyesglow");
    ssjeyesglow = renderer.createEffect("fiskheroes:model").setModel(model14);
    ssjeyesglow.anchor.set("head");


    utils.setOpacity(renderer, 1.0, 1.0);
    utils2.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:teleport_timer");

    vibration = renderer.createEffect("fiskheroes:vibration");
    vibration.includeEffects(eyes, eyesglow, ssjeyes, ssjeyesglow, hair, hairglow, ssjhair, ssjhairglow, leftarm, rightarm, leftarmssj, rightarmssj, leftarmbaseglow, rightarmbaseglow, leftarmssjglow, rightarmssjglow);
  
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(eyes, eyesglow, ssjeyes, ssjeyesglow, hair, hairglow, ssjhair, ssjhairglow, leftarm, rightarm, leftarmssj, rightarmssj, leftarmbaseglow, rightarmbaseglow, leftarmssjglow, rightarmssjglow);
    glow.color.set(0xFFFFFF);

    overlaybase = renderer.createEffect("fiskheroes:overlay");
    overlaybase.texture.set(null, "baseaura");

    overlay2 = renderer.createEffect("fiskheroes:overlay");
    overlay2.texture.set(null, "ssj");
  
    utils.addCameraShake(renderer, 0.3, 0.0, "fiskheroes:aimed_timer");
    utils.addCameraShake(renderer, 4.7, 0.0, "db:dyn/glow_timer");
    utils.addCameraShake(renderer, 4.0, 0.0, "fiskheroes:teleport_timer");
    utils.addCameraShake(renderer, 5.0, 0.0, "fiskheroes:beam_shooting");
    utils.addCameraShake(renderer, 0.2, 0.0, "fiskheroes:beam_charging");

    kissj = utils.createLines(renderer, "db:ki", 0xf6d060,[
                {"start": [0.0, 0.0, -1.7], "end": [0.0, 0.0, 1.7], "size": [20.0, 10.0]},
    ]);
    kissj.anchor.set("body");
    kissj.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(16.0, 14.0, 16.0);
    kissj.mirror = false;

    kissjflight = utils.createLines(renderer, "db:brolykibase", 0xf6d060,[
                {"start": [0.0, 0.0, 0.6], "end": [0.0, 0.0, -2.1], "size": [20.0, 10.0]},
    ]);
    kissjflight.anchor.set("body");
    kissjflight.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(14.0, 12.0, 14.0);
    kissjflight.mirror = false;

    kibaseflight = utils.createLines(renderer, "db:brolykibase", 0xf9fdff,[
                {"start": [0.0, 0.0, 0.6], "end": [0.0, 0.0, -2.1], "size": [20.0, 10.0]},
    ]);
    kibaseflight.anchor.set("body");
    kibaseflight.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(14.0, 12.0, 14.0);
    kibaseflight.mirror = false;


    kibase = utils.createLines(renderer, "db:brolykibase", 0xf9fdff,[
                {"start": [0.0, 0.0, -1.7], "end": [0.0, 0.0, 1.7], "size": [20.0, 10.0]},
    ]);
    kibase.anchor.set("body");
    kibase.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(14.0, 12.0, 14.0);
    kibase.mirror = false;

    kikame = utils.createLines(renderer, "db:brolykibase", 0xf9fdff,[
                {"start": [0.0, 0.0, -1.7], "end": [0.0, 0.0, 0.1], "size": [20.0, 10.0]},
    ]);
    kikame.anchor.set("body");
    kikame.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(14.0, 12.0, 14.0);
    kikame.mirror = false;

    kikamessj = utils.createLines(renderer, "db:brolykibase", 0xf6d060,[
                {"start": [0.0, 0.0, -1.7], "end": [0.0, 0.0, 0.1], "size": [20.0, 10.0]},
    ]);
    kikamessj.anchor.set("body");
    kikamessj.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(14.0, 12.0, 14.0);
    kikamessj.mirror = false;

    kibase2 = utils.createLines(renderer, "db:brolykibase", 0xf9fdff,[
                {"start": [0.0, 0.0, -1.7], "end": [0.0, 0.0, 1.5], "size": [20.0, 10.0]},
    ]);
    kibase2.anchor.set("body");
    kibase2.setOffset(0, 0, 0).setRotation(90.0, 0.0, 0.0).setScale(14.0, 12.0, 14.0);
    kibase2.mirror = false;

    bolakame = utils.createLines(renderer, "db:charged_beam", 0x34c0ff,[
        {"start": [0.0, 2.0, 0.0], "end": [0.0, 0.0, 0.0], "size": [30, 30]},
    ]);
    bolakame.setOffset(0.5, -2, -9).setRotation(0.0, 0.0, 0.0).setScale(2.0, 2.0, 2.0);
    bolakame.anchor.set("rightArm");
    
    // Kame Ssj
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "db:energy_projection", "rightArm", 0x34c0ff, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [16.0, 16.0]},
    ]);

    // Kame Base
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "db:energy_projection", "rightArm", 0x34c0ff, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [6.0, 6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "goku.KAME", "db:kamecharge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "goku.SHOOT_KAME", "db:kameshoot", "fiskheroes:beam_shooting").setCondition(entity => (entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "goku.KAMEANIMOFF", "db:kameoff", "fiskheroes:beam_charge").setCondition(entity => (!entity.getData("fiskheroes:beam_charging")));

    addAnimationWithData(renderer, "goku.KICHARGE", "db:kicharge", "fiskheroes:aiming_timer").setCondition(entity => (!entity.getData("fiskheroes:dyn/nanite_timer")));
    addAnimationWithData(renderer, "goku.KICHARGESSJ", "db:kichargessj", "fiskheroes:aiming_timer").setCondition(entity => (entity.getData("fiskheroes:dyn/nanite_timer")));
    addAnimationWithData(renderer, "goku.TELEPORT", "db:teleport", "fiskheroes:teleport_timer").setCondition(entity => (!entity.getData("fiskheroes:beam_charging")));
    
    addAnimation(renderer, "GOKU_ARMS", "db:armsfix")
    .setData((entity, data) => {
        data.load(0, !entity.getInterpolatedData('fiskheroes:shield_blocking_timer'));
    })
    .priority = 1000;

    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral").setCondition(entity => (!entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:aiming_timer")));
    utils.addFlightAnimation(renderer, "mysterio.FLIGHT", "fiskheroes:flight/default.anim.json");
}

function render(entity, renderLayer, isFirstPersonArm) {
    cancelAnimations = false;

    if (renderLayer == "BOOTS") {
    leftarm.render();
    rightarm.render();

    eyes.opacity = eyes.render = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
    eyes.render();

    ssjeyes.opacity = ssjeyes.render = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
    ssjeyes.render();

    eyesglow.opacity = !entity.getInterpolatedData("db:dyn/glow") && !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    eyesglow.render();
  
    eyesglow.opacity = eyesglow.render = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    eyesglow.render();
  
    eyesglow.opacity = eyesglow.render = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    eyesglow.render();

    ssjeyesglow.opacity = !entity.getInterpolatedData("db:dyn/glow") && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    ssjeyesglow.render();
  
    ssjeyesglow.opacity = eyesglow.render = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    ssjeyesglow.render();
  
    ssjeyesglow.opacity = eyesglow.render = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    ssjeyesglow.render();

    hairglow.opacity = !entity.getInterpolatedData("db:dyn/glow_timer") && !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    hairglow.render();

    hairglow.opacity = hairglow.render = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    hairglow.render();

    hairglow.opacity = hairglow.render = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    hairglow.render();

    hair.opacity = hair.render = !entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
    hair.render();

     


    ssjhairglow.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    ssjhairglow.render();

    ssjhairglow.opacity = ssjhairglow.render = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    ssjhairglow.render();

    ssjhairglow.opacity = ssjhairglow.render = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    ssjhairglow.render();

    ssjhair.opacity = ssjhair.render = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
    ssjhair.render();

    overlaybase.opacity = !entity.getInterpolatedData("db:dyn/glow_timer") && !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    overlaybase.render();
    leftarmbaseglow.opacity = !entity.getInterpolatedData("db:dyn/glow_timer") && !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    leftarmbaseglow.render();
    rightarmbaseglow.opacity = !entity.getInterpolatedData("db:dyn/glow_timer") && !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    rightarmbaseglow.render();
    leftarmssjglow.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    leftarmssjglow.render();
    rightarmssjglow.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    rightarmssjglow.render();
    overlay2.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    overlay2.render();

    overlay2.opacity = kikamessj.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    overlay2.render();
    leftarmssjglow.opacity = kikamessj.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    leftarmssjglow.render();
    rightarmssjglow.opacity = kikamessj.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    rightarmssjglow.render();

    overlaybase.opacity = kikamessj.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    overlaybase.render();
    leftarmbaseglow.opacity = kikamessj.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    leftarmbaseglow.render();
    rightarmbaseglow.opacity = kikamessj.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    rightarmbaseglow.render();

    overlay2.opacity = kissjflight.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    overlay2.render();
    leftarmssjglow.opacity = kissjflight.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    leftarmssjglow.render();
    rightarmssjglow.opacity = kissjflight.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    rightarmssjglow.render();

    overlaybase.opacity = kissjflight.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    overlaybase.render();
    leftarmbaseglow.opacity = kissjflight.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    leftarmbaseglow.render();
    rightarmbaseglow.opacity = kissjflight.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer");
    rightarmbaseglow.render();

    kissj.progress = kissj.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    kissj.render();
    kissjflight.progress = kissjflight.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer") * 3 - 1, 0
    kissjflight.render();
    kibaseflight.progress = kibaseflight.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:flight_boost_timer") * 3 - 1, 0
    kibaseflight.render();
    kibase.progress = kibase.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:aiming_timer");
    kibase.render();
    kibase2.progress = kibase.render = entity.getInterpolatedData("db:dyn/glow_timer") && !entity.getInterpolatedData("fiskheroes:aiming");
    kibase2.render();

    bolakame.opacity = bolakame.render = !entity.getInterpolatedData("fiskheroes:beam_shooting") && entity.getInterpolatedData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    bolakame.render();

    kikame.progress = kikame.render = !entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    kikame.render();

    kikamessj.progress = kikamessj.render = entity.getInterpolatedData("fiskheroes:dyn/nanites") && entity.getInterpolatedData("fiskheroes:beam_charge") * 3 - 1, 0
    kikamessj.render();
  
    glow.opacity = entity.getInterpolatedData("db:dyn/glow_timer");
    glow.render();

}
    if (!entity.isDisplayStand() && entity.getData("fiskheroes:teleport_timer")) {
        vibration.render();
    }
}




