var LOADTEXTURES = {
	"null": "tmf:null",
	"grey_matter": "tmf:omnitrix/p1/aliens/grey_matter.tx.json",
    "grey_matter_lights": "tmf:omnitrix/p1/lights/grey_matter_lights.tx.json",
    "pepsi": "tmf:omnitrix/p1/aliens/pepsi",
    "vision_head": "tmf:omnitrix/p1/aliens/vision_head",
    "vision_head_lights": "tmf:omnitrix/p1/lights/vision_head_lights",
    "grey_matter_bp_lights": "tmf:omnitrix/p1/lights/grey_matter_black_panther_lights"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {


    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
   
    var alien = alienModel(renderer, false, false);
    var alienBp = alienModel(renderer, false, true);
    var badge = alienModel(renderer, true, false);

    var modelGreyMatterArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/grey_matterArm");
    modelGreyMatterArm.texture.set("grey_matter");
    var greyMatterArm = renderer.createEffect("fiskheroes:model").setModel(modelGreyMatterArm);
    greyMatterArm.anchor.set("rightArm");

    // PEPSI ==========================
    var modelGreyMatterPepsi = renderer.createResource("MODEL", "tmf:omnitrix/weapons/pepsi_2");
    modelGreyMatterPepsi.bindAnimation("tmf:omnitrix/powers/grey_matter_pepsi").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
    });
    modelGreyMatterPepsi.texture.set("pepsi");
    var greyMatterPepsi = renderer.createEffect("fiskheroes:model").setModel(modelGreyMatterPepsi);
    greyMatterPepsi.anchor.ignoreAnchor(true);

    // VISION ==========================
    var modelGreyMatterVision = renderer.createResource("MODEL", "tmf:omnitrix/weapons/vision_head");
    modelGreyMatterVision.texture.set("vision_head");
    var greyMatterVision = renderer.createEffect("fiskheroes:model").setModel(modelGreyMatterVision);
    greyMatterVision.setOffset(0, -9, 0);
    greyMatterVision.setScale(5);
    greyMatterVision.anchor.ignoreAnchor(true);

    var modelGreyMatterVisionOverlay = renderer.createResource("MODEL", "tmf:omnitrix/weapons/vision_head");
    modelGreyMatterVisionOverlay.texture.set(null, "vision_head_lights");
    var greyMatterVisionOverlay = renderer.createEffect("fiskheroes:model").setModel(modelGreyMatterVisionOverlay);
    greyMatterVisionOverlay.setOffset(0, -9, 0);
    greyMatterVisionOverlay.setScale(5);
    greyMatterVisionOverlay.anchor.ignoreAnchor(true);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0xFFFF6D, [
        { "firstPerson": [0.0, -40.15, 0.0], "offset": [0.0, -38.15, -20.0], "size": [8.0, 4] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"
        )).setCondition(entity => isCurrent(entity));

    var shakeGreyMatterVision = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakeGreyMatterVision.factor = 0.8*entity.getInterpolatedData("fiskheroes:beam_shooting_timer") + 0.15*entity.getInterpolatedData("fiskheroes:beam_charge");
        return isCurrent(entity);
        });
    // PANTHER==========================    
    utils.bindBeam(renderer, "fiskheroes:heat_vision", null, "body", null, []).setCondition(entity => isCurrent(entity));

    var forcefieldGreyMatterBp = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldGreyMatterBp.color.set(0x6B06BB);
    forcefieldGreyMatterBp.setShape(36, 18).setOffset(0.0, 6.0, 0.0)
    forcefieldGreyMatterBp.setCondition(entity => {
        forcefieldGreyMatterBp.opacity = entity.getData("tmf:dyn/p_4") ? 1.5 * entity.getInterpolatedData("tmf:dyn/pt_4") : 0;
        forcefieldGreyMatterBp.setScale(entity.getData("tmf:dyn/p_4") ? 5 * entity.getInterpolatedData("tmf:dyn/pc_4") : null);
        return isCurrent(entity);
    });

    var modelGreyMatterArmBp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/grey_matterArm");
    modelGreyMatterArmBp.texture.set(null, "grey_matter_bp_lights");
    var greyMatterArmBp = renderer.createEffect("fiskheroes:model").setModel(modelGreyMatterArmBp);
    greyMatterArmBp.anchor.set("rightArm");
    greyMatterArmBp.setScale(1.001);

    //===================

    addAnimation(renderer, "grey_matter.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            var item = entity.getHeldItem();
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData("tmf:dyn/pt_4"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData("tmf:dyn/pt_4"));
                

                if (entity.getInterpolatedData('tmf:dyn/pt_1') >= 0.2) {
                    greyMatterPepsi.setScale(5 + 1*entity.getInterpolatedData('tmf:dyn/pt_1'));
                    greyMatterPepsi.render();
                }
                if (entity.getHeldItem().nbt().getString("WeaponType") == "tmf:vision_head") {
                    greyMatterVisionOverlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
                    greyMatterVisionOverlay.render();
                    greyMatterVision.render();
                }
                if (entity.getData('tmf:dyn/grey_matter_panther')) {
                    alienBp.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData("tmf:dyn/pt_4"));
                }
            }
            if (isFirstPersonArm) {
                greyMatterArm.render();
                if (entity.getData('tmf:dyn/grey_matter_panther')) {
                    greyMatterArmBp.opacity = entity.getInterpolatedData("tmf:dyn/pt_4");
                    greyMatterArmBp.render();
                }
            }
        }
    };
}

function alienModel(renderer, badge, bp) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_grey_matter" : "tmf:omnitrix/aliens/grey_matter");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/grey_matter").setData((entity, data) => {
        data.load(0, entity.isSneaking() ? 1 : 0);
        data.load(1, entity.loop(60));
        data.load(2, entity.getPunchTimerInterpolated());
        data.load(3, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(4, entity.getInterpolatedData('tmf:dyn/pc_1'));
        data.load(5, entity.getHeldItem().nbt().getString("WeaponType") == "tmf:vision_head" ? 1 : 0);
    });
    modelAlien.texture.set("grey_matter", "grey_matter_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(2.2);
    alien.setOffset(0,2,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, opacity) => {
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
            if (bp) {
                modelAlien.texture.set(null, "grey_matter_bp_lights");
                alien.setScale(2.201);
                alien.opacity = opacity;
            }
            alien.render();
        }
    };
}
