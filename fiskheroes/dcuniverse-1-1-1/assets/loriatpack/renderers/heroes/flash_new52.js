extend("loriatpack:flash");
loadTextures({
    "layer1": "loriatpack:justice_legaue/flash/the_flash_new52_layer1",
    "layer2": "loriatpack:justice_legaue/flash/the_flash_new52_layer2",
    "lights": "loriatpack:justice_legaue/flash/the_flash_new52_light",
	"lights_no_helmet": "loriatpack:justice_legaue/flash/the_flash_new52_light_no_helmet"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
        renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:speeding") && !entity.getData("fiskheroes:mask_open")) {
            return renderLayer == "LEGGINGS" ? "lights" : "lights";
        }
		else if (entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:mask_open")) {
            return renderLayer == "LEGGINGS" ? "lights_no_helmet" : "lights_no_helmet";
        }
        return renderLayer == "CHESTPLATE" ? null : null;
    });
}




