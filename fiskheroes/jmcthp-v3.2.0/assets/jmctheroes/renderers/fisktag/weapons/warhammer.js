loadTextures({
    "base": "jmctheroes:warhammer",
    "lights": "jmctheroes:warhammer_lights"
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "jmctheroes:weapons/WarHammer", "base", "lights");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
    }
    else if (renderType === "ENTITY") {
        glProxy.translate(0, -0.25, -0.1);
        cancelAnimations = true;
    }
    else if (renderType === "INVENTORY") {
        glProxy.translate(0, 0.1, 0);
        glProxy.rotate(45, 0, 0, 1);
        glProxy.rotate(90, 0, 1, 0);
        glProxy.rotate(15, 1, 0, 1);
        glProxy.scale(1.0);
    }
    else if (renderType === "EQUIPPED") {
    }
    glProxy.translate(0, -2.0, -0.85);
    glProxy.scale(1.75);
}