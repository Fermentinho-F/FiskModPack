var LOADTEXTURES = {
    "null": "tmf:null",
    "zs_skayr": "tmf:omnitrix/p2/aliens/zs_skayr.tx.json",
    "zs_skayr_lights": "tmf:omnitrix/p2/lights/zs_skayr_lights",
    "zs_skayr_claws": "tmf:omnitrix/p2/lights/zs_skayr_claws"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false, false);
    var alienClaws = alienModel(renderer, false, true);
    var badge = alienModel(renderer, true, false);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "body", 0xB432C1, [
        { "firstPerson": [0, 8, -2.0], "offset": [0.0, 6.0, -4.0], "size": [3.0, 3.0, 1.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_Lexplosion")).setCondition(entity => isCurrent(entity));

    var modelZskayrArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/zs_skayr_arm");
    modelZskayrArm.bindAnimation("tmf:omnitrix/aliens/zs_skayr_arm").setData((entity, data) => {
        data.load(0, 1 - entity.getInterpolatedData("tmf:dyn/pt_3"));
    });
    modelZskayrArm.texture.set("zs_skayr");
    var zskayrArm = renderer.createEffect("fiskheroes:model").setModel(modelZskayrArm);
    zskayrArm.anchor.set("rightArm");

    var modelZskayrArm2 = renderer.createResource("MODEL", "tmf:omnitrix/aliens/zs_skayr_arm");
    modelZskayrArm2.bindAnimation("tmf:omnitrix/aliens/zs_skayr_arm").setData((entity, data) => {
        data.load(0, 1 - entity.getInterpolatedData("tmf:dyn/pt_3"));
    });
    modelZskayrArm2.texture.set("null", "zs_skayr_claws");
    var zskayrArm2 = renderer.createEffect("fiskheroes:model").setModel(modelZskayrArm2);
    zskayrArm2.anchor.set("rightArm");

    var modelZskayrTentacles = renderer.createResource("MODEL", "tmf:omnitrix/aliens/zs_skayr_tentacles");
    modelZskayrTentacles.bindAnimation("tmf:omnitrix/aliens/zs_skayr").setData((entity, data) => {
        data.load(0, entity.isSneaking() ? 1 : 0);
        data.load(1, entity.loop(40));
        data.load(2, entity.loop(60));
        data.load(3, entity.getPunchTimerInterpolated());
        data.load(4, 1 - entity.getInterpolatedData("tmf:dyn/pt_3"));
    });
    modelZskayrTentacles.texture.set("zs_skayr", "zs_skayr_lights");
    var zskayrTentacles = renderer.createEffect("fiskheroes:model").setModel(modelZskayrTentacles);
    zskayrTentacles.anchor.ignoreAnchor(true);


    var ghostfreakNightVision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        ghostfreakNightVision.factor = 1.0;
        ghostfreakNightVision.firstPersonOnly = false;
        return isCurrent(entity);
    });

    addAnimation(renderer, "zsskayr.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
  

    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getData('fiskheroes:intangible'));
                alienClaws.render(pull(entity, "color"), pull(entity, "timeout"), entity.getData('tmf:dyn/pc_1'));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getData('fiskheroes:intangible'));
                zskayrTentacles.setOffset(0, 0, 0);
            }
            if (isFirstPersonArm) {
                zskayrArm.setScale(1+0.2*entity.getInterpolatedData('tmf:dyn/pt_3'));
                zskayrArm.opacity = entity.getData('fiskheroes:intangible') ? 0.6 : 1;
                zskayrArm.render();

                zskayrArm2.setScale(1+0.2*entity.getInterpolatedData('tmf:dyn/pt_3'));
                zskayrArm2.opacity = 0.8*entity.getData('tmf:dyn/pc_1');
                zskayrArm2.render();

                zskayrTentacles.setOffset(0, 8, 0);
            }
            if (entity.getData('tmf:dyn/pt_3') != 0) {
                zskayrTentacles.setScale(entity.getInterpolatedData('tmf:dyn/pt_3'));
                zskayrTentacles.opacity = entity.getData('fiskheroes:intangible') ? 0.6 : 1;
                zskayrTentacles.render();
            }
        }
    };
}

function alienModel(renderer, badge, claws) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_zs_skayr" : "tmf:omnitrix/aliens/zs_skayr");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/zs_skayr").setData((entity, data) => {
        data.load(0, entity.isSneaking() ? 1 : 0);
        data.load(1, entity.loop(40));
        data.load(2, entity.loop(60));
        data.load(3, entity.getPunchTimerInterpolated());
        data.load(4, 1 - entity.getInterpolatedData("tmf:dyn/pt_3"));
    });
    modelAlien.texture.set("zs_skayr", "zs_skayr_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);

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
                alien.opacity = opacity ? 0.6 : 1;
            }
            else if (claws) {
                modelAlien.texture.set(null, "zs_skayr_claws");
                alien.opacity = 0.8*opacity;
            }
            else {
                alien.opacity = opacity ? 0.6 : 1;
            }
            alien.render();
        }
    };
}
