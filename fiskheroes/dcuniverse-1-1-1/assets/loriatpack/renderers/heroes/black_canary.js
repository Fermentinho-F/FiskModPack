extend("fiskheroes:hero_basic");
loadTextures({
    "hair": "loriatpack:justice_legaue/black_canary/canary_hair",
	"suit": "loriatpack:justice_legaue/black_canary/canary_suit_full",
    "leggings": "loriatpack:justice_legaue/black_canary/canary_net",
	"leggings_full": "loriatpack:justice_legaue/black_canary/canary_net_full",
    "boots": "loriatpack:justice_legaue/black_canary/canary_boots",
	"suit_hair": "loriatpack:justice_legaue/black_canary/canary_suit"

});

var utils = implement("fiskheroes:external/utils");
var chest;

function init(renderer) {
    parent.init(renderer);
    
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE") {
            return entity.getWornLeggings().suitType() == $SUIT_NAME ? "suit_hair" : "suit";
        }
	    else if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "leggings" : "leggings_full";
		}
        return renderLayer == "HELMET" ? "hair" : "boots" 
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "leftLeg", "rightLeg");
	renderer.showModel("HELMET", "head", "headwear", "body");
  
}

function initEffects(renderer) {
	chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "loriatpack:shout_effect", "head", 0xffffff, [
        { "firstPerson": [0.0, 4.0, -6.0], "offset": [0.0, 4.0, -6.0], "size": [0.5, 0.5] }
    ])
	
	 utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:no_beam", "head", 0xffffff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [0.5, 12.0, 0.0], "size": [3.0, 3.0],}
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
         if (!isFirstPersonArm) {
            chest.render();
        }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
	addAnimation(renderer, "sonic.VORTEX", "loriatpack:canary_scream").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:sonic_waves") && !entity.getData("fiskheroes:moving")));
	addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "loriatpack:canary_scream", "fiskheroes:beam_shooting");
}