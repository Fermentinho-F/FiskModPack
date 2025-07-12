loadTextures({
    "base": "tmf:vision_head"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "tmf:omnitrix/weapons/vision_head", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {

	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.translate(-0.3, 0.0, -0.5);
		glProxy.scale(1.2);
		glProxy.rotate(90, 1, 0, 0);
	}
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
		glProxy.scale(1.2);
		glProxy.rotate(-90, 0, 1, -1);
		glProxy.translate(-0.2, 0.0, 0.0);
    }

	glProxy.translate(0.1, -0.2, -0.45);
	glProxy.scale(1.5);
	glProxy.rotate(-90, 1, 0, 0.1);
}
