extend("dmh:dean");
loadTextures({
    "layer1": "dmh:sn/dean/dean_s_l1",
    "layer2": "dmh:sn/dean/dean_s_l2",
    "eyes": "dmh:sn/dean/dean_s+eyes",
    "mark": "dmh:sn/misc/mark_inactive"
});

var mark;

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "eyes";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

}

function initEffects(renderer) {
    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("fiskheroes:mask_open"));

    model_mark = renderer.createResource("MODEL", "dmh:mark_of_cain");
    model_mark.texture.set("mark");

    mark = renderer.createEffect("fiskheroes:model").setModel(model_mark);
    mark.setOffset(-1.3, 3.2, -1);
    mark.setScale(0.2);
    mark.anchor.set("rightArm");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        mark.render();
    }
}
