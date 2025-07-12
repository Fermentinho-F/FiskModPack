extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:kevin",
    "layer2": "emo:kevin",
    "demir": "emo:ironform",
    "tas": "emo:stoneform",
    "elmas": "emo:diamondform",
    "magma": "emo:magmaform",    
    "zumrut": "emo:emeraldform",
    "spike": "fiskheroes:savitar_spike"
});

var utils = implement("fiskheroes:external/utils");

var spike;
var demir;
var tas;
var elmas;
var magma;
var zumrut;


function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    spike = renderer.createEffect("fiskheroes:shield");
    spike.texture.set("spike");
    spike.anchor.set("rightArm");
    spike.setRotation(0.0, 0.0, 10.0).setCurve(40.0, 160.0);

    demir = renderer.createEffect("fiskheroes:overlay");
    demir.texture.set("demir");

    tas = renderer.createEffect("fiskheroes:overlay");
    tas.texture.set("tas");

    elmas = renderer.createEffect("fiskheroes:overlay");
    elmas.texture.set("elmas");

    magma = renderer.createEffect("fiskheroes:overlay");
    magma.texture.set("magma");

    zumrut = renderer.createEffect("fiskheroes:overlay");
    zumrut.texture.set("zumrut");

    utils.bindParticles(renderer, "fiskheroes:firestorm").setCondition(entity => entity.getData("fiskheroes:flying"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        spike.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");

        var f = Math.min(spike.unfold * 5, 1);
        spike.setOffset(2.9 + 0.6 * f, 6.0 + 2.0 * f, 0.0);
        spike.render();
    }
    if (renderLayer == "CHESTPLATE") {
        demir.opacity = entity.getInterpolatedData("emo:dyn/demir_timer");
        demir.render();
    }
    if (renderLayer == "CHESTPLATE") {
        tas.opacity = entity.getInterpolatedData("emo:dyn/tas_timer");
        tas.render();
    }
    if (renderLayer == "CHESTPLATE") {
        elmas.opacity = entity.getInterpolatedData("emo:dyn/elmas_timer");
        elmas.render();
    }
    if (renderLayer == "CHESTPLATE") {
        magma.opacity = entity.getInterpolatedData("emo:dyn/magma_timer");
        magma.render();
    }
    if (renderLayer == "CHESTPLATE") {
        zumrut.opacity = entity.getInterpolatedData("emo:dyn/zumrut_timer");
        zumrut.render();
    }
}