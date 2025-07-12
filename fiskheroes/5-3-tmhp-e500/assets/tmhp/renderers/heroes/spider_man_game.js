extend("fiskheroes:spider_man");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/ps4/layer1",
    "layer2": "tmhp:marvel/spider_verse/peter/ps4/layer2"
});
function init(renderer) {
    parent.init(renderer);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
        "fiskheroes:swing_rotate_right", "fiskheroes:swing_rotate_right1"
    ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
        "fiskheroes:swing_rotate_left", "fiskheroes:swing_rotate_left1"
    ]);
}