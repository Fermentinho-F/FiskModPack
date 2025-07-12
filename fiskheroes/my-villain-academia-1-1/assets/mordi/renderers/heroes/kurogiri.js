extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "mordi:nomu/kurogiri_layer1",
    "layer2": "mordi:nomu/kurogiri_layer1",
    "lights_layer1": "mordi:nomu/kurogiri_lights_layer1",
    "lights_layer2": "mordi:nomu/kurogiri_lights_layer1",
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "layer2" : "hood";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");

    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "lights_layer1" : "lights_layer1");
}

function initEffects(renderer) {

    var chain = utils.bindCloud(renderer, "fiskheroes:telekinesis_chain", "fiskheroes:shadow_smoke");
    chain.anchor.set("rightArm");
    chain.setOffset(-0.5, 10.0, 0.0);
    chain.setFirstPerson(-4.75, 4.0, -8.5);

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "mordi:kurogiri_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindCloud(renderer, "fiskheroes:teleportation", "mordi:kurogiri")
}
