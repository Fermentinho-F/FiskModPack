loadTextures({
    "base": "sl:inhaler_broken",
    "lights": "sl:inhaler_texture_lights",
    "inhalerlights": "sl:inhalerLights.tx.json"
});

var utils = implement("fisktag:external/utils");
var model;

function init(renderer) {
    model = utils.createModel(renderer, "sl:broken_inhaler", "base", null);
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
      var t = entity.getInterpolatedData("sl:dyn/heat_vision_charge")

      glProxy.translate(0.08571428571428572, 0.1382857142857143, 0.9428571428571428);

      glProxy.rotate(90, -1, 0, 0);
	
	glProxy.scale(1.5);

glProxy.opacity = 0;

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        model.texture.set("base", null);
    } else if (renderType === "ENTITY") {
        model.texture.set("base", null);
        glProxy.rotate(90, 1, 0, 0);
        glProxy.translate(0.3214, -0.9428, -0.9583);
    } else if (renderType === "INVENTORY") {
        model.texture.set("base", null);
		glProxy.translate(0.4, -1.4, 0.4);
            glProxy.scale(3.0); 
    } else if (renderType === "EQUIPPED") {
        model.texture.set("base", null);
    }

}
