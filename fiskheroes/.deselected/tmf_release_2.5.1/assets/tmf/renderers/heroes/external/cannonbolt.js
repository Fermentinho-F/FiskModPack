var LOADTEXTURES = {
	"null": "tmf:null",
	"cannonbolt": "tmf:omnitrix/p2/aliens/cannonbolt.tx.json",
	"cannonbolt_lights": "tmf:omnitrix/p2/lights/cannonbolt_lights_base",
    "tornado": "tmf:omnitrix/p2/aliens/tornado",
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "cannonbolt.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    var model_CannonboltFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/cannonbolt_arm");
    model_CannonboltFp.texture.set("cannonbolt", "cannonbolt_lights");
    var cannonboltFp = renderer.createEffect("fiskheroes:model").setModel(model_CannonboltFp);
    cannonboltFp.anchor.set("rightArm");

    var modelTornado = renderer.createResource("MODEL", "tmf:omnitrix/powers/tornado");
    modelTornado.bindAnimation("tmf:omnitrix/powers/tornado").setData((entity, data) => {
        data.load(0, entity.loop(42));
        data.load(1, entity.loop(30));
    });
    modelTornado.texture.set("tornado");
    var tornado = renderer.createEffect("fiskheroes:model").setModel(modelTornado);
    tornado.anchor.ignoreAnchor(true);

    var ballShake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        ballShake.factor = entity.getData("tmf:dyn/pt_1") == 1 ? 0.5*((entity.getData("fiskheroes:cryo_charging") ? entity.getData("tmf:dyn/pt_3") : 0) + Math.sqrt(Math.pow(entity.motionInterpolated().x(),2) + Math.pow(entity.motionInterpolated().z(), 2))) : 0;
        return isCurrent(entity);
        });
    var ballShake2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        ballShake2.factor = entity.getInterpolatedData('fiskheroes:beam_charge');
        return isCurrent(entity);
        });

    
    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                cannonboltFp.setOffset(16*entity.getInterpolatedData('tmf:dyn/pt_1'), 0, 0);	
                cannonboltFp.render();
            }
            if (!isFirstPersonArm) {	
                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'));
            }
            if (entity.getData('fiskheroes:beam_charge') != 0) {
                tornado.opacity = 0.9*entity.getInterpolatedData('fiskheroes:beam_charge');
                tornado.setScale(2*entity.getInterpolatedData('fiskheroes:beam_charge'));	
                tornado.setOffset(0, -8*entity.getInterpolatedData('fiskheroes:beam_charge'), 0);	
                tornado.render();
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_cannonbolt" : "tmf:omnitrix/aliens/cannonbolt");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/cannonbolt").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(3, entity.loop(88));
        data.load(4, entity.getInterpolatedData('tmf:dyn/pc_1'));
        data.load(5, entity.getInterpolatedData('fiskheroes:shield_blocking_timer'));
        data.load(6, entity.getData('fiskheroes:beam_charging') ? entity.loop(14) : 0);
        data.load(7, entity.getInterpolatedData('fiskheroes:beam_charge'));
    });
    modelAlien.texture.set("cannonbolt", "cannonbolt_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);	
    alien.setOffset(0,2,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, timer) => {
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
            alien.setOffset(0, -8*timer, 0);	
            alien.setScale(timer + 1);	
            alien.render();
        }
    };
}