loadTextures({
    "base": "sl:inhaler_texture_empty",
    "lights": "sl:inhaler_texture_lights",
    "inhalerlights": "sl:inhalerLights.tx.json",
    "xinhalerlights": "sl:xinhalerLights.tx.json"
});

var utils = implement("fisktag:external/utils");
var model;

function init(renderer) {
    model = utils.createModel(renderer, "sl:inhaler", "base", null);
model.bindAnimation("sl:inhaler_consume_fp").setData((entity, data) => {
    if (!infirstperson) {
        data.load(0, 0);
    } else if (entity.getData("sl:dyn/kryptonite")) {
        data.load(0, entity.getInterpolatedData("sl:dyn/kryptonite_timer"));
    } else if (entity.getData("sl:dyn/xkryptonite")) {
        data.load(0, entity.getInterpolatedData("sl:dyn/xkryptonite_timer"));
    }
});
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
      infirstperson = false;

      var t = entity.getInterpolatedData("sl:dyn/heat_vision_charge")

      glProxy.translate(0.08571428571428572, 0.1382857142857143, 0.9428571428571428);

      glProxy.rotate(90, -1, 0, 0);
	
	glProxy.scale(1.5);

glProxy.opacity = 0;

if (renderType === "EQUIPPED_FIRST_PERSON") {
    if (entity.getData("sl:dyn/kryptonite_timer") > 0 && entity.getData("sl:dyn/kryptonite")) {
        model.texture.set("base", "inhalerlights");
        infirstperson = true;
    } else if (entity.getData("sl:dyn/xkryptonite_timer") > 0 && entity.getData("sl:dyn/xkryptonite")) {
        model.texture.set("base", "xinhalerlights");
        infirstperson = true;
    } else {
        model.texture.set("base", null);
        infirstperson = true;
    }
} else if (renderType === "ENTITY") {
    model.texture.set("base", null);
} else if (renderType === "INVENTORY") {
    if (entity.getData("sl:dyn/kryptonite_timer") > 0 && entity.getData("sl:dyn/kryptonite")) {
        model.texture.set("base", "inhalerlights");
        glProxy.translate(0.4, -1.4, 0.4);
        glProxy.scale(3.0);
    } else if (entity.getData("sl:dyn/xkryptonite_timer") > 0 && entity.getData("sl:dyn/xkryptonite")) {
        model.texture.set("base", "xinhalerlights");
        glProxy.translate(0.4, -1.4, 0.4);
        glProxy.scale(3.0);
    } else {
        model.texture.set("base", null);
        glProxy.translate(0.4, -1.4, 0.4);
        glProxy.scale(3.0);
    }
} else if (renderType === "EQUIPPED") {
    if (entity.getData("sl:dyn/kryptonite_timer") > 0 && entity.getData("sl:dyn/kryptonite")) {
        model.texture.set("base", "inhalerlights");
    } else if (entity.getData("sl:dyn/xkryptonite_timer") > 0 && entity.getData("sl:dyn/xkryptonite")) {
        model.texture.set("base", "xinhalerlights");
    } else {
        model.texture.set("base", null);
    }
}

}
