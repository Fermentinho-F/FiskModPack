extend("fiskheroes:spider_man_base");
loadTextures({
    "base": "jmctheroes:venom/venom",
    "suit": "jmctheroes:venom/venom_suit.tx.json",
    "mask": "jmctheroes:venom/venom_mask.tx.json",
    "blank": "jmctheroes:blank",
    "blade": "jmctheroes:venom/venom_arm",
    "shield": "jmctheroes:venom/venom_shield",
    "web_small": "jmctheroes:webs/black_web_small",
    "web_large": "jmctheroes:webs/black_web_large",
    "web_rope": "jmctheroes:webs/black_web_rope"
});

var utils = implement("fiskheroes:external/utils");

var blade;
var shield;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer") > 0) {
            return "mask";
        } else if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/symbiote_timer");
            return timer == 0 ? "blank" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });


    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

    var rightmodel = renderer.createResource("MODEL", "jmctheroes:VenomRightArm");
    rightmodel.texture.set("blade");
    rightmodel.bindAnimation("jmctheroes:venom/VenomRightArm").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/hit_timer"));
    }).priority = -1;
    
    rightblade = renderer.createEffect("fiskheroes:model").setModel(rightmodel);
    rightblade.anchor.set("rightArm");

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("shield");
    shield.anchor.set("rightArm");
    shield.setRotation(0.0, 0.0, -10.0).setCurve(15.0, 35.0).setOffset(4.7, 6.0, 0.0);
    shield.large = true;

    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureSmall.set("web_small");
    webs.textureRope.set("web_rope");
    webs.textureRopeBase.set("web_small");
    webs.textureLarge.set("web_large");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "venom.TENDRIL", "jmctheroes:venom/VenomBlade").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/hit_timer"));
    });
}
function render(entity, renderLayer, isFirstPersonArm){

    rightblade.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
    rightblade.render();
    //leftblade.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
    //leftblade.render();

    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield.render();
}