loadTextures({
    "base": "sl:elt_texture_base",
    "lights": "sl:elt_texture_lights",
    "lights_off": "sl:elt_texture"
});

var utils = implement("fisktag:external/utils");
var model;

function init(renderer) {
    model = utils.createModel(renderer, "sl:elt", "lights_off", null);  // Assign to the global model variable
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (entity.getData("fiskheroes:aiming")) {
        model.texture.set("base", "lights");
    } else {
        model.texture.set("lights_off", null);
    }
	glProxy.scale(2.0);

    glProxy.translate(0.0, -1.5, -0.07);

    if (renderType === "INVENTORY") {
		glProxy.translate(0.0, -1.5, -0.1);
        glProxy.scale(2.0); 
    }
}
