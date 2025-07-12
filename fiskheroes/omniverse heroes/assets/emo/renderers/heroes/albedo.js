extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "omnitrix": "emo:saatler/theomnitrixalbedo",
    "insanazor": "emo:albedozor",
    "jetray": "emo:albedoray",
    "korku": "emo:albedobig2",
    "korku2": "emo:albedobig",
    "stone": "emo:albedostone",
    "tas": "emo:powerred",
    "ates": "emo:albedocamur",
    "wings": "emo:bigwing",
    "web_wings": "emo:jetray_wings",
    "icicle": "fiskheroes:killer_frost_icicle",
    "hands": "fiskheroes:killer_frost_earth2_hands"
});

var utils = implement("fiskheroes:external/utils");

var omnitrix;
var insanazor;
var jetray;
var korku;
var korku2;
var stone;
var tas;
var ates;
var wings;
var wings2;
var web_wings;
var overlay;
var spikeL;
var spikeR;
var glow;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) { 
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFF0400);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
    
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "hands");
    overlay.opacity = 0.8;

    spikeL = renderer.createEffect("fiskheroes:shield");
    spikeL.texture.set("icicle");
    spikeL.anchor.set("rightArm");
    spikeL.setRotation(0.0, 0.0, -3.125).setCurve(20.0, 90.0);
    spikeR = renderer.createEffect("fiskheroes:shield");
    spikeR.texture.set("icicle");
    spikeR.anchor.set("rightArm");
    spikeR.setRotation(0.0, 180.0, -3.125).setCurve(20.0, 90.0);

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xFF0400);

    omnitrix = renderer.createEffect("fiskheroes:model");
    omnitrix.setModel(utils.createModel(renderer, "emo:theomnitrixtabula", "omnitrix"));
    omnitrix.anchor.set("rightArm");
    omnitrix.mirror = false;

    insanazor = renderer.createEffect("fiskheroes:overlay");
    insanazor.texture.set("insanazor");

    jetray = renderer.createEffect("fiskheroes:overlay");
    jetray.texture.set("jetray");
    
    korku = renderer.createEffect("fiskheroes:overlay");
    korku.texture.set("korku");

    korku2 = renderer.createEffect("fiskheroes:overlay");
    korku2.texture.set("korku2");

    stone = renderer.createEffect("fiskheroes:overlay");
    stone.texture.set("stone");

    tas = renderer.createEffect("fiskheroes:model");
    tas.setModel(utils.createModel(renderer, "emo:tas", "tas"));
    tas.anchor.set("head");
    tas.mirror = false;

    ates = renderer.createEffect("fiskheroes:overlay");
    ates.texture.set("ates");

    wings = renderer.createEffect("fiskheroes:model");
    wings.setModel(utils.createModel(renderer, "emo:bigwings", "wings"));
    wings.anchor.set("body");
    wings.mirror = false;

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 1.0;

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "emo:albedo").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0xFF0400, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -5.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -5.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "head", 0x40E7F9, [
        { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "body", 0xFF0400, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindTrail(renderer, "emo:blur");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        var charge = entity.getData("fiskheroes:cryo_charge");
        overlay.opacity = 0.8 * charge;
        overlay.render();

        spikeL.unfold = spikeR.unfold = entity.getInterpolatedData("fiskheroes:blade_timer") * (entity.isBookPlayer() ? 1 : Math.sqrt(charge));

        var f = Math.min(spikeL.unfold * 5, 1);
        spikeL.setOffset(2.25 + 1.0 * f, 8.0 + 2.0 * f, 0.0);
        spikeR.setOffset(-0.25 - 1.0 * f, 8.0 + 2.0 * f, 0.0);
        spikeL.render();
        spikeR.render();
    }
    if (renderLayer == "CHESTPLATE") {
        insanazor.opacity = entity.getInterpolatedData("emo:dyn/insanazor_timer");
        insanazor.render();
    }
    if (renderLayer == "CHESTPLATE") {
        stone.opacity = entity.getInterpolatedData("emo:dyn/xlr_timer");
        stone.render();
    }
    if (renderLayer == "CHESTPLATE") {
        tas.opacity = entity.getInterpolatedData("emo:dyn/xlr_timer");
        tas.render();
    }
    if (renderLayer == "CHESTPLATE") {
        jetray.opacity = entity.getInterpolatedData("emo:dyn/jetray_timer");
        jetray.render();
    }
    if (renderLayer == "CHESTPLATE") {
        korku.opacity = entity.getInterpolatedData("emo:dyn/iguana_timer");
        korku.render();
    }
    if (renderLayer == "CHESTPLATE") {
        korku2.opacity = entity.getInterpolatedData("fiskheroes:flying");
        korku2.render();
    }
    if (renderLayer == "CHESTPLATE") {
        ates.opacity = entity.getInterpolatedData("emo:dyn/ates_timer");
        ates.render();
    }
    if (entity.getData("fiskheroes:flying") > 0.6) {
        wings.render();
    } 
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:gliding");
        web_wings.render();
    }
    omnitrix.opacity = !entity.getData('emo:dyn/insanazor_timer') && !entity.getData('emo:dyn/xlr_timer') && !entity.getData('emo:dyn/jetray_timer') && !entity.getData('emo:dyn/iguana_timer') && !entity.getData('emo:dyn/ates_timer');
    omnitrix.render();

    glow.opacity = entity.getData('emo:dyn/insanazor_timer') > 0 && entity.getData('emo:dyn/insanazor_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/xlr_timer') > 0 && entity.getData('emo:dyn/xlr_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/jetray_timer') > 0 && entity.getData('emo:dyn/jetray_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/iguana_timer') > 0 && entity.getData('emo:dyn/iguana_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/ates_timer') > 0 && entity.getData('emo:dyn/ates_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/waybig_timer') > 0 && entity.getData('emo:dyn/waybig_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/hayalet_timer') > 0 && entity.getData('emo:dyn/hayalet_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/echo_timer') > 0 && entity.getData('emo:dyn/echo_timer') < 1;
    glow.render();
}