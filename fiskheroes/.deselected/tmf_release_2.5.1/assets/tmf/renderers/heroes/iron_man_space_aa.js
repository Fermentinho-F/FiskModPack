extend("tmf:iron_man_mk1_aa");
loadTextures({
	"null": "tmf:null",
	"layer1": "tmf:space/iron_man_space_aa_layer1",
	"layer2": "tmf:space/iron_man_space_aa_layer2",
	"suit_lights": "tmf:space/iron_man_space_aa_lights",
	"backboosters": "tmf:space/iron_man_space_aa_back",
	"bootR": "tmf:space/iron_man_space_aa_bootR",
	"bootL": "tmf:space/iron_man_space_aa_bootL"
});
var bootR;
var bootL;
var bootsFront;
var bootsBack;
var booster;
var backboosters;
var legbooster;
var armoryT = implement("tmf:external/armory");


function initEffects(renderer) {
    armory = renderer.createEffect("fiskheroes:model");
		armory.setModel(armoryT.createModel(renderer, "tmf:other/armory", "armory"));
		armory.anchor.set("body");
		armory.setScale(1.2);
		armory.setOffset(0,-4,-1.2);
	
    var model = renderer.createResource("MODEL", "tmf:other/iron_man_space_aa_backboosters");
    model.texture.set("backboosters");
    backboosters = renderer.createEffect("fiskheroes:model").setModel(model);
    backboosters.anchor.set("body");
	
    icon = renderer.createResource("ICON", "tmf:repulsors");
	
    bootsFront = renderer.createEffect("fiskheroes:booster");
    bootsFront.setIcon(icon).setOffset(0.0, 12.0, 1.0).setSize(3.5, 1.0);
    bootsFront.anchor.set("rightLeg");
    bootsFront.mirror = true;
	
    bootsBack = renderer.createEffect("fiskheroes:booster");
    bootsBack.setIcon(icon).setOffset(0.0, 12.0, -1.0).setSize(2.5, 1.0);
    bootsBack.anchor.set("rightLeg");
    bootsBack.mirror = true;
	
    legbooster = renderer.createEffect("fiskheroes:booster");
    legbooster.setIcon(icon).setOffset(0.0, 9.0, 2.0).setRotation(20.0, 0.0, 0.0).setSize(1.5, 0.5);
    legbooster.anchor.set("rightLeg");
    legbooster.mirror = true;
	
    booster = renderer.createEffect("fiskheroes:booster");
    booster.setIcon(icon).setOffset(0.0, 2.0, 0.0).setSize(2.75, 0.75);
    booster.anchor.set("body", model.getCubeOffset("boosterR2", "boosterL2"));
    booster.mirror = true;
	
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x9FA4C2);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0x66DCFF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]);
		
    var bootRmodel = renderer.createResource("MODEL", "tmf:other/iron_man_space_aa_boots");
		bootRmodel.bindAnimation("tmf:other/space_armor_leg_flaps").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:flight_boost_timer")));
		bootRmodel.texture.set("bootR");
	bootR = renderer.createEffect("fiskheroes:model").setModel(bootRmodel);
		bootR.anchor.set("rightLeg");
		
    var bootLmodel = renderer.createResource("MODEL", "tmf:other/iron_man_space_aa_boots");
		bootLmodel.bindAnimation("tmf:other/space_armor_leg_flaps").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:flight_boost_timer")));
		bootLmodel.texture.set("bootL");
    bootL = renderer.createEffect("fiskheroes:model").setModel(bootLmodel);
		bootL.anchor.set("leftLeg");
		
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(bootR, bootL, backboosters);

}

function render(entity, renderLayer, isFirstPersonArm) {
	if (entity.isDisplayStand() && entity.world().getBlock(entity.pos().add(0, -1, 0)) == "fiskheroes:titanium_block") {		
		armory.render();
	}

    bootR.render();
    bootL.render();
	
    if (!isFirstPersonArm && entity.isWearingFullSuit()) {
        var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        bootsFront.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        bootsFront.speedScale = 0.5 * boost;
        bootsFront.flutter = 1 + boost;
		
        bootsBack.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
        bootsBack.speedScale = 0.5 * boost;
        bootsBack.flutter = 1 + boost;

        var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
        f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
        bootsFront.setSize(2.5 + f * 4, 3.0 - f * 3.9);
        bootsFront.render();
		
        bootsBack.setSize(2.5 + f * 4, 3.0 - f * 3.9);
        bootsBack.render();
		
		booster.progress = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        booster.speedScale = 0.3 * boost;
		booster.render();
		
		legbooster.progress = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        legbooster.speedScale = 0.5 * boost;
		legbooster.render();
    }
	
	if (renderLayer == "CHESTPLATE") {
		backboosters.render();
	}
	
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	
    addAnimation(renderer, "iron_man.FLIGHT", "tmf:other/controlled_flight_space")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer") * (1 - entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer")));
            data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        })
        .priority = -10;
}