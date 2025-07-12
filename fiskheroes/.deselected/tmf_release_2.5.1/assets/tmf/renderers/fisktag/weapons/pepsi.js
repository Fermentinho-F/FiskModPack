loadTextures({
    "base": "tmf:pepsi"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "tmf:omnitrix/weapons/pepsi", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {

	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.translate(-0.3, 0.0, 0.0);
		glProxy.scale(1.7);
	}
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
		glProxy.translate(-0.1, 0.05, 0.0);
		glProxy.scale(3.0);
		glProxy.rotate(45, 0, 1, 0);
    }

	glProxy.translate(0.1, 0.2, -0.15);
	glProxy.scale(1.5);
	glProxy.rotate(-90, 1, 0, 0);
}
