extend("fiskheroes:hero_basic");
loadTextures({
    "hair": "loriatpack:justice_legaue/hawk_people/hawkgirl_hair",
	"suit": "loriatpack:justice_legaue/hawk_people/hawkgirl_suit_full",
    "leggings": "loriatpack:justice_legaue/hawk_people/hawkgirl_legs",
	"leggings2": "loriatpack:justice_legaue/hawk_people/hawkgirl_layer2",
    "boots": "loriatpack:justice_legaue/hawk_people/hawkgirl_boots",
	"suit_hair": "loriatpack:justice_legaue/hawk_people/hawkgirl_suit",
	"wing_hawk": "loriatpack:justice_legaue/hawk_people/hawkgirl_wings",
	"mace": "loriatpack:justice_legaue/hawk_people/mace",
	"helmet": "loriatpack:justice_legaue/hawk_people/hawkgirl_ears"
});

var utils = implement("fiskheroes:external/utils");
var thunder;
var chest;
var helmet;
var helmet2;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
		if (renderLayer == "CHESTPLATE") {
            return entity.getWornLeggings().suitType() == $SUIT_NAME ? "suit_hair" : "suit";
        }
	    else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "leggings" : "leggings";
		}
        else if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("loriatpack:dyn/mask_open_timer") > 0.35)) {
            return "leggings2";
        }
        return renderLayer == "HELMET" ? "hair" : "boots" 
    });
	renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "leftLeg", "rightLeg");
	renderer.showModel("HELMET", "head", "headwear", "body");
}

function initEffects(renderer) {
	chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);
	
	helmet = renderer.createEffect("fiskheroes:model");
    helmet.setModel(utils.createModel(renderer, "loriatpack:hawkman_ears", "helmet"));
    helmet.anchor.set("head");
	helmet.setScale(1.0);
	helmet.setOffset(-2.0, -5.0, -8.0);
	
	helmet2 = renderer.createEffect("fiskheroes:model");
    helmet2.setModel(utils.createModel(renderer, "loriatpack:hawkman_ears", "helmet"));
    helmet2.anchor.set("head");
	helmet2.setScale(1.0);
	helmet2.setOffset(-2.0, -5.0, -2.0);
	helmet2.setRotation(0, -75, 0);
	
	var model_wings = renderer.createResource("MODEL", "loriatpack:angel_wings");
	model_wings.bindAnimation("loriatpack:flop_2wing").setData((entity,data) => data.load(entity.getInterpolatedData('fiskheroes:flight_timer') > 0.5 && entity.loop(20)));
	model_wings.bindAnimation("loriatpack:not_fly2").setData((entity,data) => data.load(!entity.getData('fiskheroes:flying') ));
    model_wings.texture.set("wing_hawk");
    wings = renderer.createEffect("fiskheroes:model").setModel(model_wings);
    wings.anchor.set("body");
	wings.setOffset(0.0, -5.0, 2.5);
    wings.setScale(1);
	
	var model_mace = renderer.createResource("MODEL", "loriatpack:mace");
    model_mace.texture.set("mace");
    mace = renderer.createEffect("fiskheroes:model").setModel(model_mace);
    mace.anchor.set("rightArm");
    mace.setScale(1.0);
	
	utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xa8d8ff, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
	
	thunder = utils.createLines(renderer, "loriatpack:electro_knuckles", 0xa8d8ff, [
        {"start": [0, 0.5, 0], "end": [0.0, 1.0, 0.0], "size": [10.0, 3.0]},
    ]);
    thunder.anchor.set("rightArm");
    thunder.setOffset(0, 4.25, -11).setRotation(0.0, 0.0, 0.0).setScale(8.0, 6.0, 8.0);
	
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimation(renderer, "aqualad.HAMMER_EQUIP", "loriatpack:equip_brass").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:blade_timer")))
        .priority = 100;	
	addAnimation(renderer, "hawkgri.EQUIP", "loriatpack:weapon_in_hand").setData((entity, data) => data.load(entity.getData("fiskheroes:blade")))
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
	thunder.progress = (entity.getData('fiskheroes:energy_charge') );
	thunder.render()
	
	chest.render();
	if (renderLayer == "CHESTPLATE") {
        
		if (entity.getData("fiskheroes:blade_timer") > 0) {
            var blade_anchor = mace.anchor.set("rightArm");
            var blade_offSet = mace.setOffset(0.0, -4.0, -5.0);
            var blade_rot = mace.setRotation(0, 0, 0);        			
            mace.anchor = blade_anchor, blade_offSet, blade_rot;
            mace.render();
        }
		else{
		    var back_anchor = mace.anchor.set("body");
            var back_offSet = mace.setOffset(5.0, 25.0, -6.0);
            var back_rot = mace.setRotation(140, 0, 0);
			mace.anchor = back_anchor, back_offSet, back_rot;
            mace.render();			
		}  
	}
	if (renderLayer == "CHESTPLATE") {	
		if (entity.getData("fiskheroes:flight_timer") > 0) {
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

 