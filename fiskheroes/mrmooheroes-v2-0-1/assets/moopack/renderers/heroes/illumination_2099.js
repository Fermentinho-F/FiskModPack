extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:illumination_2099/illumination_2099_layer1",
    "layer2": "moopack:illumination_2099/illumination_2099_layer2",
    "base": "moopack:illumination_2099/illumination_2099_base",
    "layer1_lights": "moopack:illumination_2099/illumination_2099_lights",
    "layer2_lights": "moopack:illumination_2099/illumination_2099_lights2",
    "cape": "moopack:illumination_2099/illumination_2099_cape",
    "mask": "moopack:illumination_2099/illumination_2099_mask.tx.json",
    "web_small": "moopack:illumination_2099/2099_web",
    "web_large": "moopack:illumination_2099/2099_web_24",
    "web_rope": "moopack:illumination_2099/2099_web_rope"
});

var speedster = implement("fiskheroes:external/speedster_utils");

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights");

    renderer.setTexture((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2" : renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer") > 0 ? "mask" : "layer1");
}

function initEffects(renderer) {

    speedster.init(renderer, "fiskheroes:lightning_red");

    //utils.bindTrail(renderer, "moopack:red_flicker").setCondition(entity => entity.getData("moopack:dyn/phase_active"));

    vibration = renderer.createEffect("fiskheroes:vibration");

	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set("web_small");
	webs.textureLarge.set("web_large");
	webs.textureRope.set("web_rope");
	webs.textureRopeBase.set("web_small");

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

   var beam = renderer.createResource("BEAM_RENDERER", "fiskheroes:mysterio_beam");
   utils.bindBeam(renderer, "fiskheroes:energy_projection", beam, "body", 0xFD003B, [
       { "firstPerson": [0.2, 4, -4.0], "offset": [0.2, 2, -4.0], "size": [5, 1.5] },
   ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (!entity.isDisplayStand() && entity.getData("moopack:dyn/phase_active")) {
        vibration.render();
    }
}
