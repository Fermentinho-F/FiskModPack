loadTextures({
    "base": "tmf:screwdriver"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "tmf:omnitrix/weapons/screwdriver", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {

	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.rotate(-90, 0, 1, 0);
		glProxy.scale(1.4);
	}
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
		glProxy.scale(2.0);
		glProxy.rotate(-90, 0.5, 1, 0);
		glProxy.translate(-0.3, 0.3, 0.0);
    }

	glProxy.translate(0.1, 0, 0.5);
	//glProxy.scale(1.5);
	glProxy.rotate(-90, 1, 0, 0);
}
