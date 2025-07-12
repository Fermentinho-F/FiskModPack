extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:black_clover/yami_layer1",
    "layer2": "tmhp:black_clover/yami_layer2",

    "grimoire": "tmhp:black_clover/yami_grimoire",
    "katana": "tmhp:black_clover/katana"
});

var utils = implement("fiskheroes:external/utils");
var grimoire;
var grimoire_pocket;

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "tmhp:black_slash", "rightArm", 0x000000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.0, 11.0] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:black_slash", "rightArm", 0x000000, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]).setCondition(entity => !entity.isSneaking());
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:black_slash", "rightArm", 0x6622FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]).setCondition(entity => entity.isSneaking());
    utils.bindParticles(renderer, "tmhp:black_slash").setCondition(entity => entity.getData('fiskheroes:energy_charging') > 0);
    utils.bindParticles(renderer, "tmhp:black_blade").setCondition(entity => entity.getData('tmhp:dyn/electrical') > 0);

    utils.addLivery(renderer, "KATANA", "katana");

    grimoire = renderer.createEffect("fiskheroes:model");
    grimoire.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire", "grimoire"));
    grimoire.anchor.set("body");
    grimoire.mirror = false;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.4, "offset": [4.3, 11.5, -2.2], "rotation": [-122.0, 0.0, 0.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
   if (renderLayer == "CHESTPLATE") {
        grimoire.opacity = entity.getInterpolatedData("tmhp:dyn/grimoire_timer");
        grimoire.render();
   }
}