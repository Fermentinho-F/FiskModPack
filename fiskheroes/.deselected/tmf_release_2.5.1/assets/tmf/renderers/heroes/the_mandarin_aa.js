extend("fiskheroes:hero_basic");
loadTextures({
	"null": "tmf:null",
	"layer1": "tmf:null",
	"layer2": "tmf:null",
	"ring_1": "tmf:mandarin/ring_1",
    "ringA_1": "tmf:mandarin/ringA_1"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {  
    parent.init(renderer);
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    ring_1 = renderer.createEffect("fiskheroes:model");
    ring_1.setModel(createRing(renderer, "ring_1", "ringA_1"));
    ring_1.anchor.set("leftArm");
    ring_1.setScale(1.0);
    ring_1.setOffset(0,0,0);
}

function render(entity, renderLayer, isFirstPersonArm) {	
    ring_1.render();
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function createRing(renderer, texture, textureLights) {
    var model = renderer.createResource("MODEL", "tmf:other/ring");
        model.texture.set(texture, textureLights);
    return model;
}