extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "omnitrix": "emo:saatler/recalibreomnitrixtabula",
    "ulti": "emo:saatler/recalibreomnitrixtabula",
    "icicle": "fiskheroes:killer_frost_icicle",
    "hands": "fiskheroes:killer_frost_earth2_hands",
    "arka": "emo:omni",
});

var utils = implement("fiskheroes:external/utils");

var omnitrix;
var ulti;
var overlay;
var spikeL;
var spikeR;
var glow;
var arka;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    omnitrix = renderer.createEffect("fiskheroes:model");
    omnitrix.setModel(utils.createModel(renderer, "emo:recalibratetabulabackup", "omnitrix"));
    omnitrix.anchor.set("rightArm");
    omnitrix.mirror = false;

    ulti = renderer.createEffect("fiskheroes:model");
    ulti.setModel(utils.createModel(renderer, "emo:omniulti", "ulti"));
    ulti.anchor.set("body");
    ulti.setOffset(-0.3, -1.5, -2.0).setScale(0.3);
    
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
    glow.color.set(0x00FF23);

    arka = renderer.createEffect("fiskheroes:model");
    arka.setModel(utils.createModel(renderer, "emo:arka", "arka"));
    arka.anchor.set("body");
    arka.mirror = false;


    yok = renderer.createEffect("fiskheroes:overlay");
    yok.texture.set("yok");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "emo:omnitrix").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindParticles(renderer, "fiskheroes:firestorm").setCondition(entity => entity.getData("fiskheroes:gliding"));
    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0x00FF23, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "head", 0x40E7F9, [
        { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "body", 0x00FF23, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x00FF23, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
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
    if (entity.getData("emo:dyn/insanazor") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/xlr") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/jetray") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/iguana") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/ates") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/waybig") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/hayalet") > 0.6) {
        ulti.render();
    } 
    if (entity.getData("emo:dyn/echo") > 0.6) {
        ulti.render();
    } 
    omnitrix.opacity = !entity.getData('emo:dyn/insanazor') && !entity.getData('emo:dyn/xlr') && !entity.getData('emo:dyn/jetray') && !entity.getData('emo:dyn/iguana') && !entity.getData('emo:dyn/ates') && !entity.getData('emo:dyn/waybig') && !entity.getData('emo:dyn/hayalet') && !entity.getData('emo:dyn/echo');
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

    arka.opacity = entity.getData('emo:dyn/insanazor_timer') > 0 && entity.getData('emo:dyn/insanazor_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/xlr_timer') > 0 && entity.getData('emo:dyn/xlr_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/jetray_timer') > 0 && entity.getData('emo:dyn/jetray_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/iguana_timer') > 0 && entity.getData('emo:dyn/iguana_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/ates_timer') > 0 && entity.getData('emo:dyn/ates_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/waybig_timer') > 0 && entity.getData('emo:dyn/waybig_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/hayalet_timer') > 0 && entity.getData('emo:dyn/hayalet_timer') < 1;
    arka.render();

    arka.opacity = entity.getData('emo:dyn/echo_timer') > 0 && entity.getData('emo:dyn/echo_timer') < 1;
    arka.render();
}