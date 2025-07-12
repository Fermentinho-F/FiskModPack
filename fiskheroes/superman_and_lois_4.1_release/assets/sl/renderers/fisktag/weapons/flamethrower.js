loadTextures({
    "base": "sl:flamethrower_texture"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "sl:flamethrower", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
      glProxy.translate(0.0, -0.275, -0.25);
	
	glProxy.scale(2.0);

	if (renderType === "INVENTORY" || renderType === "ENTITY") {
		glProxy.translate(0.0, 0.0, 0.0);
}
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
		glProxy.translate(0.0, 0.0, 0.0);
    }
}
