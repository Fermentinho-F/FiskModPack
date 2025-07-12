extend("fiskheroes:hero_basic");
loadTextures({
    "base": "loriatpack:justice_legaue/green_lantern/green_lantern_layer1",
    "suit": "loriatpack:justice_legaue/green_lantern/gl_suit.tx.json",
    "none": "loriatpack:justice_legaue/green_lantern/none",
    "chain": "loriatpack:justice_legaue/green_lantern/chain",
    "chain_brik": "loriatpack:justice_legaue/green_lantern/brick",
	"safe": "loriatpack:justice_legaue/green_lantern/safe",
	"ring": "loriatpack:justice_legaue/green_lantern/ring",
	"boxing_glove": "loriatpack:justice_legaue/green_lantern/boxing_glove",
	"gun": "loriatpack:justice_legaue/green_lantern/gun",
    "lantern": "loriatpack:justice_legaue/green_lantern/gr"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var body_lines = implement("fiskheroes:external/body_lines");
var glow;
var telekinesis;
var booster_boots;
var boosters = implement("fiskheroes:external/bloom_booster")
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand()) {
            var timer = entity.getInterpolatedData("loriatpack:dyn/ring_timer");
            return timer == 0 ? "none" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
	telekinesis=renderer.createEffect("fiskheroes:glowerlay");	
	utils.bindCloud(renderer, "fiskheroes:telekinesis", "loriatpack:lantern_telekinesis");
	
	night_v = renderer.bindProperty("fiskheroes:night_vision");
	night_v.setCondition(entity => entity.getData("loriatpack:dyn/ring_timer") > 0.4);
    night_v.firstPersonOnly = false;
	
    var model_lantern = renderer.createResource("MODEL", "loriatpack:green");
    model_lantern.texture.set("lantern");
    lantern = renderer.createEffect("fiskheroes:model").setModel(model_lantern);
    lantern.anchor.set("leftArm");
    lantern.setScale(1.05);
	
    var model_safe = renderer.createResource("MODEL", "loriatpack:safe");
    model_safe.texture.set("safe");
    safe = renderer.createEffect("fiskheroes:model").setModel(model_safe);
    safe.anchor.set("rightArm");
    safe.setScale(1.0);
	safe.setRotation(90, 0, 180);
	
	var model_ring = renderer.createResource("MODEL", "loriatpack:ring");
    model_ring.texture.set("ring");
    ring = renderer.createEffect("fiskheroes:model").setModel(model_ring);
    ring.anchor.set("rightArm");
    ring.setScale(0.15);
	ring.setRotation(180, 90, 0);
	ring.setOffset(1.5, 9.0, 0.0);
	
	var model_boxing_glove = renderer.createResource("MODEL", "loriatpack:boxing_glove");
    model_boxing_glove.texture.set("boxing_glove");
    boxing_glove = renderer.createEffect("fiskheroes:model").setModel(model_boxing_glove);
    boxing_glove.anchor.set("rightArm");
    boxing_glove.setScale(1.0);
	
	var model_gun = renderer.createResource("MODEL", "loriatpack:minigun");
    model_gun.texture.set("gun");
	model_gun.bindAnimation("loriatpack:minigun_spin").setData((entity,data) => data.load(entity.getData('fiskheroes:energy_projection') && entity.loop(7)));
    gun = renderer.createEffect("fiskheroes:model").setModel(model_gun);
    gun.anchor.set("head");
    gun.setScale(1.0);
	gun.setRotation(0, 180, 45);
	gun.setOffset(9.0, -6.0, 4.0);

	var model_gun2 = renderer.createResource("MODEL", "loriatpack:minigun");
    model_gun2.texture.set("gun");
	model_gun2.bindAnimation("loriatpack:minigun_spin").setData((entity,data) => data.load(entity.getData('fiskheroes:energy_projection') && entity.loop(7)));
    gun2 = renderer.createEffect("fiskheroes:model").setModel(model_gun);
    gun2.anchor.set("head");
    gun2.setScale(1.0);
	gun2.setRotation(0, 180, -45);
	gun2.setOffset(-11.0, -3.0, 4.0);
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:minigun", "head", 0x00F7FF, [
			{ "firstPerson": [-5.0, -3.0, 0.0], "offset": [-9.0, -3.0, -10.0], "size": [2.5, 2.5] }
	]).setCondition(entity => entity.ticksExisted() % 3 == 0 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:minigun", "head", 0x00F7FF, [
			{ "firstPerson": [-5.0, -3.0, 0.0], "offset": [-11.0, -3.0, -12.0], "size": [2.5, 2.5] }
	]).setCondition(entity => entity.ticksExisted() % 3 == 1 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:minigun", "head", 0x00F7FF, [
			{ "firstPerson": [-5.0, -3.0, 0.0], "offset": [-9.0, -3.0, -14.0], "size": [2.5, 2.5] }
	]).setCondition(entity => entity.ticksExisted() % 3 == 2 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:minigun", "head", 0x00F7FF, [
			{ "firstPerson": [5.0, -3.0, 0.0], "offset": [9.0, -3.0, -10.0], "size": [2.5, 2.5] }
	]).setCondition(entity => entity.ticksExisted() % 3 == 0 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:minigun", "head", 0x00F7FF, [
			{ "firstPerson": [5.0, -3.0, 0.0], "offset": [11.0, -3.0, -12.0], "size": [2.5, 2.5] }
	]).setCondition(entity => entity.ticksExisted() % 3 == 1 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:minigun", "head", 0x00F7FF, [
			{ "firstPerson": [5.0, -3.0, 0.0], "offset": [9.0, -3.0, -14.0], "size": [2.5, 2.5] }
	]).setCondition(entity => entity.ticksExisted() % 3 == 2 && (entity.ticksExisted() % 2 >= 0 && entity.ticksExisted() % 2 < 1));
	
	
	var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:atom_booster");
    var fire = renderer.createResource("ICON", "loriatpack:green_fire_layer_%s");
    var color = 0x00F7FF;
	booster_boots = boosters.create(renderer, "head", true, color, fire, beam).setOffset(-9.0, -3.0, -12.0).setSize(2.5, 1.5).setRotation(-90, 45, 0);
	 
    var chain_arm = utils.createModel(renderer, "loriatpack:chains", "chain");
    var chain_claw = utils.createModel(renderer, "loriatpack:lantern_brick", "chain_brik");
    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [-10.0, -11.0, 0.0], "direction": [0.0, 10.0, 0.0] },
		{ "offset": [-10.0, -11.0, 0.0], "direction": [0.0, -10.0, 0.0] },
		{ "offset": [-10.0, -11.0, 0.0], "direction": [0.0, 0.0, 0.0] }
    ]);
    tentacles.anchor.set("rightArm");
    tentacles.setSegmentModel(chain_arm);
    tentacles.setHeadModel(chain_claw);
    tentacles.segmentLength = 6.0;
    tentacles.segments = 12;

    lights_rarm = body_lines.create(renderer, "loriatpack:gl_lights", 0x00F7FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, -2.7, 0.0], "end": [0.0, 23.8, 0.0], "size": [4.0, 4.0] }
        ]}
    ]);  
    lights_lleg = body_lines.create(renderer, "loriatpack:gl_lights", 0x00F7FF, [
        { anchor: "leftLeg", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, -0.8, 0.0], "end": [0.0, 25.8, 0.0], "size": [4.0, 4.0] }
        ]}
    ]);
    lights_rleg = body_lines.create(renderer, "loriatpack:gl_lights", 0x00F7FF, [
        { anchor: "rightLeg", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, -0.8, 0.0], "end": [0.0, 25.8, 0.0], "size": [4.0, 4.0] }
        ]}
    ]);
    lights_head = body_lines.create(renderer, "loriatpack:gl_lights", 0x00F7FF, [
        { anchor: "head", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, 0.1, 0.0], "end": [0.0, -18.8, 0.0], "size": [8.0, 8.0] }
        ]}
    ]);
    lights_larm = body_lines.create(renderer, "loriatpack:gl_lights", 0x00F7FF, [
        { anchor: "leftArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, -2.7, 0.0], "end": [0.0, 23.8, 0.0], "size": [4.0, 4.0] }
        ]}
    ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "loriatpack:gl", "rightArm", 0x00F7FF, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 11.0, 0.0], "size": [3.5, 3.5] },
    ]);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "loriatpack:gl", "rightArm", 0x00F7FF, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:no_beam", "rightArm", 0x00F7FF, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    utils.addFlightAnimation(renderer, "greenl.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "greenl.HOVER", "fiskheroes:flight/idle/default");
	addAnimationWithData(renderer, "gl.CHARGE", "loriatpack:gl_charge", "loriatpack:dyn/ring_reload_timer");
    addAnimationWithData(renderer, "basic.CHARGED_BEAM", "fiskheroes:aiming", "fiskheroes:beam_shooting_timer");
    addAnimationWithData(renderer, "gl.TRANS", "loriatpack:gls", "loriatpack:dyn/ring_timer");   
    addAnimationWithData(renderer, "gl.RELOAD", "fiskheroes:aiming_left", "loriatpack:dyn/ring_reload_timer");
    addAnimation(renderer, "gl.BLOCKING", "loriatpack:gl_chains").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:shield_blocking_timer")))
    .priority = -9;  
    addAnimation(renderer, "gl.CHAINS", "loriatpack:gl_chains").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:tentacle_extend_timer")))
    .priority = -9;

}

function render(entity, renderLayer, isFirstPersonArm) {
		if (entity.getData("fiskheroes:blade_timer") > 0.4) {
            var blade_anchor = boxing_glove.anchor.set("rightArm");
            var blade_offSet = boxing_glove.setOffset(0.5, 31.0, -2.0);
            var blade_rot = boxing_glove.setRotation(180, -90, 0);
			
            boxing_glove.anchor = blade_anchor, blade_offSet, blade_rot;
            boxing_glove.render(); 
         }
		ring.render(); 
		if (renderLayer == "CHESTPLATE") {
            var boost = entity.getData("fiskheroes:energy_projection");
            booster_boots.speedScale = 0.5 * boost;
            booster_boots.flutter = 1 + boost;

            booster_boots.render(entity, entity.getData("fiskheroes:energy_projection"));
        }
		if (entity.getData("fiskheroes:energy_projection")){
			gun.render();
			gun2.render();
		}
    if (renderLayer == "CHESTPLATE") {
        var blade_anchor = lantern.anchor.set("leftArm");
        var blade_offSet = lantern.setOffset(-7.5, 2.4, 2.7);
        var blade_rot = lantern.setRotation(90, 90, 0);
        
        lantern.anchor = blade_anchor, blade_offSet, blade_rot;
        lantern.opacity = entity.getInterpolatedData("loriatpack:dyn/ring_reload_timer");
        lantern.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
		if (entity.getData("fiskheroes:shield_blocking_timer") > 0.4) {
            safe.render(); 
         }
		 
        lights_rarm.opacity = lights_rarm.progress = entity.getInterpolatedData("loriatpack:dyn/ring_timer");
        lights_rarm.progress /= Math.sqrt(entity.getData('loriatpack:dyn/ring_timer') > 0 ) * 2;
        lights_rarm.render(renderLayer);

        lights_rleg.opacity = lights_rleg.progress = entity.getInterpolatedData("loriatpack:dyn/ring_timer");
        lights_rleg.progress /= Math.sqrt(entity.getData('loriatpack:dyn/ring_timer') > 0.6 ) * 2;
        lights_rleg.render(renderLayer);

        lights_head.opacity = lights_head.progress = entity.getInterpolatedData("loriatpack:dyn/ring_timer");
        lights_head.progress /= Math.sqrt(entity.getData('loriatpack:dyn/ring_timer') > 0.6 ) * 2;
        lights_head.render(renderLayer);

        lights_lleg.opacity = lights_lleg.progress = entity.getInterpolatedData("loriatpack:dyn/ring_timer");
        lights_lleg.progress /= Math.sqrt(entity.getData('loriatpack:dyn/ring_timer') > 0.8 ) * 2;
        lights_lleg.render(renderLayer);

        lights_larm.opacity = lights_larm.progress = entity.getInterpolatedData("loriatpack:dyn/ring_timer");
        lights_larm.progress /= Math.sqrt(entity.getData('loriatpack:dyn/ring_timer') > 0.9 ) * 2;
        lights_larm.render(renderLayer);
    }
}
