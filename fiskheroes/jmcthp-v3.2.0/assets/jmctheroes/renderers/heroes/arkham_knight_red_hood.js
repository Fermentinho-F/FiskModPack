extend("jmctheroes:arkham_knight");
loadTextures({
    "layer1": "jmctheroes:arkham/arkham_knight_red_hood_layer1",
    "layer2": "jmctheroes:arkham/arkham_knight_red_hood_layer2",
    "lights": "jmctheroes:arkham/arkham_knight_red_hood_lights",
    "mask": "jmctheroes:arkham/arkham_knight_red_hood_mask.tx.json"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("%s_0", "%s_1", "arkham_knight_2", "arkham_knight_3");
}
