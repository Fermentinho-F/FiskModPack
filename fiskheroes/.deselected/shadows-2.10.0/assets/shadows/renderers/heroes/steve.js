extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:hidden/steve/steve1",
    "eyes": "shadows:hidden/steve/eyes",
    "layer2": "shadows:hidden/steve/steve2",
    "layer3": "shadows:hidden/steve/steve_mask.tx.json",
    "nothing": "shadows:nothing"
});




function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return "layer2";
        }
        if (entity.getData('fiskheroes:mask_open_timer') > 0) {
            return "layer3";
        }
        return "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS" || renderLayer == "BOOTS") {
            return null;
        }
        return entity.getData('fiskheroes:dyn/steeled') ? "eyes" : "nothing";
    });

    renderer.setItemIcons("hidden/steve/%s_0", "hidden/steve/%s_1", "hidden/steve/%s_2", "hidden/steve/%s_3");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorAtmosphere.set(0x000000);
}
