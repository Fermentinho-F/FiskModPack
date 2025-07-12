extend("fiskheroes:hero_basic");
loadTextures({
	"null": "pwt:null",
    "model": "pwt:ghost_bed_sheets"
});

var utils = implement("pwt:external/utils");
var capes = implement("fiskheroes:external/capes");


var cancelAnimations = false;
function init(renderer) {
    parent.init(renderer);
	renderer.setTexture((entity, renderLayer) => {
        return "null";
    });
	renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}

function initEffects(renderer) {
	parent.initEffects(renderer);
	var ghost_model = renderer.createResource("MODEL", "pwt:ghost_bed_sheets");
		ghost_model.bindAnimation("pwt:ghost_bed_sheets").setData((entity, data) => {
			if (cancelAnimations) {
				data.load(0, entity.loop(50));
				data.load(1, entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
				data.load(2, entity.getPunchTimerInterpolated());
				data.load(4, 0);
				data.load(5, 1);
				return;
			}
			data.load(0, entity.loop(50));
			data.load(1, entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
			data.load(2, entity.getPunchTimerInterpolated());
			data.load(4, 1);
			data.load(5, 0);
		})
		.priority = -1;
		ghost_model.texture.set(null, "model");
		ghost = renderer.createEffect("fiskheroes:model").setModel(ghost_model);
		ghost.anchor.set("body");
		
	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 0.9999 ;
    });

}


function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimation(renderer, "ghost.ANIM", "pwt:ghost_bed_sheets")
        .setData((entity, data) => {
            data.load(0, entity.loop(50));
			data.load(1, entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
			data.load(2, entity.getPunchTimerInterpolated());
			data.load(4, 1);
			data.load(5, 0);
        })
        .priority = 1;
}


function render(entity, renderLayer, isFirstPersonArm) {
	cancelAnimations = isFirstPersonArm;
	
	if (isFirstPersonArm) {
		ghost.setOffset(0, 3, 3);
	}
	else {
		ghost.setOffset(0, 0, 0);
	}
	ghost.opacity = 0.65 - 0.65*entity.getInterpolatedData("pwt:dyn/power_timer");
	ghost.anchor.ignoreAnchor(isFirstPersonArm);
	ghost.render();
}