extend("jmctheroes:spider_miles");
loadTextures({
    "layer1": "jmctheroes:miles/spider_man_miles_10th_layer1",
    "layer2": "jmctheroes:miles/spider_man_miles_10th_layer2"
});

function init(renderer) {
    parent.init(renderer);

    renderer.setItemIcon("HELMET", "spider_miles_10th_0");
    renderer.setItemIcon("CHESTPLATE", "spider_miles_10th_1");
    renderer.setItemIcon("LEGGINGS", "spider_miles_10th_2");
    renderer.setItemIcon("BOOTS", "spider_miles_10th_3");
}