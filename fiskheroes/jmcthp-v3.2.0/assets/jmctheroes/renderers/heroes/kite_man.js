extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:kite/kite_man_layer1",
    "layer2": "jmctheroes:kite/kite_man_layer2",
    "kite": "jmctheroes:kite/kite"
});

function initEffects(renderer) {
var kite = renderer.createResource("MODEL", "jmctheroes:kite");
kite.texture.set("kite");
kite_render = renderer.createEffect("fiskheroes:model").setModel(kite);
kite_render.anchor.set("body");

}
function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.isWearingFullSuit()) {
        if (entity.getData("fiskheroes:gliding")) {kite_render.render();}
    }
}