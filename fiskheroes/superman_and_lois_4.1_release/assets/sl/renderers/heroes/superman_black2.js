extend("sl:superman");
loadTextures({
  "layer1": "sl:superman_cw_elseworlds_layer1",
  "layer2": "sl:superman_cw_elseworlds_layer2",
  "eyes": "fiskheroes:reverse_flash_eyes",
  "cape": "sl:superman_elseworlds_cape",
  "cape_tired": "sl:superman_elseworlds_cape_tired",
  "lights": "sl:supercharged_alt",
  "supercharging": "sl:superchargedlights_alt.tx.json",
  "null": "sl:null",
  "suittexture": "sl:superman_suit_texture",
  "ksickness": "sl:kryptonite_sickness"
});

function init(renderer, trailType) {
  parent.init(renderer);

  renderer.setItemIcons("superman_cw_elseworlds_0", "superman_black2_1", "superman_cw_elseworlds_2", "superman_cw_elseworlds_3");

renderer.setTexture((entity, renderLayer) =>
  (renderLayer === "HELMET" && !entity.getData("sl:dyn/suitup_timer") > 0.5) || (renderLayer === "LEGGINGS" && !entity.getData("sl:dyn/suitup_timer") > 0.5) ? "layer2" : (entity.getData("sl:dyn/suitup_timer") > 0.5 ? "null" : "layer1")
);
    renderer.setLights((entity, renderLayer) => entity.getEquipmentInSlot(3).nbt().getDouble('inhaled') > 7 ? "xk_eyes" : null);


  renderer.showModel(
    "CHESTPLATE",
    "head",
    "headwear",
    "body",
    "rightArm",
    "leftArm"
  );
}
