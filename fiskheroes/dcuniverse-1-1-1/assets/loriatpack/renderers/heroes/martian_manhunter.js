extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/martian_manhunter/martian_manhunter_layer1",
    "layer2": "loriatpack:justice_legaue/martian_manhunter/martian_manhunter_layer2",
    "base": "loriatpack:justice_legaue/martian_manhunter/base",
    "suit": "loriatpack:justice_legaue/martian_manhunter/suit.tx.json",
    "none": "loriatpack:justice_legaue/martian_manhunter/human",
    "human": "loriatpack:justice_legaue/martian_manhunter/john_johns",
    "snake": "loriatpack:justice_legaue/martian_manhunter/mm_snake",
    "cape": "loriatpack:justice_legaue/martian_manhunter/martian_manhunter_cape",
    "eyes": "loriatpack:justice_legaue/martian_manhunter/martian_manhunter_light"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

var overlay;
var human;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
		if (entity.getData("loriatpack:dyn/true_form")) {
            return "none";
        }
		else if (entity.getData("loriatpack:dyn/human_form")) {
            return "human";
        }
        return "base";
    });
}

function initEffects(renderer) {
	night_v = renderer.bindProperty("fiskheroes:night_vision");
    night_v.firstPersonOnly = false;
	
	utils.setOpacityWithData(renderer, 0.999, 0.999, "loriatpack:dyn/true_form");

    var model_true_head = renderer.createResource("MODEL", "loriatpack:mmshead");
    model_true_head.texture.set("snake");

    true_head = renderer.createEffect("fiskheroes:model").setModel(model_true_head);
    true_head.anchor.set("body");
	true_head.setOffset(0, 7, 3);
	true_head.setScale(0.5);   
    
    var model_true_body = renderer.createResource("MODEL", "loriatpack:mmsbody");
    model_true_body.texture.set("snake");

    true_body = renderer.createEffect("fiskheroes:model").setModel(model_true_body);
    true_body.anchor.set("body");
	true_body.setOffset(0, 7, 3);
	true_body.setScale(0.5); 

    var model_true_rightArm = renderer.createResource("MODEL", "loriatpack:mmrarm");
    model_true_rightArm.texture.set("snake");

    true_rightArm = renderer.createEffect("fiskheroes:model").setModel(model_true_rightArm);
    true_rightArm.anchor.set("rightArm");
	true_rightArm.setOffset(-5, 10, 3);
	true_rightArm.setScale(0.5);  

    var model_true_leftArm = renderer.createResource("MODEL", "loriatpack:mmlarm");
    model_true_leftArm.texture.set("snake");

    true_leftArm = renderer.createEffect("fiskheroes:model").setModel(model_true_leftArm);
    true_leftArm.anchor.set("leftArm");
	true_leftArm.setOffset(5, 10, 3);
	true_leftArm.setScale(0.5); 

    var model_true_tail = renderer.createResource("MODEL", "loriatpack:mmtail");
    model_true_tail.texture.set("snake");
    model_true_tail.bindAnimation("loriatpack:mm_walk").setData((entity,data) => data.load(entity.getData('fiskheroes:moving') && !entity.getData('fiskheroes:flight_timer') && entity.loop(10)));


    true_tail = renderer.createEffect("fiskheroes:model").setModel(model_true_tail);
    true_tail.anchor.set("body");
	true_tail.setOffset(0, 7, 3);
	true_tail.setScale(0.5); 

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");


    human = renderer.createEffect("fiskheroes:overlay");
    human.texture.set("human", null);


    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 14;
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "loriatpack:no_beam", "head", 0xffffff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [0.5, 12.0, 0.0], "size": [3.0, 3.0],}
    ]);

    var anim = renderer.createResource("ANIMATION", "loriatpack:psi_blast");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:beam_shooting")));
    renderer.addCustomAnimation("CHARGED_BEAM", anim);

    // utils.bindParticles(renderer, "loriatpack:form_change").setCondition(entity => entity.getData("loriatpack:dyn/change_form"));

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.CHARGED_BEAM");
	addAnimationWithData(renderer, "snake.WALK", "loriatpack:martian_walk", "loriatpack:dyn/true_form");
    utils.addFlightAnimation(renderer, "basic.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "basic.HOVER", "fiskheroes:flight/idle/default");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm) { 
        if (renderLayer == "CHESTPLATE" || renderLayer == "HELMET") {
            if (!entity.getData("loriatpack:dyn/human_form") && !entity.getData("loriatpack:dyn/true_form")) {
                cape.render(entity);
            }
            
             overlay.opacity = entity.getInterpolatedData("fiskheroes:heat_vision_timer");
             overlay.render();
        }

        if (entity.getData("loriatpack:dyn/human_form") && !entity.getData("loriatpack:dyn/martian_form")) {
            human.opacity = entity.getInterpolatedData("loriatpack:dyn/human_form_timer");
            human.render();
        } else {
            human.opacity = entity.getInterpolatedData("loriatpack:dyn/human_form_timer");
            human.render();
        }
        if (entity.getData("loriatpack:dyn/true_form")) {
            true_head.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_head.render();

            true_body.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_body.render();

            true_rightArm.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_rightArm.render();

            true_leftArm.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_leftArm.render();
            
            true_tail.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_tail.render();
        } else {
            true_head.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_head.render();

            true_body.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_body.render();

            true_rightArm.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_rightArm.render();

            true_leftArm.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_leftArm.render();

            true_tail.opacity = entity.getInterpolatedData("loriatpack:dyn/true_form_timer");
            true_tail.render();
        }
    }
}
