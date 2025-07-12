extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:sinister_strange",
    "layer2": "zaro:sinister_strange"
});

var utils = implement("fiskheroes:external/utils");
var mandalas = implement("fiskheroes:external/tao_mandalas");
var eldritch_sword = implement("fiskheroes:external/eldritch_sword");


var tao_mandalas;

var sword;
var spell;


function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

    var color = 0xC724B1;
    var tao_mandala = renderer.createResource("SHAPE", "fiskheroes:tao_mandala");
    var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:line");
    spell = renderer.createEffect("fiskheroes:lines").setShape(tao_mandala).setRenderer(beam);
    spell.color.set(color);
    spell.setOffset(1.0, 8.0, 0.0).setScale(3.2);
    spell.anchor.set("rightArm");
    spell.mirror = true;
    shield = mandalas.create(renderer, color, tao_mandala, beam);

    shield_idle = renderer.createEffect("fiskheroes:lines").setShape(tao_mandala).setRenderer(beam);
    shield_idle.setOffset(1.0, 11.0, 0.0).setRotation(0.0, 0.0, 10.0).setScale(4.8);
    shield_idle.color.set(color);
    shield_idle.anchor.set("rightArm");
    shield_idle.mirror = true;



    sword = eldritch_sword.create(renderer, color, beam);
    sword.setOffset(1.0, 9.4, -4.0).setRotation(10.0, 0.0, 0.0).setScale(16.0);

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(0xC724B1);
    magic.colorEarthCrack.set(0xC724B1);
    magic.colorAtmosphere.set(0xC724B1);
    magic.colorWhip.set(color);
    

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "zaro:sinister_telekenesis");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "zaro:sinister_teleport");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:mysterio_beam", "rightArm", color, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] },
       { "firstPerson": [3.75, 3.0, -8.0], "offset": [0.5, 7.0, 0.0], "size": [1.5, 1.5], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:dual_aiming", "fiskheroes:aiming_timer")
        .priority = 10;
        addAnimationWithData(renderer, "strange.SWORD_POSE", "fiskheroes:sword_pose", "fiskheroes:blade_timer");
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "basic.BLOCKING", "fiskheroes:dual_aiming", "fiskheroes:shield_blocking_timer")
        .priority = -5;
    addAnimationWithData(renderer, "basic.ENERGY_PROJ", "fiskheroes:dual_aiming", "fiskheroes:energy_projection_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        spell.progress = entity.getInterpolatedData("fiskheroes:flight_timer") ||  entity.getInterpolatedData("fiskheroes:energy_projection_timer") || entity.getInterpolatedData("fiskheroes:shield_timer") || entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        spell.render();
        shield_idle.progress = entity.getInterpolatedData("fiskheroes:flight_timer") || entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        shield_idle.render();

        shield.render(entity, isFirstPersonArm);
        
    }
}

function render(entity, renderLayer, isFirstPersonArm) {

    if (renderLayer == "CHESTPLATE") {

        spell.progress = entity.getInterpolatedData("fiskheroes:spellcast_timer");
        spell.render();


        spell.progress = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        spell.render();

        shield.render(entity, isFirstPersonArm);
        sword.render(entity.getInterpolatedData("fiskheroes:blade_timer"));
            }
        }