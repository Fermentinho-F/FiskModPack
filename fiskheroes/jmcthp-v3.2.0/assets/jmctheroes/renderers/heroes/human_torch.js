extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:fantastic4/torch_layer1",
    "layer2": "jmctheroes:fantastic4/torch_layer2",
    "flame1": "jmctheroes:fantastic4/human_torch_layer1",
    "flame2": "jmctheroes:fantastic4/human_torch_layer2",
    "suit_off_layer1": "jmctheroes:fantastic4/suit_off_layer1.tx.json",
    "suit_off_layer2": "jmctheroes:fantastic4/suit_off_layer2.tx.json",
    "suit_lights_layer1": "jmctheroes:fantastic4/flame_on_layer1.tx.json",
    "suit_lights_layer2": "jmctheroes:fantastic4/flame_on_layer2.tx.json",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" || renderLayer == "HELMET" || renderLayer == "BOOTS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/torch_timer");
            var stand = entity.isDisplayStand();
            return stand ? "blank" : timer == 0 ? "layer1" : timer < 1 ? "suit_off_layer1" : "blank";
        }
        if (renderLayer == "LEGGINGS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/torch_timer");
            var stand = entity.isDisplayStand();
            return stand ? "blank" : timer == 0 ? "layer2" : timer < 1 ? "suit_off_layer2" : "blank";
        }
        return "blank";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/torch_timer");
            var stand = entity.isDisplayStand();
            return stand ? "flame1" : timer == 0 ? "blank" : timer < 1 ? "suit_lights_layer1" : "flame1";
        }
        if (renderLayer == "LEGGINGS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/torch_timer");
            var stand = entity.isDisplayStand();
            return stand ? "flame2" : timer == 0 ? "blank" : timer < 1 ? "suit_lights_layer2" : "flame2";
        }
        return "blank";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var beam = renderer.createResource("BEAM_RENDERER", "jmctheroes:glow1");
    var color = "0xFF6500";

    head = utils.createLines(renderer, beam, color, [
        {"start": [0, -0.48, 0], "end": [0.0, 0.48, 0.0], "size": [6.8, 6.8]}
    ]);
    head.anchor.set("head");
    head.setOffset(0, -4.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.5);
    head.mirror = false;

    body = utils.createLines(renderer, beam, color, [
        {"start": [0, -0.65, 0], "end": [0.0, 0.65, 0.0], "size": [3.8, 8.8]}
    ]);
    body.anchor.set("body");
    body.setOffset(0, 6.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.5);
    body.mirror = false;

    armright = utils.createLines(renderer, beam, color, [
        {"start": [0, -0.65, 0], "end": [0.0, 0.65, 0.0], "size": [3.8, 3.8]}
    ]);
    armright.anchor.set("rightArm");
    armright.setOffset(1, 4.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.5);
    armright.mirror = false;
 
    armleft = utils.createLines(renderer, beam, color, [
        {"start": [0, -0.65, 0], "end": [0.0, 0.65, 0.0], "size": [3.8, 3.8]}
    ]);
    armleft.anchor.set("leftArm");
    armleft.setOffset(-1, 4.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.5);
    armleft.mirror = false;

    legright = utils.createLines(renderer, beam, color, [
        {"start": [0, -0.65, 0], "end": [0.0, 0.7, 0.0], "size": [3.8, 3.8]}
    ]);
    legright.anchor.set("rightLeg");
    legright.setOffset(0, 6.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.5);
    legright.mirror = false;
    
    legleft = utils.createLines(renderer, beam, color, [
        {"start": [0, -0.65, 0], "end": [0.0, 0.7, 0.0], "size": [3.8, 3.8]}
    ]);
    legleft.anchor.set("leftLeg");
    legleft.setOffset(0, 6.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.5);
    legleft.mirror = false;

    utils.bindParticles(renderer, "jmctheroes:torch").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindParticles(renderer, "jmctheroes:torch1").setCondition(entity => entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_ticks") > 0.75 );
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "torch.FLIGHT", "jmctheroes:flight/torch.anim.json");
    utils.addHoverAnimation(renderer, "torch.HOVER", "fiskheroes:flight/idle/propelled_hands");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", "jmctheroes:dive_roll");

    addAnimationWithData(renderer, "torch.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;
    addAnimationWithData(renderer, "torch.LAND", "jmctheroes:landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!entity.isDisplayStand() && entity.isWearingFullSuit()) {
        var flame = entity.getInterpolatedData("jmctheroes:dyn/torch_timer");
        head.opacity = flame
        head.render()
        body.opacity = flame
        body.render()
        armright.opacity = flame
        armright.render()
        armleft.opacity = flame
        armleft.render()
        legright.opacity = flame
        legright.render()
        legleft.opacity = flame
        legleft.render()
    }
}