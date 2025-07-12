extend("tmhp:hero_assassin");
loadTextures({
    "mask": "tmhp:assassin/jacop_mask_open",
    "chest": "tmhp:assassin/jacop_chest",
    "legs": "tmhp:assassin/jacop_legs",
    "boots": "tmhp:assassin/jacop_boots",
    "hidden_blade": "tmhp:assassin/weapons/hidden_blade",
    "hook": "tmhp:randy_cunningham/weapons/chain",
    "null": "tmhp:null"
});

function initEffects(renderer) {
    parent.initEffects(renderer);
    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureRope.set("hook");
    webs.textureRopeBase.set("null");
    webs.textureLarge.set("null");
}