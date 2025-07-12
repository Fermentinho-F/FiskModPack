extend("fiskheroes:hero_basic");
loadTextures({
    "base": "shadows:nothing",
    "model": "shadows:backpack"
});

var utils = implement("fiskheroes:external/utils");

var model;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture(() => "base");
    renderer.setItemIcon("CHESTPLATE", "backpack/%s");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "shadows:backpack");
    model.texture.set("model", null);
    model.bindAnimation("shadows:backpack").setData((entity, data) => {
        data.load(0, entity.isAlive());
        data.load(1, Math.sin((2*entity.loop(50))*Math.PI)/2);
    });
    backpack = renderer.createEffect("fiskheroes:model").setModel(model);
    backpack.anchor.set("body");

}

function render(entity, renderLayer) {
    backpack.render();
}
