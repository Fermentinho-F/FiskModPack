extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "pwt:david_martinez_layer1",
	"layer2": "pwt:david_martinez_layer2",
	"colar_back": "pwt:david_martinez_colar_back",
	"colar_back_lights": "pwt:david_martinez_colar_back_lights",
	"colar_sideL": "pwt:david_martinez_colar_sideL",
	"colar_sideL_lights": "pwt:david_martinez_colar_sideL_lights",
	"colar_sideR": "pwt:david_martinez_colar_sideR",
	"colar_sideR_lights": "pwt:david_martinez_colar_sideR_lights",
	"gun": "pwt:livery/beretta_93r_martinez"
});

var utils = implement("pwt:external/utils");
var colar_back
var colar_sideL
var colar_sideR

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {	
	colar_back = renderer.createEffect("fiskheroes:shield");
    colar_back.texture.set("colar_back", "colar_back_lights");
    colar_back.anchor.set("head");
    colar_back.setCurve(-60.0, 0.0);
	colar_back.large = true;
	
	colar_sideL = renderer.createEffect("fiskheroes:shield");
	colar_sideL.texture.set("colar_sideL", "colar_sideL_lights");
    colar_sideL.anchor.set("head");
    colar_sideL.setCurve(-25.0, 0.0);
	colar_sideR = renderer.createEffect("fiskheroes:shield");
	colar_sideR.texture.set("colar_sideR" , "colar_sideR_lights");
    colar_sideR.anchor.set("head");
    colar_sideR.setCurve(25.0, 0.0);
	
	var trail = renderer.bindProperty("fiskheroes:trail");
	
	var trail_1 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_1");
	var trail_2 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_2");
	var trail_3 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_3");
	var trail_4 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_4");
	var trail_5 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_5");
	var trail_6 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_6");
	var trail_7 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_7");
	var trail_8 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_8");
	var trail_9 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_9");
	var trail_10 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_10");
	var trail_11 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_11");
	var trail_12 = renderer.createResource("TRAIL", "pwt:sandevistan_rgb/sandvistan_rgb_12");
	
	trail.setCondition(entity => {
		var ticks = entity.ticksExisted();
		var mod = 24;
		if (ticks % mod >= 0 && ticks % mod < 2) {
			trail.setTrail(trail_1);
		}
		else if (ticks % mod >= 2 && ticks % mod < 4) {
			trail.setTrail(trail_2);
		}
		else if (ticks % mod >= 4 && ticks % mod < 6) {
			trail.setTrail(trail_3);
		}
		else if (ticks % mod >= 6 && ticks % mod < 8) {
			trail.setTrail(trail_4);
		}
		else if (ticks % mod >= 8 && ticks % mod < 10) {
			trail.setTrail(trail_5);
		}
		else if (ticks % mod >= 10 && ticks % mod < 12) {
			trail.setTrail(trail_6);
		}
		else if (ticks % mod >= 12 && ticks % mod < 14) {
			trail.setTrail(trail_7);
		}
		else if (ticks % mod >= 14 && ticks % mod < 16) {
			trail.setTrail(trail_8);
		}
		else if (ticks % mod >= 16 && ticks % mod < 18) {
			trail.setTrail(trail_9);
		}
		else if (ticks % mod >= 18 && ticks % mod < 20) {
			trail.setTrail(trail_10);
		}
		else if (ticks % mod >= 20 && ticks % mod < 22) {
			trail.setTrail(trail_11);
		}
		else if (ticks % mod >= 22) {
			trail.setTrail(trail_12);
		}
		
		return entity.getData('pwt:dyn/ability');
	});
	utils.addLivery(renderer, "BERETTA_93R", "gun");
	
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	addAnimation(renderer, "sprinter.SPRINT", "fiskheroes:speedster_sprint") 
		.setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer"));
    })
	.priority = -8;
	
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}


function render(entity, renderLayer, isFirstPersonArm) {
   if (renderLayer == "CHESTPLATE" && !isFirstPersonArm) {
        colar_back.unfold = 1;
        colar_back.setOffset(0.0, -7.0, 5.25).setRotation(85.0, 0.0, 90.0);
        colar_back.render();
		
		colar_sideL.unfold = 1;
        colar_sideL.setOffset(3.98, -5.03, 4.86).setRotation(85.0, 0.0, 165.0);
        colar_sideL.render();
		colar_sideR.unfold = 1;
        colar_sideR.setOffset(-3.98, -5.03, 4.86).setRotation(85.0, 0.0, -165.0);
        colar_sideR.render();
    }
}