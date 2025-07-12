extend("dmh:god");
loadTextures({
    "layer1": "dmh:sn/god/gr_l1",
    "layer2": "dmh:sn/god/gr_l2",
    "eyes": "dmh:sn/eyes/blue_n_black_eyes",
    "blank": "dmh:null"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("HELMET", "gr_0");
    renderer.setItemIcon("CHESTPLATE", "gr_1");
    renderer.setItemIcon("LEGGINGS", "gr_2");
    renderer.setItemIcon("BOOTS", "gr_3");
}