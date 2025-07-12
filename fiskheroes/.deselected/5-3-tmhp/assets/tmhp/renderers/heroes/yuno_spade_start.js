extend("tmhp:yuno_spade");
loadTextures({
    "layer1": "tmhp:black_clover/yuno/prespade_layer1",
    "layer2": "tmhp:black_clover/yuno/prets_layer2",
    "cape": "tmhp:black_clover/yuno/prespade_cape",
    "cape_glow": "tmhp:black_clover/yuno/prespade_cape_glow.tx.json",
    "spiritdive": "tmhp:black_clover/yuno/spiritdive_prespade",
    "grimoire_pocket": "tmhp:black_clover/grimoire_pocket",
    "grimoire_pocket_glow": "tmhp:black_clover/yuno/grimoire_pocket_glow"
});

var utils = implement("fiskheroes:external/utils");
var grimoire;
var grimoire_pocket;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "%s_1", "yuno_2", "yuno_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    grimoire_pocket = renderer.createEffect("fiskheroes:model");
    grimoire_pocket.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire_pocket", "grimoire_pocket"));
    grimoire_pocket.anchor.set("body");
    grimoire_pocket.mirror = false;

    grimoire_pocket_glow = renderer.createEffect("fiskheroes:model");
    grimoire_pocket_glow.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire_pocket", null, "grimoire_pocket_glow"));
    grimoire_pocket_glow.anchor.set("body");
    grimoire_pocket_glow.mirror = false;
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (renderLayer == "CHESTPLATE") {
        grimoire_pocket.opacity = !entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer");
        grimoire_pocket.render();

        grimoire_pocket_glow.opacity = entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer");
        grimoire_pocket_glow.render();
    }
}