extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "moopack:odmgear/odmgear_layer1",
    "layer2": "moopack:odmgear/odmgear_layer2",
    "web_small": "moopack:threedmaneuvergear/line_web",
    "web_rope": "moopack:threedmaneuvergear/line_rope",
    "odmgear": "moopack:odmgear/odmgear",
    "odmleftleg": "moopack:odmgear/odmleftleg",
    "odmrightleg": "moopack:odmgear/odmrightleg",
    "lefthandle": "moopack:odmgear/antititansword",
    "righthandle": "moopack:odmgear/antititansword",
    "pistol": "moopack:odmgear/pistol"
});

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {

    utils.addLivery(renderer, "fisktag:weapon{WeaponType:fisktag:pistols}", "pistol");

	var webs = renderer.bindProperty("fiskheroes:webs");
	webs.textureSmall.set(null, "web_small");
	webs.textureRope.set(null, "web_rope");
	webs.textureRopeBase.set(null, "web_small");

    var model = renderer.createResource("MODEL", "moopack:odmgear");
    model.texture.set("odmgear");
    odmgear = renderer.createEffect("fiskheroes:model").setModel(model);
    odmgear.setOffset(0, 9.0, -2.5)
    odmgear.setScale(1.0);
    odmgear.anchor.set("torso");

    var model = renderer.createResource("MODEL", "moopack:odmleftleg");
    model.texture.set("odmleftleg");
    odmleftleg = renderer.createEffect("fiskheroes:model").setModel(model);
    odmleftleg.setOffset(2.0, -5.0, -2.5)
    odmleftleg.setScale(1.0);
    odmleftleg.anchor.set("leftLeg");

    var model = renderer.createResource("MODEL", "moopack:odmrightleg");
    model.texture.set("odmrightleg");
    odmrightleg = renderer.createEffect("fiskheroes:model").setModel(model);
    odmrightleg.setOffset(-1.0, -5.0, -2.5)
    odmrightleg.setScale(1.0);
    odmrightleg.anchor.set("rightLeg");

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
/*
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.675, "offset": [-5.5, 13.0, -8.75], "rotation": [67.5, 180.0, 180.0] },
        { "anchor": "body", "scale": 0.675, "offset": [5.5, 13.0, -8.75], "rotation": [67.5, 180.0, 180.0] }
    ]).slotIndex = 0;*/
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && !isFirstPersonArm) {
        odmgear.render();
        }
    if (renderLayer == "CHESTPLATE" && entity.getHeldItem().isEmpty()) {
        lefthandle.render();
        righthandle.render();
        }
    if (renderLayer == "LEGGINGS" && !isFirstPersonArm) {
            odmleftleg.render();
            odmrightleg.render();
        }
}
