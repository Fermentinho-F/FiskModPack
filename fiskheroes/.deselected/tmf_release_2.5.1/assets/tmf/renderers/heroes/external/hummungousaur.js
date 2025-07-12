var LOADTEXTURES = {
    "null": "tmf:null",
    "hummungousaur": "tmf:omnitrix/p3/aliens/hummungousaur",
    "hummungousaur_lights": "tmf:omnitrix/p3/lights/hummungousaur.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p3").setCondition(entity => isCurrent(entity));

    var modelHummungousaurFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/hummungousaur_arm");
    modelHummungousaurFp.texture.set("hummungousaur");
    modelHummungousaurFp.bindAnimation("tmf:omnitrix/aliens/hummungousaur_arm").setData((entity, data) => {
        data.load(0, (entity.getData("fiskheroes:scale")-2.2)/7.8);

    });
    var hummungousaurFp = renderer.createEffect("fiskheroes:model").setModel(modelHummungousaurFp);
    hummungousaurFp.anchor.set("rightArm");
    hummungousaurFp.setOffset(0, -12, 0);

    addAnimation(renderer, "hummungousaur.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                hummungousaurFp.setScale(1+0.1*(entity.getData("fiskheroes:scale")-2.2)/7.8);  
                hummungousaurFp.render();  
            }
            if (!isFirstPersonArm) {
                alien.render();
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omni_recal");
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_hummungousaur" : "tmf:omnitrix/aliens/hummungousaur");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/hummungousaur").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(84));
        data.load(3, (entity.getData("fiskheroes:scale")-2.2)/7.8);
        data.load(4, entity.getInterpolatedData("tmf:dyn/pt_1"));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pc_1"));
    });
    modelAlien.texture.set("hummungousaur", "hummungousaur_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(0.5);
    alien.setOffset(0,12,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, recal) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrix3", "omnitrix3_timeout");
                }
                else if ((color == 0 && !recal) || color == 360) {
                    modelAlien.texture.set("omnitrix3", "omnitrix3_white");
                }
                else {
                    modelAlien.texture.set("omnitrix3", "omnitrix3_lights");
                }
            }
            alien.render();
        }
    };
}