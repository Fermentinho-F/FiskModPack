extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:rider",
    "layer2": "emo:rider",
    "bike": "emo:bike"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var bike;
var hand_flames;
var head_flames;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    bike = renderer.createEffect("fiskheroes:model");
    bike.setModel(utils.createModel(renderer, "emo:bike", "bike"));
    bike.anchor.set("body");
    bike.mirror = false;

    var fire = renderer.createResource("ICON", "fiskheroes:fire_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);
    head_flames = flames.createHead(renderer, fire);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFF5500);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "emo:yok", "head", 0xD3D3D3, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:mysterio_beam", "body", 0xFF5500, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer,"rider.SUPER_SPEED", "emo:sur", "fiskheroes:speeding");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && !entity.isDisplayStand() && entity.isWearingFullSuit()) {
        hand_flames.render(1);

        if (!isFirstPersonArm) {
            //eyes.render();
            head_flames.render(1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        }
    }
    if (entity.getData("fiskheroes:speeding") > 0.6) {
       bike.render();
    }
}
