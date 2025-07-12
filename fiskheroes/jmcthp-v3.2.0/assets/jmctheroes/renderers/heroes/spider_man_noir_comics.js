extend("jmctheroes:spider_man");
loadTextures({
    "layer1": "jmctheroes:spiderman/spider_man_noir_layer1",
    "layer2": "jmctheroes:spiderman/spider_man_noir_layer2"
});

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming").setData((entity, data) => data.load(entity.getHeldItem().nbt().getString("WeaponType") == 'jmctheroes:luger' && entity.getInterpolatedData("fiskheroes:aiming_timer")))
    .priority = 2;
    addAnimation(renderer, "noir.CUBE", "jmctheroes:pose/Cube").setData((entity, data) => data.load(0, entity.getInterpolatedData("jmctheroes:dyn/1float_interp_reset")))
    .setCondition(entity => entity.getData("jmctheroes:dyn/1float_interp_reset") > 0);
}