extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:sn/azazel/az_l1",
    "layer2": "dmh:sn/azazel/az_l2",
    "eyes": "dmh:sn/eyes/prince_of_hell_eyes"
});

var utils = implement("fiskheroes:external/utils");

var spell;

function init(renderer) {
    parent.init(renderer);

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "eyes";
        }
        return "blank";
    });

}

function initEffects(renderer) {
    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("fiskheroes:mask_open"));
    var color = 0xAA00AA;
    var magic = renderer.bindProperty("fiskheroes:spellcasting");

    utils.bindParticles(renderer, "dmh:fire_aoe").setCondition(entity => entity.getData("dmh:dyn/fire_timer") > 0.8 && entity.getData("dmh:dyn/fire"));

    magic.colorGeneric.set(color);
    magic.colorEarthCrack.set(color);
    magic.colorAtmosphere.set(color);
    magic.colorWhip.set(color);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "azazel.AIMING", "fiskheroes:aiming", "dmh:dyn/transform_timer").priority = 10;

    addAnimationWithData(renderer, "fire.AOE", "dmh:fire_aoe", "dmh:dyn/fire_timer").setCondition(entity => entity.getData("dmh:dyn/fire"));

}

function render(entity, renderLayer, isFirstPersonArm) {

}
