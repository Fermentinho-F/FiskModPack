extend("tmhp:asta_spade");
loadTextures({
    "layer1": "tmhp:black_clover/asta/spade_part1_layer1",
    "blackform": "tmhp:black_clover/asta/spade_part1_blackform"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("asta_spade_0", "%s_1", "asta_spade_2", "asta_spade_3");
}