var LOADTEXTURES = {
	"null": "tmf:null",
	"heatjaws": "tmf:omnitrix/p1/aliens/heatjaws",
	"heatjaws_lights": "tmf:omnitrix/p1/lights/heatjaws_lights",
	"flight_rock": "tmf:omnitrix/p1/lights/heatblast_flight_rock",
	"explosion_heatjaws": "tmf:omnitrix/p1/lights/explosion_heatjaws",
    "heatjaws_head": "tmf:omnitrix/p1/aliens/heatjaws_head",
	"heatjaws_head_lights": "tmf:omnitrix/p1/lights/heatjaws_head_lights",
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var badge = createBadge(renderer, -2.6, -2.1, 0);

    addAnimationWithData(renderer, "heatjaws.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
    .setCondition(entity => isCurrent(entity) && !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
    .priority = 10;

    var modeRipjawsHead = renderer.createResource("MODEL", "tmf:omnitrix/aliens/ripjaws_head");
        modeRipjawsHead.texture.set("heatjaws_head", "heatjaws_head_lights");
        var ripjawsHead = renderer.createEffect("fiskheroes:model").setModel(modeRipjawsHead);
        ripjawsHead.anchor.set("head");

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
   
        utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
        ]).setCondition(entity => entity.getData('tmf:dyn/pc_2') != 0 && isCurrent(entity));

        utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "rightArm", 0xF3985B, [
            { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0] }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => isCurrent(entity));


    var modelFireBombHeatjaws = renderer.createResource("MODEL", "tmf:omnitrix/powers/explosion_heatjaws");
        modelFireBombHeatjaws.bindAnimation("tmf:omnitrix/powers/explosion_heatjaws").setData((entity, data) => data.load(entity.loop(75)));
        modelFireBombHeatjaws.texture.set("null", "explosion_heatjaws");
        var firebombHeatjaws = renderer.createEffect("fiskheroes:model").setModel(modelFireBombHeatjaws);
        firebombHeatjaws.anchor.ignoreAnchor(true);	

    var explosionShake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        explosionShake.factor = 5 * tanh(entity.getInterpolatedData("tmf:dyn/pc_2"), 90, -80);
        return isCurrent(entity);
        });

        addAnimation(renderer, "heatjaws.FIREBOMB", "tmf:omnitrix/powers/heatjaws_explosion_pose").setData((entity, data) => {
            data.load(0, entity.getData('fiskheroes:beam_charging') ?  entity.getInterpolatedData('fiskheroes:beam_charge') : entity.getInterpolatedData("tmf:dyn/pc_2"));
            data.load(1, entity.getInterpolatedData("tmf:dyn/pc_2"));
            }).setCondition(entity => isCurrent(entity));

        addAnimation(renderer, "heatjaws.THIRST", "tmf:omnitrix/powers/ripjaws_thirst_pose").setData((entity, data) => {
            data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
            }).setCondition(entity => isCurrent(entity));

    //Overlay
    var aura_head = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [8.0, 8.0]}
    ]);
    aura_head.anchor.set("head");
    aura_head.setOffset(0.0, 1.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 10.0, 16.0);
    aura_head.mirror = false;

    var aura_head2 = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [8.0, 8.0]}
    ]);
    aura_head2.anchor.set("head");
    aura_head2.setOffset(0.0, -4.0, 5.0).setRotation(90, 0, 0.0).setScale(16.0, 10.0, 16.0);
    aura_head2.mirror = false;

    var aura_body = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [4.0, 8.0]}
    ]);
    aura_body.anchor.set("body");
    aura_body.setOffset(0.0, 12.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
    aura_body.mirror = false;

    var aura_arms = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [4.0, 4.0]}
    ]);
    aura_arms.anchor.set("rightArm");
    aura_arms.setOffset(1.0, 10.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
    aura_arms.mirror = true;

    var aura_arms2 = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [12.0, 4.0]}
    ]);
    aura_arms2.anchor.set("rightArm");
    aura_arms2.setOffset(1.0, 4.0, 2.0).setRotation(90, 0, 0.0).setScale(16.0, 4.0, 16.0);
    aura_arms2.mirror = true;

    var aura_legs = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [4.0, 4.0]}
    ]);
    aura_legs.anchor.set("rightLeg");
    aura_legs.setOffset(0.0, 12.0, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
    aura_legs.mirror = true;

    var aura_legs2 = utils.createLines(renderer, "tmf:aura", 0xF3985B, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -1.0, 0.0], "size": [12.0, 4.0]}
    ]);
    aura_legs2.anchor.set("rightLeg");
    aura_legs2.setOffset(0.0, 6.0, 2.0).setRotation(90, 0, 0.0).setScale(16.0, 4.0, 16.0);
    aura_legs2.mirror = true;

    return {
        getTexture: entity => "heatjaws",
        getLights: entity => ("heatjaws_lights"),
        render: (entity, isFirstPersonArm) => {
            var beamCharge = (entity.getData('fiskheroes:beam_charging') ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0);
            if (!isFirstPersonArm) {
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                
                ripjawsHead.render();

                aura_head.opacity = beamCharge;
                aura_head.render();
                aura_head2.opacity = beamCharge;
                aura_head2.render();
                
                aura_body.opacity = beamCharge;
                aura_body.render();

                aura_legs.opacity = beamCharge;
                aura_legs.render();
                aura_legs2.opacity = beamCharge;
                aura_legs2.render();
            }
            aura_arms.opacity = beamCharge;
            aura_arms.render();
            aura_arms2.opacity = beamCharge;
            aura_arms2.render();

            var blast = entity.getInterpolatedData("tmf:dyn/pc_2");
            if (blast != 0 && entity.getData('fiskheroes:beam_shooting_timer') != 0) {
                firebombHeatjaws.setScale(5*blast);
                firebombHeatjaws.opacity = (tanh(blast, -25, 22));
                firebombHeatjaws.setOffset(0, -40*blast, 0);
                firebombHeatjaws.render();
            }
        }
    };
}

function tanh(data, x, y) {
	return 0.5 * ((Math.pow(Math.E, x*data + y) - Math.pow(Math.E, -(x*data + y))) / (Math.pow(Math.E, x*data + y) + Math.pow(Math.E, -(x*data + y)))) + 0.5;
}