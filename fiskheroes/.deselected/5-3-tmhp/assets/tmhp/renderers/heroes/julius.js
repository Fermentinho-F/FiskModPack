extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:black_clover/julius_layer1",
    "layer2": "tmhp:black_clover/julius_layer2",
    "mark": "tmhp:black_clover/julius_mark",
    "grimoire": "tmhp:black_clover/julius_grimoire"
});

var body_lines = implement("fiskheroes:external/body_lines");
var utils = implement("fiskheroes:external/utils");
var mark;
var grimoire;
var spell;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}
function initEffects(renderer) {
    mark = renderer.createEffect("fiskheroes:overlay");
    mark.texture.set("mark");
    grimoire = renderer.createEffect("fiskheroes:model");
    grimoire.setModel(utils.createModel(renderer, "tmhp:black_clover/coverless_grimoire", "grimoire"));
    grimoire.anchor.set("body");
    grimoire.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "rightArm", 0x0088FF, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [6.0, 6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var color = 0x0088FF;
    var tao_mandala = renderer.createResource("SHAPE", "tmhp:beam");
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");
    spell = renderer.createEffect("fiskheroes:lines").setShape(tao_mandala).setRenderer(beam);
    spell.color.set(color);
    spell.setOffset(-5.0, 5.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(20.0);
    spell.anchor.set("rightArm");
    spell.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "body", 0x0088FF, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [6.0, 6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0x0088FF);

    time_orb = body_lines.create(renderer, "tmhp:rasengan", 0x0088FF, [
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [4.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-2.0, 7.5, -6.0], "end": [-9.0, 7.5, -6.0], "size": [8.0, 8.0] }
        ]}
    ]);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
      mark.opacity = !entity.getData("tmhp:dyn/regen_timer");
      mark.render();
      spell.progress = entity.getInterpolatedData("fiskheroes:beam_charge");
      spell.render();
      grimoire.opacity = entity.getInterpolatedData("tmhp:dyn/grimoire_timer");
      grimoire.render();
    }
    glow.opacity = entity.getData("fiskheroes:teleport_timer");
    glow.render();

    if (entity.getData('fiskheroes:cryo_charge')) {
       time_orb.opacity = time_orb.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
       time_orb.progress /= Math.sqrt(entity.getData('fiskheroes:cryo_charge') > 0) * 2;
       time_orb.render(renderLayer);
    }
}