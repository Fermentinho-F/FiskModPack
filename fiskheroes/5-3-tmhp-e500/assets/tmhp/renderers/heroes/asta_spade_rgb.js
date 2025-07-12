extend("tmhp:asta_spade");
loadTextures({
    "black_samurai_glow": "tmhp:black_clover/asta/black_samurai_glow.tx.json",
    "black_guardian_glow": "tmhp:black_clover/asta/black_guardian_glow.tx.json",
    "demon_destroyer_glow": "tmhp:black_clover/asta/demon_destroyer_glow.tx.json",
    "demon_dweller_du_glow": "tmhp:black_clover/asta/demon_dweller_du_glow.tx.json"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("asta_spade_0", "asta_spade_1", "asta_spade_2", "asta_spade_3");
}