extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:blank",
    "layer2": "jmctheroes:blank",
    "mk1_l1": "jmctheroes:ultron/mk1_layer1",
    "mk1_l2": "jmctheroes:ultron/mk1_layer2",
    "mk1_l": "jmctheroes:ultron/mk1_lights",
    "base": "jmctheroes:ultron/ultron_mk1",
    "lights": "jmctheroes:ultron/ultron_mk1_lights",
    "repulsor": "jmctheroes:ultron/ultron_mk1_repulsor",
});

var utils = implement("fiskheroes:external/utils");

var overlay1, overlay2;


function initEffects(renderer) {
    utils.setOpacity(renderer, 0.5, 0.1);

    overlay1 = renderer.createEffect("fiskheroes:overlay");
    overlay2 = renderer.createEffect("fiskheroes:overlay");

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronHead", "base", "lights"));
    head.anchor.set("head");
    body = renderer.createEffect("fiskheroes:model");
    body.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronBody", "base", null));
    body.anchor.set("body");
    rightarm = renderer.createEffect("fiskheroes:model");
    rightarm.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronRightArm", "base", null));
    rightarm.anchor.set("rightArm");
    leftarm = renderer.createEffect("fiskheroes:model");
    leftarm.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronLeftArm", "base", null));
    leftarm.anchor.set("leftArm");
    leftarm.setOffset(-2.0, 0.0, 0.0);
    rightleg = renderer.createEffect("fiskheroes:model");
    rightleg.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronRightLeg", "base", "lights"));
    rightleg.anchor.set("rightLeg");
    rightleg.setOffset(-1.0, 2.25, 0.0);
    leftleg = renderer.createEffect("fiskheroes:model");
    leftleg.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronLeftLeg", "base", "lights"));
    leftleg.anchor.set("leftLeg");
    leftleg.setOffset(-1.0, 2.25, 0.0);

    repulsor = renderer.createEffect("fiskheroes:model");
    repulsor.setModel(utils.createModel(renderer, "jmctheroes:ultron/mk1/UltronRightArm", null, "repulsor"));
    repulsor.anchor.set("rightArm");
    
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(head, body, rightarm, leftarm, rightleg, leftleg);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0xFFC462, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 1.5] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "crippled.SUIT", "jmctheroes:ultron/ultron_mk1").setData((entity, data) => {
        data.load(0, Math.max(entity.isAlive()));
    }).priority = 1;
    addAnimation(renderer, "crippled.AIMING", "jmctheroes:ultron/ultron_aim").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer")));
    }).priority = 10;
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
        repulsor.opacity = entity.getInterpolatedData("fiskheroes:aiming_timer");
        repulsor.render();
    }
    if (stand) {
        if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
            overlay1.render();
            overlay1.texture.set("mk1_l1", "mk1_l");
        }
        else if (renderLayer == "LEGGINGS") {
            overlay2.render();
            overlay2.texture.set("mk1_l2");
        }
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
}   