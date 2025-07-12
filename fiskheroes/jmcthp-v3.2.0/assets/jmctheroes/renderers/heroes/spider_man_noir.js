extend("jmctheroes:spider_man");
loadTextures({
    "layer1": "jmctheroes:spiderman/spider_man_noir_itsv_layer1",
    "layer2": "jmctheroes:spiderman/spider_man_noir_itsv_pants",
    "pants_coat": "jmctheroes:spiderman/spider_man_noir_itsv_pants_coat",
    "boots": "jmctheroes:spiderman/spider_man_noir_itsv_boots",
    "model": "jmctheroes:spiderman/spider_man_noir_itsv_model",
    "gun": "fiskheroes:deadpool_xmen_gun",
    "cube": "jmctheroes:spiderman/cube"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "pants_coat" : "layer2";
        }
        else if (renderLayer == "BOOTS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "boots" : "boots";
        }
        return "layer1";
    });

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");
}
function initEffects(renderer) {
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");
    
    var model = renderer.createResource("MODEL", "jmctheroes:Spidey/Cube");
    model.texture.set("cube", null);
    model.bindAnimation("jmctheroes:pose/Cube").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/1float_interp_reset"))
    }).priority = -1;
    cube = renderer.createEffect("fiskheroes:model").setModel(model);
    cube.anchor.set("body");

    sense = renderer.createEffect("fiskheroes:model");
    sense.setModel(utils.createModel(renderer, "jmctheroes:spideysense", null, "spidersense"));
    sense.anchor.set("head");

    hat = renderer.createEffect("fiskheroes:model");
    hat.setModel(utils.createModel(renderer, "jmctheroes:Spidey/NoirHat", "model", null));
    hat.anchor.set("head");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming").setData((entity, data) => data.load(entity.getHeldItem().nbt().getString("WeaponType") == 'jmctheroes:luger' && entity.getInterpolatedData("fiskheroes:aiming_timer")))
    .priority = 2;
    //addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"))))
    //.priority = 2
    //.setCondition(entity => entity.getHeldItem().nbt().getString("WeaponType") == 'jmctheroes:luger');
    addAnimation(renderer, "noir.CUBE", "jmctheroes:pose/Cube").setData((entity, data) => data.load(0, entity.getInterpolatedData("jmctheroes:dyn/1float_interp_reset")))
    .setCondition(entity => entity.getData("jmctheroes:dyn/1float_interp_reset") > 0);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        hat.render();
    }
    var slow = entity.getData("fiskheroes:slow_motion");
    if (renderLayer == "HELMET" && slow) {
        sense.render();
    }
    var timer = entity.getData("jmctheroes:dyn/1float_interp_reset") > 0.1 && entity.getData("jmctheroes:dyn/1float_interp_reset") < 0.9;
    if (renderLayer == "CHESTPLATE" && timer) {
        cube.render();
    }
}