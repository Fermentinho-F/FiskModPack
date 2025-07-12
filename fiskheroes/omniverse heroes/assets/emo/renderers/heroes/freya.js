extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:freya",
    "layer2": "emo:freya"
});

var utils = implement("fiskheroes:external/utils");

var chest;
var glow;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(chest);
    glow.color.set(0xFFFFFF);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xD3D3D3);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindParticles(renderer, "fiskheroes:harbinger_glow");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "body", 0x00A5FF, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(0x00A5FF);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
    
    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
}
