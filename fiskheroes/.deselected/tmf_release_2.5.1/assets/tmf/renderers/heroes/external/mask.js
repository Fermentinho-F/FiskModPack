function createModel(renderer, modelType, texture, textureLights) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	model.bindAnimation("tmf:other/mask").setData((entity, data) => {
		data.load(0, (entity.isDisplayStand() && entity.world().getBlock(entity.pos().add(0, -1, 0)) == "fiskheroes:titanium_block") ? 0 : entity.getInterpolatedData('fiskheroes:mask_open_timer2'));
		});

    return model;
}