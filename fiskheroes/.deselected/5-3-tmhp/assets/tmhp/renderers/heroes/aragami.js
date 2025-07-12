extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:games/aragami_layer1",
    "layer2": "tmhp:games/aragami_layer2",
    "cape": "tmhp:games/aragami_cape",
    "sheath": "fiskheroes:prometheus_sheath"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var sheath;

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    sheath = renderer.createEffect("fiskheroes:model");
    sheath.setModel(utils.createModel(renderer, "fiskheroes:prometheus_sheath", "sheath"));
    sheath.anchor.set("body");
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [-5.03, 1.28, 2.43], "rotation": [-150.0, 90.0, 0.0] }
    ]);

    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindCloud(renderer, "fiskheroes:teleportation", "tmhp:raven");
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x000000);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
        sheath.render();
    }
}