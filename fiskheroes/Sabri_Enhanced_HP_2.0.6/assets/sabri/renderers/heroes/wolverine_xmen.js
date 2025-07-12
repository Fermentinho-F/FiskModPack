extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:wolverine_xmen_layer1",
    "layer2": "sabri:wolverine_xmen_layer2",
    "claws": "sabri:wolverine_xmen_claws"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "sabri:wolverine_claws");
    model.texture.set("claws");
    claws = renderer.createEffect("fiskheroes:model").setModel(model);
    claws.anchor.set("rightArm");
    claws.setRotation(0, 270, 180);

    claws2 = renderer.createEffect("fiskheroes:model").setModel(model);
    claws2.anchor.set("leftArm");
    claws2.setRotation(0, 90, 180);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "sabri:null", "body", 0xFFFFFF, []);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

    addAnimation(renderer, "wolverine.PUNCH", "sabri:dual_punch")
        .setData((entity, data) => {
            data.load(entity.isPunching() ? entity.getInterpolatedData("fiskheroes:blade_timer") : 0);
	}).priority = -8;

    addAnimationWithData(renderer, "wolverine.SPRINT", "fiskheroes:speedster_sprint", "sabri:dyn/sprint_timer").priority = -1;
		
	addAnimation(renderer, "wolverine.LEAP", "sabri:wolverine_xmen_leap") 
		.setData((entity, data) => {
		data.load(0, entity.getInterpolatedData("sabri:dyn/leap_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:energy_projection_timer"));
    }).priority = 0;

    addAnimation(renderer, "wolverine.ROLL", "sabri:ground_roll") 
		.setData((entity, data) => {
		data.load(entity.getData("sabri:dyn/roll") ? entity.getInterpolatedData("sabri:dyn/roll_timer") : 0);
    }).priority = 0;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:blade_timer")) {
        claws.setOffset(2, 26 + 6.5 * entity.getInterpolatedData("fiskheroes:blade_timer"), 0);
        claws.render();

        claws2.setOffset(-2, 26 + 6.5 * entity.getInterpolatedData("fiskheroes:blade_timer"), 0);
        claws2.render();
    }
}
