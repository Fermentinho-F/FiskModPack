extend("fiskheroes:hero_basic");
loadTextures({
    "base": "zaro:shazam/shazam_base",
    "lights": "zaro:shazam/shazam_lights",
    "cape": "zaro:shazam/shazam_cape",
    "null": "zaro:null"
});
var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

var sha;
var sha2;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand() && renderLayer == "CHESTPLATE") {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "null" : timer < 1 ? "base" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer)=> {
        if (!entity.isDisplayStand() && renderLayer == "CHESTPLATE") {
            var timer = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
            return timer == 0 ? "null" : timer < 1 ? "lights" : "lights";
        }
        return "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    cape = capes.createDefault(renderer, 17, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;
  
  utils.bindBeam(renderer, "fiskheroes:charged_beam", "zaro:shazam_beam","body", 0x74BEFF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0],"anchor": "rightArm" },
        { "firstPerson": [4.5, 3.75, -8.0], "offset": [0.5, 9.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
    ]);  

 utils.bindBeam(renderer, "fiskheroes:energy_projection", "zaro:shazam_beam", "body", 0x74BEFF, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

 utils.bindBeam(renderer, "fiskheroes:lightning_cast", "zaro:shazam_beam", "rightArm", 0x74BEFF, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);

    utils.bindTrail(renderer, "fiskheroes:shazam");

    utils.bindTrail(renderer, "zaro:shazam_transform").setCondition(entity => entity.getData("fiskheroes:dyn/nanite_timer") < 1
        && entity.getData("fiskheroes:dyn/nanite_timer") > 0);

    utils.bindParticles(renderer, "zaro:shazam_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') > 0 && entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') < 1);
     utils.bindParticles(renderer, "zaro:shazam_transform").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') > 0 && entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') < 1);
    utils.bindParticles(renderer, "zaro:shazam").setCondition(entity => entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') > 0 && entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') < 1);

var sha2 = renderer.createResource("BEAM_RENDERER", "zaro:shazam_beam");


   sha = utils.createLines(renderer, sha2, 0x74BEFF, [
        {"start": [0, 0.5, 0], "end": [0.0, 0.7, 0.0], "size": [20.0, 20.0]},
    ]);
    sha.anchor.set("body");
    sha.setOffset(1.0, 10.0, 0.0).setRotation(180.0, 0.0, 10.0).setScale(20.0, 15000.0, 20.0);
    sha.mirror = false;
		
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:dual_aiming", "fiskheroes:beam_charge");

    utils.addFlightAnimation(renderer, "shazam.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "shazam.HOVER", "fiskheroes:flight/idle/default");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("fiskheroes:dyn/nanite_timer") || entity.isDisplayStand()) {
        if (renderLayer == "CHESTPLATE") {

            if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
                cape.render(entity);
            }
        }
    }
}
