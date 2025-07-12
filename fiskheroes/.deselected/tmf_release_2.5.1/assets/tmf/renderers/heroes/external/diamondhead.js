var LOADTEXTURES = {
	"null": "tmf:null",
	"diamondhead": "tmf:omnitrix/p1/aliens/diamondhead.tx.json",
    "diamondhead_lights": "tmf:omnitrix/p1/lights/diamondhead_lights",
    "diamondhead_accessories": "tmf:omnitrix/p1/aliens/diamondhead_accessories.tx.json",
    "diamondhead_shards": "tmf:omnitrix/p1/aliens/diamondhead_shards",
    "diamondhead_blade": "tmf:omnitrix/p1/aliens/diamondhead_blade",
    "diamondhead_shield": "tmf:omnitrix/p1/aliens/diamondhead_shield.tx.json",
    "diamondhead_wave": "tmf:omnitrix/p1/aliens/diamondhead_wave"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var badge = createBadge(renderer, -2.25, -2, 0);
        
    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

    var modelDiamondheadHead = renderer.createResource("MODEL", "tmf:omnitrix/aliens/diamondhead_head");
        modelDiamondheadHead.texture.set("diamondhead_accessories");
        var diamondheadHead = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadHead);
        diamondheadHead.anchor.set("head");	
    var modelDiamondheadBody = renderer.createResource("MODEL", "tmf:omnitrix/aliens/diamondhead_body");
        modelDiamondheadBody.texture.set("diamondhead_accessories");
        var diamondheadBody = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadBody);
        diamondheadBody.anchor.set("body");	
    var modelDiamondheadArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/diamondhead_arm");
        modelDiamondheadArm.texture.set("diamondhead_accessories");
        modelDiamondheadArm.generateMirror();
        var diamondheadArm = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadArm);
        diamondheadArm.anchor.set("rightArm");	
        diamondheadArm.setScale(1.05);
        diamondheadArm.mirror = true;	

        addAnimation(renderer, "diamondhead.BASE", "tmf:omnitrix/aliens/diamondhead").setData((entity, data) => {
            data.load(0, 1);
            }).setCondition(entity => isCurrent(entity));

        utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "rightArm", 0xF3985B, [
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_diamondhead")).setCondition(entity => isCurrent(entity) && !entity.getData('tmf:dyn/p_1'));
        utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "body", 0xF3985B, [
        ]).setCondition(entity => isCurrent(entity) && entity.getData('tmf:dyn/p_1'));
    
        var modelDiamondheadShards = renderer.createResource("MODEL", "tmf:omnitrix/powers/diamondhead_shards");
        modelDiamondheadShards.bindAnimation("tmf:omnitrix/powers/diamondhead_shards").setData((entity, data) => {
            data.load((entity.getInterpolatedData('fiskheroes:cryo_charge') - (entity.getInterpolatedData('fiskheroes:shield_timer') * entity.getInterpolatedData('fiskheroes:cryo_charge'))));
        });
        modelDiamondheadShards.texture.set("diamondhead_shards");
        var diamondheadShards = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadShards);
        diamondheadShards.anchor.set("rightArm");	

        var modelDiamondheadBlade = renderer.createResource("MODEL", "tmf:omnitrix/powers/diamondhead_blade");
        modelDiamondheadBlade.bindAnimation("tmf:omnitrix/powers/diamondhead_blade").setData((entity, data) => {
            data.load(entity.getInterpolatedData('tmf:dyn/pt_1') - entity.getData('fiskheroes:shield_damage')/100);
        });
        modelDiamondheadBlade.generateMirror();
        modelDiamondheadBlade.texture.set("diamondhead_blade");
        var diamondheadBlade = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadBlade);
        diamondheadBlade.anchor.set("rightArm");
        diamondheadBlade.mirror = true;	

        var modelDiamondheadShield = renderer.createResource("MODEL", "tmf:omnitrix/powers/diamondhead_shield");
        modelDiamondheadShield.texture.set("diamondhead_shield");
        modelDiamondheadShield.generateMirror();
        var diamondheadShield = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadShield);
        diamondheadShield.anchor.set("rightArm");
        diamondheadShield.mirror = true;	
        diamondheadShield.setOffset(0.3,0,0);

        var modelDiamondheadWave = renderer.createResource("MODEL", "tmf:omnitrix/powers/diamondhead_wave");
        modelDiamondheadWave.texture.set("diamondhead_wave");
        var diamondheadWave = renderer.createEffect("fiskheroes:model").setModel(modelDiamondheadWave);
        diamondheadWave.anchor.ignoreAnchor(true);	
        diamondheadWave.setRotationOrder("ZYX");

        addAnimation(renderer, "diamondhead.AIMING", "fiskheroes:aiming").setData((entity, data) => {
            data.load(entity.getInterpolatedData('fiskheroes:beam_charge'))
        }).setCondition(entity => isCurrent(entity) && !entity.getData('tmf:dyn/p_1'));

        addAnimation(renderer, "diamondhead.SHIELD", "tmf:omnitrix/powers/diamondhead_shielding").setData((entity, data) => {
            data.load((entity.getInterpolatedData('tmf:dyn/pc_1') + entity.getInterpolatedData('tmf:dyn/pt_1')) * entity.getInterpolatedData('fiskheroes:shield_blocking_timer'))
        }).setCondition(entity => isCurrent(entity));

        addAnimation(renderer, "diamondhead.PUNCH", "tmf:omnitrix/powers/punch_double").setData((entity, data) => {
            data.load(entity.getInterpolatedData('tmf:dyn/pt_1') * (1-entity.getInterpolatedData('fiskheroes:shield_blocking_timer')))
        }).setCondition(entity => isCurrent(entity) && entity.isPunching() && entity.getData('tmf:dyn/pt_1') && !entity.getData('fiskheroes:shield_blocking_timer'));
    

        addAnimation(renderer, "diamondhead.WAVE", "tmf:omnitrix/powers/diamondhead_wave_player").setData((entity, data) => {
            data.load(0, wrapAngleTo180(entity.rotBodyYawInterpolated()));
            data.load(1, entity.getInterpolatedData("tmf:dyn/pc_2"));
            data.load(2, entity.getInterpolatedData("tmf:dyn/pc_3"));
        }).setCondition(entity => isCurrent(entity));

        var shakeDiamondhead = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
            shakeDiamondhead.factor = 0.3 * entity.getInterpolatedData("tmf:dyn/pc_2");
            return isCurrent(entity);
            });
    
    return {
        getTexture: entity => "diamondhead",
        getLights: entity => ("diamondhead_lights"),
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                diamondheadHead.render();
                diamondheadBody.render();
                diamondheadArm.render();

                if (entity.getData('tmf:dyn/pc_2') != 0) {
                    diamondheadWave.setOffset(0, 32*(1-Math.min(7*entity.getInterpolatedData('tmf:dyn/pc_2'), 1)), 0);
                    diamondheadWave.setScale(Math.min(10*entity.getInterpolatedData('tmf:dyn/pc_2'), 1));
                    diamondheadWave.render();
                }

            }
                if (entity.getData('tmf:dyn/pt_1') != 0) {
                    diamondheadBlade.render();
                }
                if (entity.getData('tmf:dyn/pc_1') != 0) {
                    diamondheadShield.setScale(0.8+0.2*entity.getInterpolatedData('tmf:dyn/pc_1') - entity.getData('fiskheroes:shield_damage')/280, 1, 0.9+0.1*entity.getInterpolatedData('tmf:dyn/pc_1') - entity.getData('fiskheroes:shield_damage')/280);
                    diamondheadShield.render();
                }

                if (entity.getData('fiskheroes:cryo_charge') != 0) {
                    diamondheadShards.render();
                }
        }
    };
}

function wrapAngleTo180(value) {
    value %= 360;
    if (value >= 180) {
        value -= 360;
    }
    if (value < -180) {
        value += 360;
    }
    return value;
}