loadTextures({
    "base": "fnaf:flying_v_guitar",
    "base_movie": "fnaf:movie_guitar"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "fnaf:guitar", "base");
    renderer.setModel(model);

    utils.addPlayerAnimation(renderer, "fnaf:guitar_hold").setData((entity, data) => data.load(1)).priority = -1;
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (entity.isWearingFullSuit() && entity.getWornHelmet().suitType() == "fnaf:bonnie/movie") {
        model.texture.set("base_movie");
    } else {
        model.texture.set("base");
    }
	cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.scale(1.5);
        glProxy.translate(-0.05, 0.25, 0.0);
        glProxy.rotate(75, 0, 1, 0);
        glProxy.rotate(50, 0, 0, 1);
    } else if (renderType === "ENTITY") {
        glProxy.scale(1.5);
        glProxy.rotate(90, 1, 0, 0);
        glProxy.rotate(180, 0, 1, 0);
        glProxy.translate(0.0, 0.0, 0.0);
    } else if (renderType === "INVENTORY") {
        glProxy.scale(0.9);
        glProxy.rotate(-45, 0, 1, 0);
        glProxy.rotate(-30, 0, 0, 1);
        glProxy.rotate(180, 0, 1, 0);
        glProxy.rotate(90, 0, 1, 0);
        glProxy.translate(-0.55, -0.05, 0.0);
        glProxy.rotate(45, 0, 0, 1);
    } else if (renderType === "EQUIPPED") {
        glProxy.scale(1.5);
        glProxy.rotate(80, 0, 1, 0);
        glProxy.rotate(10, 0, 0, 1);
        glProxy.rotate(10, 1, 0, 0);
        glProxy.translate(0.08, 0.0, -0.05);
    }
}
