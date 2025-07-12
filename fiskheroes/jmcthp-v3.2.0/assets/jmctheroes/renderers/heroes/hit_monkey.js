extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:blank",
    "layer2": "jmctheroes:blank",
    "monkey": "jmctheroes:monkey/monkey",
    "monkey1": "jmctheroes:monkey/hitmonkey_layer1",
    "monkey2": "jmctheroes:monkey/hitmonkey_layer2"
});

var utils = implement("fiskheroes:external/utils");

var overlay1, overlay2;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    utils.setOpacity(renderer, 0.5, 0.1);
    
    overlay1 = renderer.createEffect("fiskheroes:overlay");
    overlay2 = renderer.createEffect("fiskheroes:overlay");

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "jmctheroes:monkeyhead", "monkey", null));
    head.anchor.set("head");
    body = renderer.createEffect("fiskheroes:model");
    body.setModel(utils.createModel(renderer, "jmctheroes:monkeychest", "monkey", null));
    body.anchor.set("body");
    rightarm = renderer.createEffect("fiskheroes:model");
    rightarm.setModel(utils.createModel(renderer, "jmctheroes:monkeyrightarm", "monkey", null));
    rightarm.anchor.set("rightArm");
    rightarm.setOffset(-1.05, 0.0, 0.0);
    leftarm = renderer.createEffect("fiskheroes:model");
    leftarm.setModel(utils.createModel(renderer, "jmctheroes:monkeyleftarm", "monkey", null));
    leftarm.anchor.set("leftArm");
    leftarm.setOffset(1.05, -0.0, 0.0);
    rightleg = renderer.createEffect("fiskheroes:model");
    rightleg.setModel(utils.createModel(renderer, "jmctheroes:monkeyrightleg", "monkey", null));
    rightleg.anchor.set("rightLeg");
    leftleg = renderer.createEffect("fiskheroes:model");
    leftleg.setModel(utils.createModel(renderer, "jmctheroes:monkeyleftleg", "monkey", null));
    leftleg.anchor.set("leftLeg");
    
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [-4.1, 0.76, 3.0], "rotation": [-142.0, 80.0, .0] },
    ]).slotIndex = 0;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "body.MONKEY", "jmctheroes:monkey").setData((entity, data) => {
        data.load(Math.max(entity.isAlive()));
    });
}
function render(entity, renderLayer, isFirstPersonArm){
    var stand = !entity.isWearingFullSuit() || entity.isDisplayStand();
    var suit = entity.isWearingFullSuit() && !entity.isDisplayStand();
    if (suit) {
        head.render();
        body.render();
        rightarm.render();
        leftarm.render();
        rightleg.render();
        leftleg.render();
    }
    if (stand) {
        if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
            overlay1.render();
            overlay1.texture.set("monkey1");
        }
        else if (renderLayer == "LEGGINGS") {
            overlay2.render();
            overlay2.texture.set("monkey2");
        }
    }
}