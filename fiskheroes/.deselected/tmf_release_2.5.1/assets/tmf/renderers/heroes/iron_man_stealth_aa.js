extend("tmf:iron_man_mk1_aa");
loadTextures({
	"null": "tmf:null",
	"mask": "tmf:mk1/iron_man_mk1_aa_mask",
	"layer1": "tmf:stealth/iron_man_stealth_mk1_aa_layer1",
	"layer2": "tmf:stealth/iron_man_stealth_mk1_aa_layer2",
	"suit_lights": "tmf:stealth/iron_man_stealth_mk1_aa_lights"
});

var armoryT = implement("tmf:external/armory");

function init(renderer) {
    parent.init(renderer);

    renderer.setItemIcons("iron_man_mk1_aa_0", "%s_1", "iron_man_mk1_aa_2", "iron_man_mk1_aa_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);

    armory = renderer.createEffect("fiskheroes:model");
		armory.setModel(armoryT.createModel(renderer, "tmf:other/armory", "armory"));
		armory.anchor.set("body");
		armory.setScale(1.2);
		armory.setOffset(0,-4,-1.2);
	
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
            return 1 - 0.95*entity.getInterpolatedData('tmf:dyn/stealth_timer');
    });

}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
	if (entity.isDisplayStand() && entity.world().getBlock(entity.pos().add(0, -1, 0)) == "fiskheroes:titanium_block") {		
		armory.render();
	}
}