extend("fiskheroes:hero_basic");
loadTextures({
    "hair": "loriatpack:justice_legaue/wonder_woman/diana_hair",
	"suit": "loriatpack:justice_legaue/wonder_woman/diana_suit_full",
    "leggings": "loriatpack:justice_legaue/wonder_woman/diana_legs",
	"leggings2": "loriatpack:justice_legaue/wonder_woman/diana_legs",
    "boots": "loriatpack:justice_legaue/wonder_woman/diana_boots",
	"suit_hair": "loriatpack:justice_legaue/wonder_woman/diana_suit",
    "shield": "loriatpack:justice_legaue/wonder_woman/shield",
    "sword": "loriatpack:justice_legaue/wonder_woman/ww_sword",
    "lasso_poyas": "loriatpack:justice_legaue/wonder_woman/lasso_poyas",
	"lasso_arm": "loriatpack:justice_legaue/wonder_woman/lasso_arm",
	"lassoatatack": "loriatpack:justice_legaue/wonder_woman/lassoatatack"

});

var utils = implement("fiskheroes:external/utils");

var sword;
var chest;

function init(renderer) {
    parent.init(renderer);
    
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornLeggings().suitType() == $SUIT_NAME ? "suit_hair" : "suit";
        }
	    else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "leggings" : "leggings2";
		}
        return renderLayer == "HELMET" ? "hair" : "boots" 
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "leftLeg", "rightLeg");
	renderer.showModel("HELMET", "head", "headwear", "body");
  
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1.0).setYOffset(1);
	night_v = renderer.bindProperty("fiskheroes:night_vision");
    night_v.firstPersonOnly = false;
	
    parent.initEffects(renderer);
    utils.addLivery(renderer, "SHIELD", "shield");

    var model_sword = renderer.createResource("MODEL", "loriatpack:ww_sword");
    model_sword.texture.set("sword");
    sword = renderer.createEffect("fiskheroes:model").setModel(model_sword);
    sword.anchor.set("rightArm");
    sword.setScale(0.4);

    var model_lasso_arm = renderer.createResource("MODEL", "loriatpack:lasso_arm");
    model_lasso_arm.texture.set("lasso_arm");
    lasso_arm = renderer.createEffect("fiskheroes:model").setModel(model_lasso_arm);
    lasso_arm.anchor.set("rightArm");
    lasso_arm.setScale(0.8);
	
	var model_lasso_poyas = renderer.createResource("MODEL", "loriatpack:lasso_poyas");
    model_lasso_poyas.texture.set("lasso_poyas");
    lasso_poyas = renderer.createEffect("fiskheroes:model").setModel(model_lasso_poyas);
    lasso_poyas.anchor.set("body");
    lasso_poyas.setScale(0.8);
	
	
	var model_lassoatatack = renderer.createResource("MODEL", "loriatpack:lassoatatack");
    model_lassoatatack.texture.set("lassoatatack");
    lassoatatack = renderer.createEffect("fiskheroes:model").setModel(model_lassoatatack);
    lassoatatack.anchor.set("rightArm");
    lassoatatack.setScale(0.8);
	
	var chain = utils.bindCloud(renderer, "fiskheroes:telekinesis_chain", "loriatpack:lasso_chain");
    chain.anchor.set("rightArm");
    chain.setOffset(-0.5, 10.0, 0.0);
    chain.setFirstPerson(-4.75, 4.0, -8.5);
	
	var equipped = renderer.bindProperty("fiskheroes:equipped_item");
        equipped.setItems([
            { "anchor": "body", "scale": 1.0, "offset": [0.0, 5.0, 2.75], "rotation": [90.0, -180.0, 0.0] }
        ]);
        equipped.addOffset("QUIVER", -0.5, 0.0, 2.36);
    }
    
    function initAnimations(renderer) {
        parent.initAnimations(renderer);
        utils.addFlightAnimation(renderer, "shazam.FLIGHT", "fiskheroes:flight/default.anim.json");
        utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/default");
		renderer.removeCustomAnimation("basic.AIMING");
		addAnimationWithData(renderer, "laso.AIMING", "fiskheroes:aiming_fpcorr", "fiskheroes:aiming_timer");
		
        addAnimationWithData(renderer, "wg.BLOCKING", "loriatpack:blocking_wg", "fiskheroes:shield_blocking_timer");

        addAnimation(renderer, "wgirl.LASSO_EQUIP", "loriatpack:equip_lasso").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/nanite_timer")))
        .priority = -9;

        addAnimation(renderer, "wgirl.SWORD_EQUIP", "loriatpack:equip").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:blade_timer")))
        .priority = -9;

    }

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
	
	if (entity.getPunchTimer() && entity.getData("fiskheroes:dyn/nanite_timer") > 0.1 ) {
            var blade_offSet = lassoatatack.setOffset(0.0, 0.0, 0.0);
            var blade_rot = lassoatatack.setRotation(0, 180, 0);           
            lassoatatack.anchor =  blade_offSet, blade_rot;
            lassoatatack.render();
    }
    
	if (!entity.getPunchTimer() && entity.getData("fiskheroes:dyn/nanite_timer") > 0.1 ) {
            var blade_offSet = lasso_arm.setOffset(0.0, -2.0, 0.0);
            var blade_rot = lasso_arm.setRotation(0, 0, 0);           
            lasso_arm.anchor = blade_offSet, blade_rot;
			lasso_arm.render();
    }
	
	if (!entity.getData("fiskheroes:dyn/nanite_timer") > 0.1 ) {
            var blade_offSet = lasso_poyas.setOffset(4.0, 0.0, 0.0);
            var blade_rot = lasso_poyas.setRotation(0, 0, 0);           
            lasso_poyas.anchor = blade_offSet, blade_rot;
			lasso_poyas.render();
    }	
	
	
		if (entity.getData("fiskheroes:blade_timer") > 0.4) {
            var blade_anchor = sword.anchor.set("rightArm");
            var blade_offSet = sword.setOffset(0.8, 7.8, -3.9);
            var blade_rot = sword.setRotation(90, 0, 0);
            
            sword.anchor = blade_anchor, blade_offSet, blade_rot;
            sword.render();
        }
        else {
            var back_anchor = sword.anchor.set("body");
            var back_offSet = sword.setOffset(2.0, 0, 2.4);
            var back_rot = sword.setRotation(90, 70, 90);

            sword.anchor = back_anchor, back_offSet, back_rot;
            sword.render();
        
         }
         if (!isFirstPersonArm) {
            chest.render();
        }
       }
    }