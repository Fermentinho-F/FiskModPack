extend("fiskheroes:hero_basic");
loadTextures({
    "base": "moopack:assassin_ghost/assassin",
    "lights_white": "moopack:assassin_ghost/assassin_lights_white",
    "lights_blue": "moopack:assassin_ghost/assassin_lights_red",
    "blade": "moopack:assassin_ghost/assassin_blade",
    "blade_white": "moopack:assassin_ghost/assassin_blade_lights_white",
    "blade_blue": "moopack:assassin_ghost/assassin_blade_lights_red",
    "cape": "moopack:assassin_ghost/assassin_cape"
});

var utils = implement("fiskheroes:external/utils");

var capes = implement("fiskheroes:external/capes");

var cape;
var blade;
var blade_model;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => "base");
    //renderer.setLights((entity, renderLayer) => "lights_blue");
    
    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("moopack:dyn/phase_active")) {
            return "lights_blue";
        }
        else if (!entity.getData("moopack:dyn/phase_active")) {
            return "lights_white";
        }
        //return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") && entity.getInterpolatedData("fiskheroes:dyn/nanite_timer") < 1 ? "reactor_lights" : "lights";
    });
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.6;
    physics.flareDegree = 1.5;
    physics.restFlare = 0.2;
    cape = capes.createDefault(renderer, 23, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 16;

    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");

    blade_model = renderer.createResource("MODEL", "fisktag:assassin_blade");
    blade_model.generateMirror();
    blade = renderer.createEffect("fiskheroes:model");
    blade.setOffset(1.0, 8.0, 0.0);
    blade.setModel(blade_model);
    blade.anchor.set("rightArm");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    utils.addFlightAnimation(renderer, "vision.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "vision.HOVER", "fiskheroes:flight/idle/neutral");

    addAnimation(renderer, "assassin.blade", "fisktag:blade_pose")
        .setData((entity, data) => {
            data.load(0, entity.getPunchTimerInterpolated());
            data.load(1, 1);
        })
        .setCondition(entity => entity.getData("fiskheroes:blade"))
        .priority = -10;
    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
}

function render(entity, renderLayer, isFirstPersonArm) {

            //blade_model.texture.set("blade", "blade_blue");
            //blade_model.texture.set("blade", "blade_white");

                if (entity.getData("moopack:dyn/phase_active")) {
                    blade_model.texture.set("blade", "blade_blue");
                }
                else if (!entity.getData("moopack:dyn/phase_active")) {
                    blade_model.texture.set("blade", "blade_white");
                }

    if (entity.getData("fiskheroes:blade")) {
        if (isFirstPersonArm) {
            blade.setRotation(0, 0, 0);
        }
        else {
            var f = Math.sin(Math.PI * entity.getPunchTimerInterpolated());
            blade.setRotation(-f * 20, 0, 0);
        }
        blade.render();
    }
    if (!isFirstPersonArm) {
        cape.render(entity);
    }
}
