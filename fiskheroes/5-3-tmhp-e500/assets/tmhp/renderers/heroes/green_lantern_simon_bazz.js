extend("tmhp:green_lantern");
loadTextures({
    "base": "tmhp:dc/lanterns/green/simon_bazz/base",
    "lights": "tmhp:dc/lanterns/green/simon_bazz/lights",
    "suit": "tmhp:dc/lanterns/green/simon_bazz/suit.tx.json",
    "mask": "tmhp:dc/lanterns/green/simon_bazz/mask.tx.json"
});
function init(renderer) {
    parent.init(renderer);
    renderer.fixHatLayer("CHESTPLATE");
}