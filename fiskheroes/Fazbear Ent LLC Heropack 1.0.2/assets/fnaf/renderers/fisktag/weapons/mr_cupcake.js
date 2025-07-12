loadTextures({
    "base": "fnaf:cupcake",
    "lights": "fnaf:cupcake_lights",
    "lights_movie": "fnaf:cupcake_lights_movie"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "fnaf:cupcake", "base", "lights");
    renderer.setModel(model);

    model.bindAnimation("fnaf:cupcake").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            return;
        }
        data.load(0, entity.getPunchTimerInterpolated());
    });
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (entity.isWearingFullSuit() && entity.getWornHelmet().suitType() == "fnaf:chica/movie") {
        model.texture.set("base", "lights_movie");
    } else {
        model.texture.set("base", "lights");
    }
	cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.scale(1.3);
    } else if (renderType === "ENTITY") {
        cancelAnimations = true;
        glProxy.scale(1.3);
        glProxy.rotate(-90, 0, 1, 0);
        glProxy.translate(-0.15, 0.0, 0.0);
    } else if (renderType === "INVENTORY") {
        cancelAnimations = true;
        glProxy.scale(2.5);
        glProxy.rotate(-45, 0, 1, 0);
        glProxy.rotate(-30, 0, 0, 1);
        glProxy.rotate(-90, 0, 1, 0);
        glProxy.translate(-0.1, 0.2, 0.0);
    } else if (renderType === "EQUIPPED") {
        glProxy.scale(1.3);
        glProxy.translate(0.0, -0.1, 0.0);
        glProxy.rotate(-60, 1, 0, 0);
    }
}
