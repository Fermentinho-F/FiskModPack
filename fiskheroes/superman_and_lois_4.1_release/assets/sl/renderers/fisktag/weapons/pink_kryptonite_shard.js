loadTextures({
    "base": "sl:pink_kryptonite_shard"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "sl:kryptonite_shard", null, "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
      glProxy.translate(0.0, -0.6, 0.0);

      glProxy.rotate(90, -1, 0, 0);
	
	glProxy.scale(2.0);

	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.translate(0.0, 0.1, 0.0);
		glProxy.scale(2);
}
    else if (renderType === "INVENTORY") {
		glProxy.translate(0.0, 0.2, 0.1);
            glProxy.scale(2.0); 
    }
    else if (renderType === "ENTITY") {
		glProxy.translate(0.0, 0.0, 0.0);
            glProxy.scale(2.0); 
    }
}
