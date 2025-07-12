extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "loriatpack:justice_legaue/green_arrow/green_arrow_layer1",
    "layer2": "loriatpack:justice_legaue/green_arrow/green_arrow_layer2",
    "arrow": "loriatpack:justice_legaue/green_arrow/greenarrow",
    "quiver": "loriatpack:justice_legaue/green_arrow/quiver_ga",
	"bow": "loriatpack:justice_legaue/green_arrow/bow_ga"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("loriatpack:dyn/mask_open_timer") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
	utils.addLivery(renderer, "COMPOUND_BOW", "bow");
}

function initAnimations(renderer) {
	addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("loriatpack:dyn/mask_open_timer");
            data.load(f < 1 ? f : 0);
        });
}