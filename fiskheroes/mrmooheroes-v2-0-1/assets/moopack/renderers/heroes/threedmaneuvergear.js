extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "moopack:threedmaneuvergear/threed_gear_layer1",
    "layer2": "moopack:threedmaneuvergear/threed_gear_layer2",
    "web_small": "moopack:threedmaneuvergear/line_web",
    "web_rope": "moopack:threedmaneuvergear/line_rope",
    "threedgear": "moopack:threedmaneuvergear/threedgear",
    "lefthandle": "moopack:apodmgear/antititansword",
    "righthandle": "moopack:apodmgear/antititansword"
});

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set(null, "web_small");
	webs.textureRope.set(null, "web_rope");
	webs.textureRopeBase.set(null, "web_small");

    var model = renderer.createResource("MODEL", "moopack:threedgear");
    model.texture.set("threedgear");
    threedgear = renderer.createEffect("fiskheroes:model").setModel(model);
    threedgear.setOffset(0, 9.0, -2.5)
    threedgear.setScale(1.0);
    threedgear.anchor.set("torso");

    var model = renderer.createResource("MODEL", "moopack:lefthandle");
    model.texture.set("lefthandle");
    lefthandle = renderer.createEffect("fiskheroes:model").setModel(model);
    lefthandle.setOffset(-1.0, 10.0, -7.5)
    lefthandle.setRotation(-90.0, 180.0, -180.0)
    lefthandle.setScale(1.0);
    lefthandle.anchor.set("leftArm");

    var model = renderer.createResource("MODEL", "moopack:righthandle");
    model.texture.set("righthandle");
    righthandle = renderer.createEffect("fiskheroes:model").setModel(model);
    righthandle.setOffset(1.0, 10.0, -7.5)
    righthandle.setRotation(-90.0, 180.0, -180.0)
    righthandle.setScale(1.0);
    righthandle.anchor.set("rightArm");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.675, "offset": [-5.5, 13.0, -8.75], "rotation": [67.5, 180.0, 180.0] },
        { "anchor": "body", "scale": 0.675, "offset": [5.5, 13.0, -8.75], "rotation": [67.5, 180.0, 180.0] }
    ]).slotIndex = 0;/*
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;*/
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && !isFirstPersonArm) {
        threedgear.render();
        }
    if (renderLayer == "CHESTPLATE" && entity.getHeldItem().isEmpty()) {
        lefthandle.render();
        righthandle.render();
    }
}
