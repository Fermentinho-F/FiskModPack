extend("fiskheroes:hero_basic");
loadTextures({
    "base2": "loriatpack:justice_legaue/shazam/shazam_hood",
	"base": "loriatpack:justice_legaue/shazam/shazam",
    "suit": "loriatpack:justice_legaue/shazam/shazam_suit.tx.json",
    "billy": "loriatpack:justice_legaue/shazam/billy",
    "cape": "loriatpack:justice_legaue/shazam/shazam_cape.tx.json",
	"lights_no_helmet": "loriatpack:justice_legaue/shazam/shazam_hood_lights",
	"lights": "loriatpack:justice_legaue/shazam/shazam_lights"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var thunder;
var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "base2";
        }
        else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "billy" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
	renderer.setLights((entity, renderLayer) => {
        if (entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && !entity.getData("fiskheroes:mask_open") || entity.is("DISPLAY")) {
            return renderLayer == "LEGGINGS" ? "lights" : "lights";
        }
		else if (entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") && entity.getData("fiskheroes:mask_open")) {
            return renderLayer == "LEGGINGS" ? "lights_no_helmet" : "lights_no_helmet";
        }
        return renderLayer == "CHESTPLATE" ? null : null;
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
	night_v = renderer.bindProperty("fiskheroes:night_vision");
	night_v.setCondition(entity => entity.getData("fiskheroes:dyn/nanite_timer") > 0.4);
    night_v.firstPersonOnly = false;
	
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    cape = capes.createDefault(renderer, 28, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;


    var trail2 = renderer.bindProperty("fiskheroes:trail");
    trail2.setTrail(renderer.createResource("TRAIL", "loriatpack:shazam1"));
    trail2.setCondition(entity => entity.getData("fiskheroes:dyn/nanite_timer") < 1 && entity.getData("fiskheroes:dyn/nanite_timer") > 0);

    var trail3 = renderer.bindProperty("fiskheroes:trail");
    trail3.setTrail(renderer.createResource("TRAIL", "loriatpack:shazam2"));
    trail3.setCondition(entity => entity.getData("fiskheroes:dyn/nanite_timer") > 0 && entity.getData("fiskheroes:dyn/nanite_timer") < 1);
    
    var trail4 = renderer.bindProperty("fiskheroes:trail");
    trail4.setTrail(renderer.createResource("TRAIL", "loriatpack:shazam3"));
    trail4.setCondition(entity => entity.getData("fiskheroes:dyn/nanite_timer") > 0 && entity.getData("fiskheroes:dyn/nanite_timer") < 1);

    utils.bindTrail(renderer, "fiskheroes:shazam");
    
	utils.bindBeam(renderer, "fiskheroes:lightning_cast", "loriatpack:electro_beam", "rightArm", 0x41acbf, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
		
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "loriatpack:electro_beam", "body", 0x41acbf, [
    { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0],"anchor": "rightArm" },
	{ "firstPerson": [4.5, 3.75, -8.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
	]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    

	var shazamt = renderer.createResource("BEAM_RENDERER", "loriatpack:shazamt");

	thunder = utils.createLines(renderer, shazamt, 0xD9FFFF, [
        {"start": [0, 0.5, 0], "end": [0.0, 0.7, 0.0], "size": [20.0, 20.0]},
    ]);
    thunder.anchor.set("body");
    thunder.setOffset(1.0, 10.0, 0.0).setRotation(180.0, 0.0, 10.0).setScale(20.0, 150.0, 20.0);
    thunder.mirror = false;
		
	utils.bindTrail(renderer, "loriatpack:shazam_lightning").setCondition(entity => entity.getData("fiskheroes:dyn/nanite_timer") > 0);
    
	utils.bindParticles(renderer, "loriatpack:thunder_smoke").setCondition(entity => entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") > 0 && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "shazam.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/default");
    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "fiskheroes:dual_aiming", "fiskheroes:energy_projection_timer");
	addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("loriatpack:dyn/mask_open_timer");
            data.load(f < 1 ? f : 0);
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
        thunder.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") > 0 && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1
        thunder.render() 
		
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" || renderLayer == "HELMET") {
        if (entity.getInterpolatedData("fiskheroes:dyn/nanites") || entity.isDisplayStand()) {
            cape.render(entity);
        }
    }
}
