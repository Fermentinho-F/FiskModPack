var LOADTEXTURES = {
    "null": "tmf:null",
    "eyeguy": "tmf:omnitrix/p2/aliens/eyeguy",
    "eyeguy_lights": "tmf:omnitrix/p2/lights/eyeguy.tx.json",
    "web_small": "tmf:omnitrix/p1/aliens/stinkfly_web_small",
    "web_large": "tmf:omnitrix/p1/aliens/stinkfly_web_large"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));
    
    var model_Eyeguy = renderer.createResource("MODEL", "tmf:omnitrix/aliens/eyeguy");
    model_Eyeguy.texture.set("eyeguy", "eyeguy_lights");
    model_Eyeguy.bindAnimation("tmf:omnitrix/aliens/eyeguy").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(48));
        var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
        data.load(3, f > 0 ? Math.min((1 - f) * 3, 1) : 0);
        data.load(4, entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pt_1"));
        data.load(6, entity.getInterpolatedData("tmf:dyn/pc_1"));
        data.load(7, entity.getInterpolatedData("tmf:dyn/pc_3"));
    });
    var eyeguy = renderer.createEffect("fiskheroes:model").setModel(model_Eyeguy);
    eyeguy.anchor.ignoreAnchor(true);
    eyeguy.setOffset(0, 4, 0);
    eyeguy.setScale(0.85);

    var model_EyeguyArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/eyeguy_arm");
    model_EyeguyArm.texture.set("eyeguy", "eyeguy_lights");
    model_EyeguyArm.bindAnimation("tmf:omnitrix/aliens/eyeguy_eyes").setData((entity, data) => {
        data.load(0, entity.getData("tmf:dyn/p_1") ? 0 : entity.loop(800));
    });
    var eyeguyArm = renderer.createEffect("fiskheroes:model").setModel(model_EyeguyArm);
    eyeguyArm.anchor.set("rightArm");
    
    var model_EyeguyEye = renderer.createResource("MODEL", "tmf:omnitrix/aliens/eyeguyEye");
    model_EyeguyEye.texture.set("eyeguy", "eyeguy_lights");
    model_EyeguyEye.bindAnimation("tmf:omnitrix/aliens/eyeguy_eye").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("tmf:dyn/pc_3"));
    });
    var eyeguyEye = renderer.createEffect("fiskheroes:model").setModel(model_EyeguyEye);
    eyeguyEye.anchor.ignoreAnchor(true);
    eyeguyEye.setOffset(0, 4, 8);

    addAnimation(renderer, "eyeguy.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
    }).setCondition(entity => isCurrent(entity));
  


    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "body", 0x60B42A, [
    ]).setCondition(entity => isCurrent(entity));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "body", 0x60B42A, [
    ]).setCondition(entity => isCurrent(entity) && entity.getData("tmf:dyn/pt_1") != 1);
    var eyeguyBeam = utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "body", 0x60B42A, [
        { "firstPerson": [-9, 6, -8.0], "offset": [-8.0, 3.0, -12.0], "size": [2.5, 2.5, -2.5] },
        { "firstPerson": [9, 6, -8.0], "offset": [8.0, 3.0, -12.0], "size": [2.5, 2.5, -2.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/pt_1") == 1) {
            if (entity.getWornChestplate().nbt().getInteger('Color') != 0) {
                eyeguyBeam.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            }
            else {
                eyeguyBeam.color.set(0x60B42A);
            }
            return true;
        }
        return false;
    });
    var eyeguyBlast = utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "tmf:upgrade_beam", "body", 0x60B42A, [
        { "firstPerson": [0, 8, -4.0], "offset": [0, 8, -4.0], "size": [4.5, 6.5] }
    ]).setCondition(entity =>  {
        if (isCurrent(entity)) {
            if (entity.getWornChestplate().nbt().getInteger('Color') != 0) {
                eyeguyBlast.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            }
            else {
                eyeguyBlast.color.set(0x60B42A);
            }
            return true;
        }
        return false;
    });
    var eyeguyLightning = utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:lightning_cast", "body", 0x60B42A, [
        { "firstPerson": [0, 6, -10.0], "offset": [0.0, 4.0, -8.0], "size": [1.5, 1.5, 1.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/pt_1") == 0 && entity.getData("tmf:dyn/pc_3") == 1) {
            if (entity.getWornChestplate().nbt().getInteger('Color') != 0) {
                eyeguyLightning.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            }
            else {
                eyeguyLightning.color.set(0x60B42A);
            }
            return true;
        }
        return false;
    });

    var eyeguyLightning2 = utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:lightning_cast", "body", 0x60B42A, [
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/pt_1") == 0 && entity.getData("tmf:dyn/pc_3") != 1) {
            if (entity.getWornChestplate().nbt().getInteger('Color') != 0) {
                eyeguyLightning2.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            }
            else {
                eyeguyLightning2.color.set(0x60B42A);
            }
            return true;
        }
        return false;
    });


    var eyeguyLines = renderer.createResource("BEAM_RENDERER", "tmf:frankenstrike_lightning");
    var eyeguyLines1 = utils.createLines(renderer, eyeguyLines, 0x60B42A, [
        {"start": [-2, 4.5, 1], "end": [-300, 140.5, 110], "size": [3.0, 3.0]},
        {"start": [-2, 12.5, 0], "end": [-300, 222.5, 500], "size": [2.0, 2.0]},
        {"start": [-2, 6.5, -2], "end": [-32, 162.5, -300], "size": [2.0, 2.0]}
    ]);
    eyeguyLines1.anchor.set("body", model_Eyeguy.getCubeOffset("rightArm"));
    var eyeguyLines2 = utils.createLines(renderer, eyeguyLines, 0x60B42A, [
        {"start": [2, 7.5, -1], "end": [300, 172.5, -125], "size": [2.0, 2.0]},
        {"start": [2, 12.5, 0], "end": [300, 322.5, 152], "size": [1.0, 1.0]},
        {"start": [0, 1.5, -2], "end": [221, 121.5, -300], "size": [2.5, 2.5]}
    ]);
    eyeguyLines2.anchor.set("body", model_Eyeguy.getCubeOffset("leftArm"));
    var eyeguyLines3 = utils.createLines(renderer, eyeguyLines, 0x60B42A, [
        {"start": [1, 5.5, 2], "end": [121, 215.5, 300], "size": [2.0, 2.0]},
        {"start": [-1, 3.5, 2], "end": [-208, 113.5, 300], "size": [1.0, 1.0]},
        {"start": [-4.5, 2.5, 2], "end": [-124.5, 112.5, 300], "size": [3.0, 3.0]},
        {"start": [-3, 6, 2], "end": [-123, 222, 300], "size": [1.5, 1.5]}
    ]);
    eyeguyLines3.anchor.set("body");

    var forcefieldEyeguy = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldEyeguy.color.set(0x60B42A);
    forcefieldEyeguy.setShape(20, 10).setOffset(0.0, -6.0, 0.0).setScale(0.5);
    forcefieldEyeguy.setCondition(entity => {
        if (isCurrent(entity)) {
            return true;
        }
        return false;
    });

    return {
        getTexture: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                forcefieldEyeguy.opacity = 0;
            }
            if (isFirstPersonArm) {
                eyeguyArm.render();
                if (entity.getData("tmf:dyn/pc_3") != 0) {
                    eyeguyEye.setScale(2*entity.getInterpolatedData("tmf:dyn/pc_3"));          
                    eyeguyEye.render();    
                }

                forcefieldEyeguy.opacity = 0.5+0.2*Math.sin(Math.PI*entity.loop(20));
            }


            if (entity.getWornChestplate().nbt().getInteger('Color') != 0) {
                eyeguyLines1.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
                eyeguyLines2.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
                eyeguyLines3.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            }
            else {
                eyeguyLines1.color.set(0x60B42A);
                eyeguyLines2.color.set(0x60B42A);
                eyeguyLines3.color.set(0x60B42A);
            }

            eyeguyLines1.progress = entity.getInterpolatedData("tmf:dyn/pc_1");
            eyeguyLines1.render();

            eyeguyLines2.progress = entity.getInterpolatedData("tmf:dyn/pc_1");
            eyeguyLines2.render();

            eyeguyLines3.progress = entity.getInterpolatedData("tmf:dyn/pc_1");
            eyeguyLines3.render();
        }
    };
}
function alienModel(renderer, badge) {        
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_eyeguy" : "tmf:omnitrix/aliens/eyeguy");
    modelAlien.texture.set("eyeguy", "eyeguy_lights");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/eyeguy").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(48));
        var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
        data.load(3, f > 0 ? Math.min((1 - f) * 3, 1) : 0);
        data.load(4, entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pt_1"));
        data.load(6, entity.getInterpolatedData("tmf:dyn/pc_1"));
        data.load(7, entity.getInterpolatedData("tmf:dyn/pc_3"));
    });
    modelAlien.bindAnimation("tmf:omnitrix/aliens/eyeguy_eyes").setData((entity, data) => {
        data.load(0, entity.getData("tmf:dyn/p_1") ? 0 : entity.loop(800));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setOffset(0, 4, 0);
    alien.setScale(0.85);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrix", "omnitrix_timeout");
                }
                else if (color == 0 || color == 360) {
                    modelAlien.texture.set("omnitrix", "omnitrix_white");
                }
                else {
                    modelAlien.texture.set("omnitrix", "omnitrix_lights");
                }
            }
            alien.render();
        }
    };
}