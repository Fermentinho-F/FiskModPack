loadTextures({
    "base": "jmctheroes:cue_stick"
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "jmctheroes:weapons/CueStick", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {    
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0, 0, 0);
    }
    else if (renderType === "ENTITY") {
        glProxy.rotate(45, 0, 1, 0);
        glProxy.rotate(90, 1, 0, 0);
        glProxy.translate(0.2, 0, 0);
        cancelAnimations = true;
    }
    else if (renderType === "INVENTORY") {
        glProxy.rotate(35, 1, 0, 1);
        glProxy.translate(0.35, 0, 0.55);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED") {
        glProxy.rotate(0, 0, 0, 0);
    }
    glProxy.translate(0, -2.5, -0.95);
    glProxy.scale(2.0);
}
