loadTextures({
    "base": "tmf:omni_hack"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "tmf:omnitrix/weapons/omnitrix_hack_item", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {

	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.rotate(-45, 0, 1, 0);
		glProxy.translate(0, -0.2, 0);
		glProxy.scale(2.5);
	}
    else if (renderType === "INVENTORY" ) {
		glProxy.scale(4.5);
		glProxy.translate(0.1, -0.1, 0.0);
    }
	else if (renderType === "ENTITY") {
		glProxy.scale(4.5);
		glProxy.translate(0.0, 0.0, -0.05);
    }
	else {
		glProxy.translate(0, 0, -0.25);
		glProxy.scale(1.5);
		glProxy.rotate(45, 0, 4, -1);
	}
}
