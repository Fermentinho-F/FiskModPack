extend("jmctheroes:spider_miles_atsv");
loadTextures({
    "layer1": "jmctheroes:miles/spider_man_miles_itsv_layer1",
    "layer2": "jmctheroes:miles/spider_man_miles_itsv_layer2"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("HELMET", "spider_miles_itsv_0");
    renderer.setItemIcon("CHESTPLATE", "spider_miles_itsv_1");
    renderer.setItemIcon("LEGGINGS", "spider_miles_itsv_2");
    renderer.setItemIcon("BOOTS", "spider_miles_itsv_3");
}