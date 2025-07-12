var LOADTEXTURES = {
    "null": "tmf:null",
	"ripjaws": "tmf:omnitrix/p1/aliens/ripjaws",
	"ripjaws_tailed": "tmf:omnitrix/p1/aliens/ripjaws_tailed",
	"ripjaws_head": "tmf:omnitrix/p1/aliens/ripjaws_head",
	"ripjaws_tail": "tmf:omnitrix/p1/aliens/ripjaws_tail",
	"ripjaws_lights": "tmf:omnitrix/p1/lights/ripjaws_lights",
	"ripjaws_head_lights": "tmf:omnitrix/p1/lights/ripjaws_head_lights",
	"ripjaws_tail_lights": "tmf:omnitrix/p1/lights/ripjaws_tail_lights"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var badge = createBadge(renderer, -2.6, -2.1, 0);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));

    var modeRipjawsHead = renderer.createResource("MODEL", "tmf:omnitrix/aliens/ripjaws_head");
    modeRipjawsHead.bindAnimation("tmf:omnitrix/powers/ripjaws_head").setData((entity, data) => {
        data.load(0, entity.getData("fiskheroes:beam_charging") ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0);
        data.load(1, entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
        });
        modeRipjawsHead.texture.set("ripjaws_head", "ripjaws_head_lights");
        var ripjawsHead = renderer.createEffect("fiskheroes:model").setModel(modeRipjawsHead);
        ripjawsHead.anchor.set("head");
    var modelRipjawsTail = renderer.createResource("MODEL", "tmf:omnitrix/aliens/ripjaws_tail");
        modelRipjawsTail.bindAnimation("tmf:omnitrix/aliens/ripjaws_tail").setData((entity, data) => data.load(1));
        modelRipjawsTail.texture.set("ripjaws_tail", "ripjaws_tail_lights");
        var ripjawsTail = renderer.createEffect("fiskheroes:model").setModel(modelRipjawsTail);
        ripjawsTail.anchor.set("body");

        utils.addFlightAnimationWithLanding(renderer, "ripjaws.FLIGHT", "fiskheroes:flight/iron_man.anim.json").setCondition(entity => isCurrent(entity));
        utils.addHoverAnimation(renderer, "ripjaws.HOVER", "fiskheroes:flight/idle/iron_man").setCondition(entity => isCurrent(entity));
        
        addAnimation(renderer, "ripjaws.BITE", "tmf:omnitrix/powers/ripjaws_bite").setData((entity, data) => {
            data.load(0, entity.getData("fiskheroes:beam_shooting") < 0.4 && entity.getData("fiskheroes:beam_charging") ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0);
            data.load(1, entity.getData("fiskheroes:beam_shooting") != 0 ? entity.getInterpolatedData("fiskheroes:beam_shooting_timer") : 0);
            }).setCondition(entity => isCurrent(entity));

        addAnimation(renderer, "ripjaws.THIRST", "tmf:omnitrix/powers/ripjaws_thirst_pose").setData((entity, data) => {
            data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
            }).setCondition(entity => isCurrent(entity));

            var ripjawsNight_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
                ripjawsNight_vision.factor = (entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water') ? 1 : 0;
                ripjawsNight_vision.firstPersonOnly = true;
                return isCurrent(entity);
            });

    return {
        getTexture: entity => entity.getData('tmf:dyn/pt_3') == 0 ? "ripjaws" : "ripjaws_tailed",
        getLights: entity => entity.getData('tmf:dyn/pt_3') == 0 ? "ripjaws_lights" : "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                
                ripjawsHead.render();
                    if (entity.getData('tmf:dyn/pt_3') != 0) {                
                    ripjawsTail.render();
                }
            }
        }
    };
}
