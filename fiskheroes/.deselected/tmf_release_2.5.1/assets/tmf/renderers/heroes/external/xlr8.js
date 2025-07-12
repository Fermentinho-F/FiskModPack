var LOADTEXTURES = {
	"null": "tmf:null",
	"xlr8": "tmf:omnitrix/p1/aliens/xlr8",
	"xlr8_lights": "tmf:omnitrix/p1/lights/xlr8_lights_base",
	"xlr8_trail": "tmf:omnitrix/p1/aliens/xlr8_trail"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

        var modelXLR8Arm = renderer.createResource("MODEL", "tmf:omnitrix/powers/xlr8_rArm");
        modelXLR8Arm.bindAnimation("tmf:omnitrix/aliens/xlr8").setData((entity, data) => {
            data.load(0, entity.loop(40));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, 0);
            data.load(3, 0);
            data.load(4, entity.getInterpolatedData('tmf:dyn/pt_1'));
            data.load(5, entity.loop(100));
            data.load(6, entity.getInterpolatedData('fiskheroes:mask_open_timer2'));
            data.load(7, !entity.getInterpolatedData('tmf:dyn/p_1') && entity.getData('fiskheroes:shooting_timer') ? entity.loop(3) : 0);
            });
            modelXLR8Arm.texture.set("xlr8", "xlr8_lights");
            var xlr8Arm = renderer.createEffect("fiskheroes:model").setModel(modelXLR8Arm);
        xlr8Arm.setOffset(0, 7, 7);
        xlr8Arm.setRotation(-90, 0, 0);
        xlr8Arm.anchor.ignoreAnchor(true);	

        var modelXLR8Trail = renderer.createResource("MODEL", "tmf:omnitrix/powers/xlr8_trail");
        modelXLR8Trail.texture.set("xlr8_trail");
        var xlr8_trail = renderer.createEffect("fiskheroes:model").setModel(modelXLR8Trail);
        xlr8_trail.anchor.ignoreAnchor(true);	
        xlr8_trail.opacity = 0.6;	

        var modelXLR8Punches = renderer.createResource("MODEL", "tmf:omnitrix/powers/xlr8_punches");
        modelXLR8Punches.bindAnimation("tmf:omnitrix/powers/xlr8_punches").setData((entity, data) => {
            data.load(0, !entity.getInterpolatedData('tmf:dyn/p_1') && entity.getData('fiskheroes:shooting_timer') ? entity.loop(3) : 0);
            });
        modelXLR8Punches.texture.set("xlr8", "xlr8_lights");
        var xlr8Punches = renderer.createEffect("fiskheroes:model").setModel(modelXLR8Punches);
        xlr8Punches.anchor.ignoreAnchor(true);	
        xlr8Punches.opacity = 0.7;	


        utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "rightArm", 0xF3985B, [
        ]).setCondition(entity =>  isCurrent(entity));

        var speedShake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
            var speed = entity.getData("fiskheroes:speed");
            speedShake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? ((Math.log(speed - 1) + 1) * 0.8 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"))) : 0;
            return isCurrent(entity);
            });
            speedShake.intensity = 0.3;


    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                
                if (Math.sqrt(Math.pow(entity.motionX(),2) + Math.pow(entity.motionZ(), 2)) > 1) {
                    xlr8_trail.setScale(0, 1, 1 + 0.4*Math.sqrt(Math.pow(entity.motionInterpolated().x(),2) + Math.pow(entity.motionInterpolated().z(), 2)));
                    xlr8_trail.setOffset(0, 0, 0.4*Math.sqrt(Math.pow(entity.motionInterpolated().x(),2) + Math.pow(entity.motionInterpolated().z(), 2)));
                    xlr8_trail.render();
                }
            }
            if (!entity.getInterpolatedData('tmf:dyn/p_1') && entity.getData('fiskheroes:shooting_timer')) {
                xlr8Punches.render();
            }
            if (isFirstPersonArm) {
                xlr8Arm.render();
            }
        }
    };
}


function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_xlr8" : "tmf:omnitrix/aliens/xlr8");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/xlr8").setData((entity, data) => {
        data.load(0, entity.loop(40));
        data.load(1, entity.getPunchTimerInterpolated());
        data.load(2, entity.getInterpolatedData('tmf:dyn/pc_1'));
        data.load(3, entity.isSneaking() ? 1 : 0);
        data.load(4, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(5, entity.loop(100));
        data.load(6, entity.getInterpolatedData('fiskheroes:mask_open_timer2'));
        data.load(7, !entity.getInterpolatedData('tmf:dyn/p_1') && entity.getData('fiskheroes:shooting_timer') ? entity.loop(3) : 0);
        });
        modelAlien.texture.set("xlr8", "xlr8_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);	
    alien.setScale(1.2);
    alien.setOffset(0,-2,0);

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