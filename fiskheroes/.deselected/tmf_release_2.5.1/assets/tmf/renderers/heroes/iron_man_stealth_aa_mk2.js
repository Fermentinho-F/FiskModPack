extend("tmf:iron_man_stealth_aa");
loadTextures({
	"null": "tmf:null",
	"mask": "tmf:stealth/iron_man_stealth_mk2_aa_mask",
	"layer1": "tmf:stealth/iron_man_stealth_mk2_aa_layer1",
	"layer2": "tmf:stealth/iron_man_stealth_mk2_aa_layer2",
	"suit_lights": "tmf:stealth/iron_man_stealth_mk2_aa_lights"
});

function init(renderer) {
    parent.init(renderer);

    renderer.setItemIcons("%s_0", "%s_1", "%s_2", "%s_3");
}
