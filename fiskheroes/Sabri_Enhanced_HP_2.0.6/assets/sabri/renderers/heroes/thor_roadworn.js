extend("sabri:thor");
loadTextures({
    "layer1": "sabri:thor_roadworn_layer1",
    "layer2": "sabri:thor_roadworn_layer2",
    "chest": "sabri:thor_roadworn_chest",
    "cape": "sabri:thor_roadworn_cape"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") && entity.getData("fiskheroes:mask_open_timer2") >= 0.5) {
            return "null";
        }
        return renderLayer == "CHESTPLATE" ? "chest" : renderLayer == "LEGGINGS" ? "layer2" : "layer1"
    });

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}