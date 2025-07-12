var LOADTEXTURES = {
    "omnitrix": "tmf:omnitrix/device/omni_proto",
    "omnitrix_lights": "tmf:omnitrix/device/omni_proto.tx.json",
    "omnitrix_capture": "tmf:omnitrix/device/omni_proto_y",
    "omnitrix_timeout": "tmf:omnitrix/device/omni_proto_r",
    "omnitrix_white": "tmf:omnitrix/device/omni_proto_w",

    "omni_hack": "tmf:omnitrix/device/omni_hack",
    "omni_hack_lights": "tmf:omnitrix/device/omni_hack_lights",

    "omnitrixB": "tmf:omnitrix/device/omni_proto_big",
    "omnitrixB_lights": "tmf:omnitrix/device/omni_proto_big.tx.json",
    "omnitrixB_timeout": "tmf:omnitrix/device/omni_proto_big_r",
    "omnitrixB_white": "tmf:omnitrix/device/omni_proto_big_w",

    "omnitrix3": "tmf:omnitrix/device/badge_3x3",
    "omnitrix3_lights": "tmf:omnitrix/device/badge_3x3.tx.json",
    "omnitrix3_timeout": "tmf:omnitrix/device/badge_3x3_r",
    "omnitrix3_white": "tmf:omnitrix/device/badge_3x3_w",


    "omnitrix_pod": "tmf:omnitrix/device/pod",
    "zs_skayr": "tmf:omnitrix/p2/aliens/zs_skayr.tx.json",
    "zs_skayr_lights": "tmf:omnitrix/p2/lights/zs_skayr_lights",

    "omnitrix_recal": "tmf:omnitrix/device/omni_recal_watch.tx.json",
    "omni_r1": "tmf:omnitrix/device/omni_recal1",
    "omni_r2": "tmf:omnitrix/device/omni_recal2",
    "omni_r3": "tmf:omnitrix/device/omni_recal3",
    "omni_r4": "tmf:omnitrix/device/omni_recal4",
    "omnitrix_recalibrating": "tmf:omnitrix/device/omnitrix_recalibrating",
    "null": "tmf:null"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var prototype = omnitrix(renderer, "prototype");
    var recal = omnitrix(renderer, "recal");
    var hologram = omnitrix(renderer, "recal_hologram");

    var recal1 = omnitrix(renderer, "omni_r1");
    var recal2 = omnitrix(renderer, "omni_r2");
    var recal3 = omnitrix(renderer, "omni_r3");
    var recal4 = omnitrix(renderer, "omni_r4");

    utils.bindParticles(renderer, "tmf:omnitrix_transformation");
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "omnitrix.ARM_MOVEMENT", "tmf:omnitrix/arm_movement").setData((entity, data) => {
		data.load(entity.getInterpolatedData("tmf:dyn/selecting_timer") + entity.getInterpolatedData("tmf:dyn/galvan_mod_timer"));
		});

    addAnimation(renderer, "omnitrix.TAMPERING", "tmf:omnitrix/tampering").setData((entity, data) => {
		data.load(0, entity.getData('tmf:dyn/tamper') ? entity.getInterpolatedData("tmf:dyn/tamper_timer") : 0);
		});
    var transformationGlow = renderer.createEffect("fiskheroes:glowerlay");

    var modelOmnitrixPrototypeZsSkayr = renderer.createResource("MODEL", "tmf:omnitrix/device/zs_skayr_head");
    modelOmnitrixPrototypeZsSkayr.texture.set("zs_skayr", "zs_skayr_lights");
    var omnitrixPrototypeZsSkayr = renderer.createEffect("fiskheroes:model").setModel(modelOmnitrixPrototypeZsSkayr);

    var modelPod = renderer.createResource("MODEL", "tmf:omnitrix/device/omnitrix_pod");
    modelPod.texture.set("omnitrix_pod");
    var pod = renderer.createEffect("fiskheroes:model").setModel(modelPod);
    pod.setOffset(0, 0, 2);

    var forcefieldFailsafe = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldFailsafe.color.set(0xbaf43c);
    forcefieldFailsafe.setShape(36, 18).setOffset(0.0, 6.0, 0.0)
    forcefieldFailsafe.setCondition(entity => {
    forcefieldFailsafe.opacity = entity.getData("tmf:dyn/failsafe") ? 1.5 * entity.getInterpolatedData("tmf:dyn/failsafe_timer") : 0;
    forcefieldFailsafe.setScale(entity.getData("tmf:dyn/failsafe") ? 5 * entity.getInterpolatedData("tmf:dyn/failsafe_timer") : null);
    return true;
    });

    var modelOmnitrixPrototypeHack = renderer.createResource("MODEL", "tmf:omnitrix/weapons/omnitrix_hack");
    modelOmnitrixPrototypeHack.bindAnimation("tmf:omnitrix/omnitrix_hack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/selecting_timer') + entity.getInterpolatedData('tmf:dyn/galvan_mod_timer')); 
        data.load(1, entity.getInterpolatedData('tmf:dyn/selecting_timer2')); 
        data.load(2, entity.getData('tmf:dyn/fusioned') ? 1 : 0); 
    });
    modelOmnitrixPrototypeHack.texture.set("omni_hack");
    var omnitrixPrototypeHack = renderer.createEffect("fiskheroes:model").setModel(modelOmnitrixPrototypeHack);

    var modelOmnitrixPrototypeHack1 = renderer.createResource("MODEL", "tmf:omnitrix/weapons/omnitrix_hack1");
    modelOmnitrixPrototypeHack1.bindAnimation("tmf:omnitrix/omnitrix_hack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/selecting_timer') + entity.getInterpolatedData('tmf:dyn/galvan_mod_timer')); 
        data.load(1, entity.getInterpolatedData('tmf:dyn/selecting_timer2')); 
        data.load(2, entity.getData('tmf:dyn/fusioned') ? 1 : 0); 
    });
    modelOmnitrixPrototypeHack1.texture.set(null, "omni_hack_lights");
    var omnitrixPrototypeHack1 = renderer.createEffect("fiskheroes:model").setModel(modelOmnitrixPrototypeHack1);

    var modelOmnitrixPrototypeHack2 = renderer.createResource("MODEL", "tmf:omnitrix/weapons/omnitrix_hack2");
    modelOmnitrixPrototypeHack2.bindAnimation("tmf:omnitrix/omnitrix_hack").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/selecting_timer') + entity.getInterpolatedData('tmf:dyn/galvan_mod_timer')); 
        data.load(1, entity.getInterpolatedData('tmf:dyn/selecting_timer2')); 
        data.load(2, entity.getData('tmf:dyn/fusioned') ? 1 : 0); 
    });
    modelOmnitrixPrototypeHack2.texture.set(null, "omni_hack_lights");
    var omnitrixPrototypeHack2 = renderer.createEffect("fiskheroes:model").setModel(modelOmnitrixPrototypeHack2);

    var recalBloomResource = renderer.createResource("BEAM_RENDERER", "tmf:aura");
    var recalBloom = utils.createLines(renderer, recalBloomResource, 0x60B42A, [
        {"start": [1, 3.5, 0], "end": [1, 4.5, 0], "size": [25.0, 25.0]},
    ]);
    recalBloom.anchor.set("leftArm");

    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
                if (isFirstPersonArm) {
                    omnitrixPrototypeHack.setOffset(-14, 4, 2);
                    omnitrixPrototypeHack.setRotation(-60.0, 165.0, -55.0);
                    omnitrixPrototypeHack.anchor.ignoreAnchor(true);	

                    omnitrixPrototypeHack1.setOffset(-14, 4, 2);
                    omnitrixPrototypeHack1.setRotation(-60.0, 165.0, -55.0);
                    omnitrixPrototypeHack1.anchor.ignoreAnchor(true);	

                    omnitrixPrototypeHack2.setOffset(-14, 4+(-Math.ceil(5*entity.loop(16))/10 + 0.5), 2);
                    omnitrixPrototypeHack2.setRotation(-60.0, 165.0, -55.0);
                    omnitrixPrototypeHack2.anchor.ignoreAnchor(true);	

                    if (entity.getData("tmf:dyn/pc_1") != 0 && (entity.ticksExisted() % 4 == 0)) {
                        omnitrixPrototypeZsSkayr.setScale(Math.min(10*entity.getInterpolatedData("tmf:dyn/pc_1"), 2));
                        omnitrixPrototypeZsSkayr.anchor.ignoreAnchor(true);	
                        omnitrixPrototypeZsSkayr.render();
                    }
                } 
                if (!isFirstPersonArm) {
                    omnitrixPrototypeHack.setOffset(0, 0, 0);
                    omnitrixPrototypeHack.setRotation(0.0, 0.0, 0.0);
                    omnitrixPrototypeHack.anchor.ignoreAnchor(false);	
                    omnitrixPrototypeHack.anchor.set("leftArm");

                    omnitrixPrototypeHack1.setOffset(0, 0, 0);
                    omnitrixPrototypeHack1.setRotation(0.0, 0.0, 0.0);
                    omnitrixPrototypeHack1.anchor.ignoreAnchor(false);	
                    omnitrixPrototypeHack1.anchor.set("leftArm");

                    omnitrixPrototypeHack2.setOffset(-Math.ceil(5*entity.loop(16))/10 + 0.5, 0, 0);
                    omnitrixPrototypeHack2.setRotation(0.0, 0.0, 0.0);
                    omnitrixPrototypeHack2.anchor.ignoreAnchor(false);	
                    omnitrixPrototypeHack2.anchor.set("leftArm");
                }

                if (!isFirstPersonArm && entity.as("DISPLAY").getDisplayType() == "FABRICATOR_RESULT") {	
                    pod.render();
                }

            if ((entity.getData('tmf:dyn/transformation') && entity.getData('tmf:dyn/transformation_timer') != 1) || (!entity.getData('tmf:dyn/transformation') && entity.getData('tmf:dyn/transformation_timer') != 0 && entity.getWornChestplate().nbt().getString('HeroType') == 'tmf:omni_recal')) {
                transformationGlow.color.set(0x83cb59);
                transformationGlow.opacity = entity.getInterpolatedData('tmf:dyn/transformation_timer');
                transformationGlow.render();
            }
            if (!entity.getData('tmf:dyn/transformation') && entity.getData('tmf:dyn/transformation_timer') != 0 && entity.getWornChestplate().nbt().getString('HeroType') != 'tmf:omni_recal') {
                transformationGlow.color.set(0xd74f56);
                transformationGlow.opacity = 1.0001-entity.getInterpolatedData('tmf:dyn/transformation_timer');
                transformationGlow.render();
            }

            if (entity.as("DISPLAY").getDisplayType() != "FABRICATOR_RESULT") {	
                var recalTimer = entity.getInterpolatedData("tmf:dyn/recalibrating");
                var capture = entity.getData('tmf:dyn/captureMode');
                var timeout = !entity.as('PLAYER').isCreativeMode() && entity.getData('tmf:dyn/transformation_timer') == 0 && entity.getData('tmf:dyn/transformation_cooldown') != 0;
                var recal0 = entity.getInterpolatedData("tmf:dyn/recal_timer");
                if (entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omni_recal" || recalTimer >= 0.6) {
                    recal.render(recal0, recalTimer, isFirstPersonArm, capture, timeout, pull(entity, "color"));
                
                    if (entity.getData('tmf:dyn/selecting_timer') != 0) {
                        hologram.render(null, null, isFirstPersonArm, capture, timeout, pull(entity, "color"), entity.getData('tmf:dyn/selecting_timer'), entity.loop(12), Math.max(0,entity.getInterpolatedData('tmf:dyn/selecting_timer')-0.1*entity.loop(6)-0.8*entity.getInterpolatedData('tmf:dyn/selecting_timer2')));
                    }
                }
                if (entity.getWornChestplate().nbt().getString("HeroType") != "tmf:omni_recal") {
                    prototype.render(recal0, recalTimer, isFirstPersonArm, capture, timeout, pull(entity, "color"));

                    recalBloom.progress = 6.0;
                    recalBloom.opacity = Math.min(5*recalTimer,1) * (1-Math.min(5*recalTimer-4,1));
                    recalBloom.render();
                    if (recalTimer != 0) {
                        if (recalTimer < 0.75) {
                            recal1.render(recal0, recalTimer, isFirstPersonArm, capture, timeout, pull(entity, "color"));
                            recal2.render(recal0, recalTimer, isFirstPersonArm, capture, timeout, pull(entity, "color"));
                        }
                        if (recalTimer >= 0.2) {
                        recal3.render(recal0, recalTimer, isFirstPersonArm, capture, timeout, pull(entity, "color"));
                        recal4.render(recal0, recalTimer, isFirstPersonArm, capture, timeout, pull(entity, "color"));
                        }
                    }
                }

                if (entity.getWornChestplate().nbt().getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag').getString("WeaponType").contains("tmf:omnitrix_hack")) {
                    omnitrixPrototypeHack.render();

                    if (entity.getData('tmf:dyn/galvan_mod_timer') != 0) {
                        omnitrixPrototypeHack1.opacity = 0.5*entity.getInterpolatedData('tmf:dyn/galvan_mod_timer') - 0.1*(entity.loop(10));
                        omnitrixPrototypeHack2.opacity = 0.5*entity.getInterpolatedData('tmf:dyn/galvan_mod_timer') - 0.2*(entity.loop(10));
                        omnitrixPrototypeHack2.setScale(Math.min(2*entity.getInterpolatedData('tmf:dyn/galvan_mod_timer'),0.5)+0.5,1,1);
                        omnitrixPrototypeHack1.render();
                        omnitrixPrototypeHack2.render();
                    }
                }
            }
        }
    };
}

function omnitrix(renderer, type) {
    var model = renderer.createResource("MODEL", "tmf:omnitrix/device/omnitrix_" + (!type.startsWith("omni_r") ? type : (type.slice(-1) <= 2 ? "prototype" : "recal")) );
    model.bindAnimation("tmf:omnitrix/omnitrix_dial").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/selecting_timer') + entity.getInterpolatedData('tmf:dyn/galvan_mod_timer')); 
        data.load(1, type == "recal_hologram" ? 0 : entity.getInterpolatedData('tmf:dyn/selecting_timer2')); 
        data.load(2, entity.getData('tmf:dyn/fusioned') ? 1 : 0); 
        data.load(3, entity.getInterpolatedData("tmf:dyn/recalibrating")); 
    });
    var effect = renderer.createEffect("fiskheroes:model").setModel(model);

    return {
        model: model,
        effect: effect,
        render: (recal0, recal, isFirstPersonArm, capture, timeout, color, selTimer, loop, opacity) => {
            if (isFirstPersonArm) {
                effect.setOffset(-14, 4, 2);
                effect.setRotation(-60.0, 165.0, -55.0);
                effect.anchor.ignoreAnchor(true);	
            }
            if (!isFirstPersonArm) {
                effect.setOffset(0, 0, 0);
                effect.setRotation(0.0, 0.0, 0.0);
                effect.anchor.ignoreAnchor(false);	
                effect.anchor.set("leftArm");
            }

            var texture = type == "recal_hologram" ? null : (type == "prototype" ? "omnitrix" : (type == "recal" ? "omnitrix_recal" : null));
            var scale = 1-Math.max(Math.min(2*recal-0.5, 1),0);
            var opacity2 = 1-Math.max(Math.min(10*recal-9, 1),0);
            if (type.startsWith("omni_r")) {
                model.texture.set(null, type);
                if (type == "omni_r1") {
                    effect.opacity = Math.max(Math.min(10*recal, 1),0);
                    effect.setScale(scale, 1 , scale);
                }
                if (type == "omni_r2") {
                    effect.opacity = Math.max(Math.min(10*recal-2.5, 1),0);
                    effect.setScale(scale, 1 , scale);
                }
                if (type == "omni_r3") {
                    effect.opacity = Math.max(Math.min(10*recal-2.5, 1),0)*opacity2;
                }
                if (type == "omni_r4") {
                    effect.opacity = Math.max(Math.min(10*recal-6.5, 1),0)*opacity2;
                }
            }
            else {
                if (capture) {
                    effect.setScale(1);
                    model.texture.set(texture, "omnitrix_capture");
                }
                else if (timeout && (type != "recal" && type != "recal_hologram")) {
                    effect.setScale(1);
                    model.texture.set(texture, "omnitrix_timeout");
                }
                else if (color == 360) {
                    effect.setScale(1);
                    model.texture.set(texture, "omnitrix_white");
                }
                else if (recal0 != 0 && type == "prototype") {
                    effect.setScale(scale, 1 , scale);
                    model.texture.set(texture, "omnitrix_recalibrating");
                }
                else {
                    effect.setScale(1);
                    model.texture.set(texture, "omnitrix_lights");
                }
            }
            if (selTimer != 0 && type == "recal_hologram") {
                effect.setScale(1-0.005*Math.sin(loop*Math.PI));
                effect.opacity = opacity;
            }
            effect.render();
        }
    };
}