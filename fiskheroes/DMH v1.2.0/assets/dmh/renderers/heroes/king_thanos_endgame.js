extend("dmh:king_thanos");
loadTextures({
    "layer1": "dmh:king_thanos/thanos_endgame_l1",
    "layer2": "dmh:king_thanos/thanos_endgame_l2",
    "lights": "dmh:king_thanos/layer1_lights",
    "sword": "dmh:weapons/twilight_sword"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("king_thanos/endgame/thanos_0", "king_thanos/endgame/thanos_1", "king_thanos/endgame/thanos_2", "king_thanos/endgame/thanos_3");
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : null);
}