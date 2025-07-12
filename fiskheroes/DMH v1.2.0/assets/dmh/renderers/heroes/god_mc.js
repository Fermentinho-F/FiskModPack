extend("dmh:god");
loadTextures({
    "layer1": "dmh:sn/god/god_mc_l1",
    "layer2": "dmh:sn/god/god_mc_l2",
    "eyes": "dmh:sn/eyes/blue_eyes",
    "blank": "dmh:null"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("HELMET", "god_mc_0");
    renderer.setItemIcon("CHESTPLATE", "god_mc_1");
    renderer.setItemIcon("LEGGINGS", "god_mc_2");
    renderer.setItemIcon("BOOTS", "god_mc_3");

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "blank";
        }
        return "blank";
    });

}