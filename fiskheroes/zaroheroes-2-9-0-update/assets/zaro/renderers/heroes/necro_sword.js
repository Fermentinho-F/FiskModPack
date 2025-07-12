extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:null",
    "layer2": "zaro:null",
    "necrosword": "zaro:necrosword"
});

var utils = implement("fiskheroes:external/utils");

var necrosword;
var chest;
var glow;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

    var necro = renderer.createResource("MODEL", "zaro:necrosword");
    necro.texture.set("necrosword");
    necrosword = renderer.createEffect("fiskheroes:model").setModel(necro);
    necrosword.anchor.set("rightArm");

    var chain = utils.bindCloud(renderer, "fiskheroes:telekinesis_chain", "fiskheroes:shadow_smoke");
    chain.anchor.set("rightArm");
    chain.setOffset(-0.5, 10.0, 0.0);
    chain.setFirstPerson(-4.75, 4.0, -8.5);

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);


    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.includeEffects(chest);
    glow.color.set(0x000000);

    utils.bindParticles(renderer, "fiskheroes:harbinger_glow");
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "body", 0x000000, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));

}

function render(entity, renderLayer, isFirstPersonArm) {
    if ((entity.getData("fiskheroes:shield") > 0.5) && (entity.getHeldItem().isEmpty())) {
        necrosword.render();
    }
    
glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
}

