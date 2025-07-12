extend("jmctheroes:spider_man");
loadTextures({
    "layer1": "jmctheroes:ock/superior_spider_man_layer1",
    "layer2": "jmctheroes:ock/superior_spider_man_layer2",
    "lights": "jmctheroes:ock/superior_spider_man_lights",
    "arms": "jmctheroes:ock/superior_arms"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return renderLayer == "LEGGINGS" ? "blank" : "lights";
    });
}

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:invisible", "body", 0xFF1F00, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}
    ]);
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "jmctheroes:invisible", "body", 0xFF1F00, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}
    ]);

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
    night_vision.factor = 0.45;
    night_vision.firstPersonOnly = true;

    var model = renderer.createResource("MODEL", "jmctheroes:SuperiorArms");
    model.bindAnimation("jmctheroes:SuperiorArms").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/moving_timer"));
        data.load(1, entity.getInterpolatedData("jmctheroes:dyn/jumping"));
        data.load(2, entity.getInterpolatedData("jmctheroes:dyn/sneaking_timer"));
        data.load(3, entity.getInterpolatedData("jmctheroes:dyn/0_timer"));
        data.load(4, entity.getInterpolatedData("jmctheroes:dyn/1_timer"));
        data.load(5, entity.getInterpolatedData("jmctheroes:dyn/2_timer"));
        data.load(6, entity.getInterpolatedData("jmctheroes:dyn/3_timer"));
        data.load(6, entity.getInterpolatedData("jmctheroes:dyn/3_timer"));
        data.load(7, !entity.isDisplayStand() ? entity.loop(45) : 0);
        data.load(8, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
        data.load(9, entity.isAlive());
    }).priority = -1;

    model.texture.set("arms");
    arms = renderer.createEffect("fiskheroes:model").setModel(model);
    arms.anchor.set("body");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
}

function render(entity, renderLayer, isFirstPersonArm){
    if (renderLayer == "CHESTPLATE") {
        if (isFirstPersonArm) {
            arms.setOffset(0, -2.5, 6.5).setRotation(0, 0, 0);
        }
        else {
            arms.setOffset(0, 0, 0).setRotation(0, 0, 0);
        }
        arms.anchor.ignoreAnchor(isFirstPersonArm);
        arms.render();
    }
}