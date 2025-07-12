extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:hellboy/hellboy_layer1",
    "layer2": "jmctheroes:hellboy/hellboy_pants",
    "pants_coat": "jmctheroes:hellboy/hellboy_pants_coat",
    "boots": "jmctheroes:hellboy/hellboy_boots",
    "boots_coat": "jmctheroes:hellboy/hellboy_boots_coat",
    "model1": "jmctheroes:hellboy/hellboy_models1",
    "model": "jmctheroes:hellboy/hellboy_models"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_coat" : "layer2";
        }
        else if (renderLayer == "BOOTS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "boots_coat" : "boots";
        }
        return "layer1";
    });

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}

function initEffects(renderer) {

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "jmctheroes:hellboy/HellBoyHorns", "model", null));
    head.anchor.set("head");

    arm = renderer.createEffect("fiskheroes:model");
    arm.setModel(utils.createModel(renderer, "jmctheroes:hellboy/HellBoyFistOfDoom", "model", null));
    arm.anchor.set("leftArm");
    arm.setOffset(-2.0, 0.0, 0.0);

    var model = renderer.createResource("MODEL", "jmctheroes:hellboy/HellBoyTail");
    model.bindAnimation("jmctheroes:pose/HellboyTail").setData((entity, data) => {
        data.load(0, 0);
        data.load(1, !entity.isDisplayStand() && Math.max(entity.loop(453) * 8 - 7, 0));
        data.load(2, !entity.isDisplayStand() && Math.max(entity.loop(342) * 8 - 7, 0));
        data.load(3, !entity.isDisplayStand() && Math.max(entity.loop(231) * 7 - 6, 0));
        data.load(4, !entity.isDisplayStand() && entity.loop(50));
        data.load(5, !entity.isDisplayStand() && entity.loop(50));
        data.load(6, !entity.isDisplayStand() && entity.loop(40));
        data.load(8, entity.isAlive());
    }).priority = -1;

    model.texture.set("model1");
    tail = renderer.createEffect("fiskheroes:model").setModel(model);
    tail.anchor.set("body");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        head.render();
    }
    if (renderLayer == "CHESTPLATE") {
        tail.render();
        arm.render();
    }
}