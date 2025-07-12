var LOADTEXTURES = {
	"null": "tmf:null",
	"heatblast": "tmf:omnitrix/p1/aliens/heatblast",
	"heatblast_lights": "tmf:omnitrix/p1/lights/heatblast_lights",
    "heatblast_blue_lights": "tmf:omnitrix/p1/lights/heatblast_sick_lights",
	"flight_rock": "tmf:omnitrix/p1/lights/heatblast_flight_rock",
    "fire_tornado": "tmf:omnitrix/p1/lights/fire_tornado",
	"firebomb": "tmf:omnitrix/p1/lights/heatblast_firebomb"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {

    var heatblastOverlay = renderer.createEffect("fiskheroes:overlay");
    heatblastOverlay.texture.set("null", "heatblast_lights");
    var heatblastBlueOverlay = renderer.createEffect("fiskheroes:overlay");
    heatblastBlueOverlay.texture.set("null", "heatblast_blue_lights");

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
   
    
    addAnimationWithData(renderer, "heatblast.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
        .setCondition(entity => isCurrent(entity) && !entity.getHeldItem().doesNeedTwoHands() && !entity.getHeldItem().isRifle())
        .priority = 10;

    var fire = renderer.createResource("ICON", "tmf:heatblast_fire_layer_%s");
    var blue_fire = renderer.createResource("ICON", "tmf:heatblast_blue_fire_layer_%s");
    var head_flames = createHead(renderer, fire);
    var booster_flames = createBoosters(renderer, fire);
    var blue_head_flames = createHead(renderer, blue_fire);
    var meteorChargeFlames = createBoosterMeteorCharge(renderer, fire);

    var badge = createBadge(renderer, 0, 1.2, 0);

        utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "rightArm", 0xF3985B, [
        ]).setCondition(entity => entity.getData('tmf:dyn/pc_1') != 0 && isCurrent(entity));

        utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "rightArm", 0xF3985B, [
            { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0, -3.0] }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData('tmf:dyn/pc_1') == 0 && isCurrent(entity));

        utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:cold_beam", "rightArm", 0x6FE4FE, [
            { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0, -2.0] }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_cold_breath")).setCondition(entity => isCurrent(entity));


        var modelFireTornado = renderer.createResource("MODEL", "tmf:omnitrix/powers/fire_tornado");
        modelFireTornado.bindAnimation("tmf:omnitrix/powers/fire_tornado").setData((entity, data) => {
            data.load(0, entity.loop(46));
            });
            modelFireTornado.texture.set("null", "fire_tornado");
        var fireTornado = renderer.createEffect("fiskheroes:model").setModel(modelFireTornado);
        fireTornado.anchor.ignoreAnchor(true);	

    var modelFireBomb = renderer.createResource("MODEL", "tmf:omnitrix/powers/firebomb");
        modelFireBomb.bindAnimation("tmf:omnitrix/powers/firebomb").setData((entity, data) => data.load(entity.loop(75)));
        modelFireBomb.texture.set("null", "firebomb");
        var firebomb = renderer.createEffect("fiskheroes:model").setModel(modelFireBomb);
        firebomb.anchor.ignoreAnchor(true);	

    var modelFlightRock = renderer.createResource("MODEL", "tmf:omnitrix/powers/flight_rock");
        modelFlightRock.bindAnimation("tmf:omnitrix/powers/flight_rock").setData((entity, data) => {
            data.load(0, entity.loop(75));
            data.load(1, entity.getInterpolatedData("tmf:dyn/pt_1"));
            });
        modelFlightRock.texture.set("null", "flight_rock");
        var flightRock = renderer.createEffect("fiskheroes:model").setModel(modelFlightRock);
        flightRock.anchor.set("body");	

    var shakeHeatblast = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakeHeatblast.factor = 0.2 * entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        return isCurrent(entity);
        });
    var explosionShake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        explosionShake.factor = 5 * tanh(entity.getInterpolatedData("tmf:dyn/pc_1"), 90, -80);
        return isCurrent(entity);
        });

        addAnimation(renderer, "heatblast.meteor.charge", "tmf:omnitrix/powers/diamondhead_wave_player").setData((entity, data) => {
            data.load(0, 0);
            data.load(1, Math.max(entity.getInterpolatedData("tmf:dyn/heatblast_meteor_timer") - entity.getInterpolatedData("fiskheroes:flight_timer"), 0));
            data.load(2, 0);
        }).setCondition(entity => isCurrent(entity));

    utils.addFlightAnimation(renderer, "heatblast.FLIGHT", "tmf:omnitrix/powers/flight/heatblast_rock").setCondition(entity => isCurrent(entity) && entity.getData('tmf:dyn/p_2'));
    utils.addFlightAnimation(renderer, "heatblast.FLIGHT2", "fiskheroes:flight/propelled_hands.anim.json").setCondition(entity => isCurrent(entity) && !entity.getData('tmf:dyn/p_2'));
    utils.addHoverAnimation(renderer, "heatblast.HOVER", "fiskheroes:flight/idle/propelled_hands").setCondition(entity => isCurrent(entity));
    addAnimationWithData(renderer, "heatblast.ROLL", "tmf:omnitrix/powers/flight/heatblast_rock_roll", "fiskheroes:barrel_roll_timer").setCondition(entity => isCurrent(entity) && entity.getData('tmf:dyn/p_2'));
    addAnimationWithData(renderer, "heatblast.ROLL2", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer").setCondition(entity => isCurrent(entity) && !entity.getData('tmf:dyn/p_2'));
        
    addAnimation(renderer, "heatblast.FIREBOMB", "tmf:omnitrix/powers/heatjaws_explosion_pose").setData((entity, data) => {
        data.load(0, Math.max(Math.min(2*entity.getInterpolatedData("tmf:dyn/pc_1"), 1), 0));
        data.load(1, Math.min(Math.max(4*entity.getInterpolatedData("tmf:dyn/pc_1")-2.5, 0), 1));
        }).setCondition(entity => isCurrent(entity) && entity.getData("tmf:dyn/p_5"));

    addAnimationWithData(renderer, "heatblast.LANDING", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .setCondition(entity => isCurrent(entity)).priority = -8;

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
        getTexture: entity => "heatblast",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            var fb = entity.getInterpolatedData("tmf:dyn/pc_1");

            if (isFirstPersonArm) {
                fireTornado.opacity = 0.5*entity.getInterpolatedData("tmf:dyn/heatblast_tornado_timer");
            }
            if (!isFirstPersonArm) {
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                
                head_flames.render(Math.max(1-entity.getInterpolatedData('tmf:dyn/pt_3') - entity.getInterpolatedData('tmf:dyn/pc_5'), 0));
                blue_head_flames.render(entity.getInterpolatedData('tmf:dyn/pc_5'));
                if (entity.getData('fiskheroes:flying') && entity.getData('tmf:dyn/p_2')) {
                    flightRock.setScale(Math.max(entity.getInterpolatedData('fiskheroes:flight_timer'), 0.5));
                    flightRock.render();
                    booster_flames.render(entity.getInterpolatedData("tmf:dyn/pt_1"));
                }
                fireTornado.opacity = entity.getInterpolatedData("tmf:dyn/heatblast_tornado_timer") - 0.5*entity.getInterpolatedData("fiskheroes:teleport_timer");
                meteorChargeFlames.render(Math.max(entity.getInterpolatedData("tmf:dyn/heatblast_meteor_timer") - entity.getInterpolatedData("fiskheroes:flight_timer"), 0));
            var beamCharge = Math.max(Math.min(2*fb-0.5, 1), 0) - Math.max(Math.min(4*fb-4, 1), 0);   
                if (entity.getData("tmf:dyn/p_5")) {
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
            }
            if (entity.getData("tmf:dyn/p_5")) {
            aura_arms.opacity = beamCharge;
            aura_arms.render();
            aura_arms2.opacity = beamCharge;
            aura_arms2.render();
            }
            heatblastOverlay.opacity = Math.max(1-entity.getInterpolatedData('tmf:dyn/pt_3') - entity.getInterpolatedData('tmf:dyn/pc_5'), 0);
            heatblastOverlay.render();
            heatblastBlueOverlay.opacity = entity.getInterpolatedData('tmf:dyn/pc_5');
            heatblastBlueOverlay.render();
            if (fb >= 0.15 && entity.getData("tmf:dyn/p_5")) {
                firebomb.setScale(0.85* Math.max(Math.min(2*fb-0.5, 1), 0) + 0.15*Math.sin(Math.PI*entity.loop(100)) + 5*Math.max(Math.min(3*fb-2, 1), 0));
                firebomb.opacity = 0.8* Math.max(Math.min(2*fb-0.5, 1), 0) - 0.8*Math.max(Math.min(3*fb-2, 1), 0);
                firebomb.setOffset(0, -2 + 120*Math.max(Math.min(3*fb-2, 1), 0), 0);
                firebomb.render();
            }
            fireTornado.setScale(1+0.2*Math.sin(Math.PI*(entity.loop(44))), 0.4*Math.sin(Math.PI*(entity.loop(28))) + Math.max(entity.getInterpolatedData("tmf:dyn/heatblast_tornado_timer") - 0.6*entity.getInterpolatedData("fiskheroes:teleport_timer"), 0), 1+0.2*Math.sin(Math.PI*(entity.loop(36))));
            fireTornado.render();
        }
    };
}

function tanh(data, x, y) {
	return 0.5 * ((Math.pow(Math.E, x*data + y) - Math.pow(Math.E, -(x*data + y))) / (Math.pow(Math.E, x*data + y) + Math.pow(Math.E, -(x*data + y)))) + 0.5;
}

function createBoosterMeteorCharge(renderer, icon) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var meteor = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    meteor.setOffset(0.0, 28.0, 0.0).setRotation(0.0, 0.0, 180.0).setSize(24.0, 1.0);
    meteor.anchor.ignoreAnchor(true);

    meteor.flutter = 0.25;
    return {
        meteor: meteor,
        render: timer => {
            meteor.progress = timer;
            meteor.opacity = 0.8*timer;
            meteor.render();
        }
    };
}

function createHead(renderer, icon) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var base = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    base.setOffset(0.0, 1.0, 0.0).setRotation(-5.0, 0.0, 180.0);
    base.anchor.set("head");

    var top = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    top.setOffset(0.0, -5.0, 0.0).setRotation(-1.0, 0.0, 180.0).setSize(7.5, 1.25);
    top.anchor.set("head");

    base.flutter = top.flutter = 0.25;
    base.speedScale = top.speedScale = 0;
    return {
        base: base,
        top: top,
        render: timer => {
            base.progress = top.progress = timer;
            base.setSize(8 + 2 * timer, 1.75);
            base.opacity = 0.2*timer;
            top.opacity = 0.8*timer;
            base.render();
            top.render();
        }
    };
}

function createBoosters(renderer, icon) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var base = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    base.anchor.set("body");
    var base2 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    base2.anchor.set("body");

    base.opacity = 0.9;
    base2.opacity = 0.45;
    base.flutter = base2.flutter = 0.25;
    base.speedScale = base2.speedScale = 1;
    return {
        base: base,
        base2: base2,
        render: timer => {
            base.progress = 1;
            base.setSize(11, 2.25);
            base.setOffset(timer*8, 27.0, -timer*8+8.0);
            base.setRotation(-93.0, 0, -timer*90+180.0);
            base.render();

            base2.progress = 1;
            base2.setSize(16, 2.2);
            base2.setOffset(-timer*8, 27.0,  -12 + timer*12);
            base2.setRotation(-93.0, 0, -timer*90+180.0);
            base2.render();
        }
    };
}
