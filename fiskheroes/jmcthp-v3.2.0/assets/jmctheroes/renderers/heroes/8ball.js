extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:8ball/8ball_layer1",
    "layer2": "jmctheroes:8ball/8ball_layer2"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "jmctheroes:8Ball");
    model.texture.set("layer1");
    model.bindAnimation("jmctheroes:flight/8ball/8ball_hover").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
    ball = renderer.createEffect("fiskheroes:model").setModel(model);
    ball.anchor.set("leftArm");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "jeff.FLIGHT", "jmctheroes:flight/8ball/8ball_hover").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {  
    var hover = entity.getData("fiskheroes:flying"); 
    if (renderLayer == "CHESTPLATE" && hover) {
        ball.opacity = entity.getInterpolatedData("fiskheroes:flight_timer");
        ball.render();
    }
}
