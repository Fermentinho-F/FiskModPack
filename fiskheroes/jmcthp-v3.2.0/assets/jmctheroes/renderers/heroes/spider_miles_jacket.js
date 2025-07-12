extend("jmctheroes:spider_miles_atsv");
loadTextures({
    "layer1": "jmctheroes:miles/spider_man_miles_hood_layer1",
    "layer2": "jmctheroes:miles/spider_man_miles_hood_layer2",
    "mask": "jmctheroes:miles/spider_man_miles_hood.tx.json"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setItemIcon("HELMET", "spider_miles_itsv_0");
    renderer.setItemIcon("CHESTPLATE", "spider_miles_jacket_1");
    renderer.setItemIcon("LEGGINGS", "spider_miles_jacket_2");
    renderer.setItemIcon("BOOTS", "spider_miles_jacket_3");
}