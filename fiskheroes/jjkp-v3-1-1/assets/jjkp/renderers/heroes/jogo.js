extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jjkp:jogo/jogo_layer1",
    "layer2": "jjkp:jogo/jogo_layer2",
    "volcano": "jjkp:jogo/jogo_volcano",
    "jogodomain": "jjkp:jogo/jogo_domain"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var fire = renderer.createResource("ICON", "jjkp:curse_energy_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);
    head_flames = flames.createHead(renderer, fire);

    var shadow_dome = renderer.bindProperty("fiskheroes:shadowdome");
	shadow_dome.texture.set("jogodomain", "jogodomain");
	//shadow_dome.setShape(36, 36)

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xA53BFF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    var model = renderer.createResource("MODEL", "jjkp:jogo_volcano");
    model.texture.set("volcano");
    volcano = renderer.createEffect("fiskheroes:model").setModel(model);
    volcano.setOffset(0, 0, 0)
    volcano.setScale(1.0);
    volcano.anchor.set("head");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
    if (renderLayer == "HELMET") {
        volcano.render();
    }
}
