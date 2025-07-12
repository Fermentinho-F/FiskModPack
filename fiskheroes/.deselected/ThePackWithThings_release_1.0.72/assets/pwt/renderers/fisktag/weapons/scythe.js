loadTextures({
    "base": "pwt:scythe"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    var model = utils.createModel(renderer, "pwt:scythe", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	if (entity.getWornHelmet().nbt().getString('HeroType') == 'pwt:halloween_scarecrow' ) {
		glProxy.translate(0.0, 0.20, -0.55);
	}
	else {
		glProxy.translate(0.0, 0.20, -0.15);
	}
	
	///x:0.04
	if (renderType === "EQUIPPED_FIRST_PERSON") {
		glProxy.translate(-0.2, 0.1, 0.0);
		glProxy.rotate(10, 0, -1, 0);
		glProxy.rotate(15, -1, 0, -1);
		glProxy.scale(0.9);
}
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
		glProxy.translate(0.3, 0.25, 0.0);
		glProxy.rotate(45, 0, -1, 0);
		glProxy.rotate(45, -1, 0, 0);
		glProxy.rotate(15, 0, 0, -1);
    }
	


	glProxy.scale(0.7);
}
