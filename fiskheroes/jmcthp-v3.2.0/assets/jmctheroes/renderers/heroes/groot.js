extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:blank",
    "layer2": "jmctheroes:blank",
    "groot": "jmctheroes:groot/groot.tx.json",
    "wings": "jmctheroes:groot/groot_wings.tx.json",
    "groot_layer1": "jmctheroes:groot/groot_layer1",
    "groot_layer2": "jmctheroes:groot/groot_layer2",
    "segment": "fiskheroes:doctor_octopus_arm",
    "claw": "fiskheroes:doctor_octopus_claw",
    "claw_lights": "fiskheroes:doctor_octopus_claw_lights"
});

var utils = implement("fiskheroes:external/utils");

var overlay1, overlay2;

function initEffects(renderer) {
    utils.setOpacity(renderer, 0.5, 0.1);

    overlay1 = renderer.createEffect("fiskheroes:overlay");
    overlay2 = renderer.createEffect("fiskheroes:overlay");

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "jmctheroes:Groot/groothead", "groot", null));
    head.anchor.set("head");
    body = renderer.createEffect("fiskheroes:model");
    body.setModel(utils.createModel(renderer, "jmctheroes:Groot/grootchest", "groot", null));
    body.anchor.set("body");
    rightarm = renderer.createEffect("fiskheroes:model");
    rightarm.setModel(utils.createModel(renderer, "jmctheroes:Groot/grootrightarm", "groot", null));
    rightarm.anchor.set("rightArm");
    leftarm = renderer.createEffect("fiskheroes:model");
    leftarm.setModel(utils.createModel(renderer, "jmctheroes:Groot/grootleftarm", "groot", null));
    leftarm.anchor.set("leftArm");
    leftarm.setOffset(-2.0, 0.0, 0.0);
    rightleg = renderer.createEffect("fiskheroes:model");
    rightleg.setModel(utils.createModel(renderer, "jmctheroes:Groot/grootrightleg", "groot", null));
    rightleg.anchor.set("rightLeg");
    leftleg = renderer.createEffect("fiskheroes:model");
    leftleg.setModel(utils.createModel(renderer, "jmctheroes:Groot/grootleftleg", "groot", null));
    leftleg.anchor.set("leftLeg");
    
	var model = renderer.createResource("MODEL", "jmctheroes:Groot/grootclaws");
    model.texture.set("groot", null);
    model.generateMirror();
    claws = renderer.createEffect("fiskheroes:model").setModel(model);
    claws.anchor.set("rightArm");	
    claws.mirror = true;

    wings = renderer.createEffect("fiskheroes:model");
    wings.setModel(utils.createModel(renderer, "jmctheroes:Groot/grootwings", "wings", null));
    wings.anchor.set("body");
    wings.setScale(1.5);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "groot.SUIT", "jmctheroes:groot").setData((entity, data) => {
        data.load(Math.max(entity.isAlive()));
    });
}

function render(entity, renderLayer, isFirstPersonArm){
    var stand = !entity.isWearingFullSuit() || entity.isDisplayStand();
    var suit = entity.isWearingFullSuit() && !entity.isDisplayStand();
    if (suit) {
        head.render();
        body.render();
        rightarm.render();
        leftarm.render();
        rightleg.render();
        leftleg.render();
        claws.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
        claws.render();
        wings.opacity = entity.getInterpolatedData("fiskheroes:gliding_timer");
        wings.render();
    }
    if (stand) {
        if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
            overlay1.render();
            overlay1.texture.set("groot_layer1");
        }
        else if (renderLayer == "LEGGINGS") {
            overlay2.render();
            overlay2.texture.set("groot_layer2");
        }
    }
}