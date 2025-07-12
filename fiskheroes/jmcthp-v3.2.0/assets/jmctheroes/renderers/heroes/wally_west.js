extend("fiskheroes:hero_basic");
loadTextures({
    "base": "jmctheroes:ww/wally_west",
    "suit": "jmctheroes:ww/wally_west_suit.tx.json",
    "lights": "jmctheroes:ww/wally_west_lights",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");

var vibration;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
            var timer = entity.getInterpolatedData('jmctheroes:dyn/suit_timer');
            return timer == 0 ? "blank" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        return (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") && entity.getInterpolatedData('jmctheroes:dyn/suit_timer') < 1 ? "blank" : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    vibration = renderer.createEffect("fiskheroes:vibration");
    
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xF3F3F3, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 7.0, 0.0], "size": [1.5, 1.5] }
    ]);
    utils.bindTrail(renderer, "jmctheroes:lightning_ww");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getInterpolatedData('jmctheroes:dyn/vibrate') == 1 && entity.getInterpolatedData('fiskheroes:speeding') && entity.getInterpolatedData('jmctheroes:dyn/suit')) {
        vibration.render();
    }
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "speedster.SPRINT", "fiskheroes:speedster_sprint").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    });
}
