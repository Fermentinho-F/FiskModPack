extend("fiskheroes:hero_basic");
loadTextures({
    "base": "tmhp:custom/basic_storage_suit",
    "mask": "tmhp:custom/basic_storage_mask.tx.json",
    "hook": "tmhp:randy_cunningham/weapons/chain",
    "backpack": "tmhp:custom/backpack",
    "null": "tmhp:null"
});

var backpack;
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        return "base";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.setItemIcons("%s_0", "backpack", "%s_2", "%s_3");
    renderer.fixHatLayer("CHESTPLATE");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "iron_man.HOVER", "fiskheroes:flight/idle/iron_man");
    utils.addFlightAnimation(renderer, "atom.FLIGHT", "fiskheroes:flight/propelled.anim.json", (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    });
}


function initEffects(renderer) {
    backpack = renderer.createEffect("fiskheroes:model");
    backpack.setModel(utils.createModel(renderer, "tmhp:backpack", "backpack", null));
    backpack.anchor.set("body");
    backpack.mirror = false;

    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureRope.set("hook");
    webs.textureRopeBase.set("null");
    webs.textureLarge.set("null");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x223399);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:flight_timer") * 1.15;
        return true;
    });
}
function render(entity, renderLayer, isFirstPersonArm) {
    backpack.render();
}