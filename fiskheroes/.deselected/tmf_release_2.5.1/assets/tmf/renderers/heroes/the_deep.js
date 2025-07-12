extend("fiskheroes:hero_basic");
loadTextures({
	"null": "tmf:null",
	"layer1": "tmf:deeper/the_deep_layer1",
	"layer2": "tmf:deeper/the_deep_layer2",
	"octopus": "tmf:deeper/octopus"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {  
    parent.init(renderer);
	
}

function initEffects(renderer) {
    var modelOctopus = renderer.createResource("MODEL", "tmf:other/octopus");
    modelOctopus.bindAnimation("tmf:other/octopus").setData((entity, data) => data.load(entity.loop(20)));
    modelOctopus.texture.set("octopus");
    octopus = renderer.createEffect("fiskheroes:model").setModel(modelOctopus);
    octopus.anchor.set("head");
    octopus.setOffset(0, -6, -10);
    octopus.setRotation(90, 185, 10);
}

function render(entity, renderLayer, isFirstPersonArm) {
    octopus.setScale(0.85 + 0.04*Math.sin(3.5*entity.loop(15)));
    octopus.opacity = 0.99*entity.getInterpolatedData('tmf:dyn/stealth_timer');
	octopus.render();
}

function initAnimations(renderer) {
    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
}