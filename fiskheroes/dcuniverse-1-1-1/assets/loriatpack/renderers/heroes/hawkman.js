extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/hawk_people/hawkman_layer_1",
    "layer2": "loriatpack:justice_legaue/hawk_people/hawkman_layer_2",
	"wing_hawk": "loriatpack:justice_legaue/hawk_people/hawkman_wings",
	"axe": "loriatpack:justice_legaue/hawk_people/axe",
	"helmet": "loriatpack:justice_legaue/hawk_people/hawkman_ears",
	"shield": "loriatpack:justice_legaue/hawk_people/hawkman_shield"
});

var utils = implement("fiskheroes:external/utils");
var thunder;
var helmet;
var helmet2;
var shield;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("loriatpack:dyn/mask_open_timer") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}


function initEffects(renderer) {
	shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield");
    shield.anchor.set("leftArm");
    shield.setCurve(-25.0, -35.0);
	
	var model_wings = renderer.createResource("MODEL", "loriatpack:angel_wings");
	model_wings.bindAnimation("loriatpack:flop_2wing").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:flight_timer') > 0.5 && entity.loop(20)));
	model_wings.bindAnimation("loriatpack:not_fly2").setData((entity,data) => data.load(!entity.getData('fiskheroes:flying') ));
    model_wings.texture.set("wing_hawk");
    wings = renderer.createEffect("fiskheroes:model").setModel(model_wings);
    wings.anchor.set("body");
	wings.setOffset(0.0, -5.0, 2.5);
    wings.setScale(1);
	
	var model_axe = renderer.createResource("MODEL", "loriatpack:axe");
    model_axe.texture.set("axe");
    axe = renderer.createEffect("fiskheroes:model").setModel(model_axe);
    axe.anchor.set("rightArm");
    axe.setScale(0.8);
	
	helmet = renderer.createEffect("fiskheroes:model");
    helmet.setModel(utils.createModel(renderer, "loriatpack:hawkman_ears", "helmet"));
    helmet.anchor.set("head");
	helmet.setScale(1.0);
	helmet.setOffset(-2.0, -5.0, -6.0);
	
	helmet2 = renderer.createEffect("fiskheroes:model");
    helmet2.setModel(utils.createModel(renderer, "loriatpack:hawkman_ears", "helmet"));
    helmet2.anchor.set("head");
	helmet2.setScale(1.0);
	helmet2.setOffset(-2.0, -5.0, -2.0);
	helmet2.setRotation(0, -75, 0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "left.BLOCKING", "loriatpack:block_leftarm", "fiskheroes:shield_blocking_timer");
	addAnimation(renderer, "aqualad.HAMMER_EQUIP", "loriatpack:equip_brass").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:blade_timer")))
        .priority = 100;	
	addAnimation(renderer, "hawkman.EQUIP", "loriatpack:weapon_in_hand").setData((entity, data) => data.load(entity.getData("fiskheroes:blade")))
        .priority = 100;	
	utils.addFlightAnimation(renderer, "wings.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json");
    
	utils.addHoverAnimation(renderer, "wings.HOVER", "fiskheroes:flight/idle/propelled_hands");
	
	utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
	
	addAnimationWithData(renderer, "wings.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
	addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("loriatpack:dyn/mask_open_timer");
            data.load(f < 1 ? f : 0);
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
	if (renderLayer == "HELMET") {
         if (!entity.getData("loriatpack:dyn/mask_open_timer") > 0){
		 helmet.render();
		helmet2.render();
		}
    }
	if (renderLayer == "CHESTPLATE") {
        shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
        shield.setOffset(-2.9 - 1.35 * Math.min(shield.unfold * 5, 1), 5.0, 0.0);
        shield.render();
		
		if (entity.getData("fiskheroes:blade_timer") > 0.5) {
            var blade_anchor = axe.anchor.set("rightArm");
            var blade_offSet = axe.setOffset(1.0, 9.5, -4.0);
            var blade_rot = axe.setRotation(0, -90, -90);        			
            axe.anchor = blade_anchor, blade_offSet, blade_rot;
            axe.render();
        }
	}
	if (renderLayer == "CHESTPLATE") {	
		if (entity.getData("fiskheroes:flight_timer") > 0.5) {
            var floping_offSet = wings.setOffset(0.0, -5.0, 2.5);
			var floping_Scale = wings.setScale(1.0);
            wings.render();
        }
		 else{
            var nofloping_offSet = wings.setOffset(0.0, -2.0, 2.5);
			var nofloping_Scale = wings.setScale(0.7);
            wings.render();			
		}  
    }
	
}

 