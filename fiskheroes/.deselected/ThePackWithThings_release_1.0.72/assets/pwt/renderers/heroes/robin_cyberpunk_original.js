extend("pwt:robin_cyberpunk");
loadTextures({
	"mask": "pwt:robin_cyberpunk_original_mask",
	"layer1_lights": "pwt:robin_cyberpunk_original_lights_layer1"

});

function init(renderer) {
    parent.init(renderer);
	renderer.setItemIcons("robin_cyberpunk_original_0", "robin_cyberpunk_1", "robin_cyberpunk_2", "robin_cyberpunk_3");
}