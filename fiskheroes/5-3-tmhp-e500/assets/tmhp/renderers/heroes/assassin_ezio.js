extend("tmhp:hero_assassin");
loadTextures({
    "mask": "tmhp:assassin/ezio_mask_open",
    "chest": "tmhp:assassin/ezio_chest",
    "legs": "tmhp:assassin/ezio_legs",
    "legs2": "tmhp:assassin/ezio_legs2",
    "boots": "tmhp:assassin/ezio_boots",
    "cape": "tmhp:assassin/ezio_cape",
    "flying_machine": "tmhp:assassin/flying_machine",
    "hidden_blade": "tmhp:assassin/weapons/hidden_blade"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var flying_machine;

function initEffects(renderer) {
    parent.initEffects(renderer);
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.4;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;

    cape = capes.createGlider(renderer, 24, "fiskheroes:cape_batman.mesh.json", physics);
    cape.effect.texture.set("cape");

    flying_machine = renderer.createEffect("fiskheroes:model");
    flying_machine.setModel(utils.createModel(renderer, "tmhp:flying_machine", "flying_machine"));
    flying_machine.anchor.set("body");
    flying_machine.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && !entity.getData('fiskheroes:dyn/steeled')) {
        cape.render(entity, entity.getInterpolatedData("fiskheroes:wing_animation_timer"));
    }
    else if (renderLayer == "CHESTPLATE") {
        flying_machine.opacity = entity.getInterpolatedData("fiskheroes:dyn/steeled");
        flying_machine.render();
    }
}