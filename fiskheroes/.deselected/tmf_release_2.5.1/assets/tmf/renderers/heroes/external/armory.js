function createModel(renderer, modelType, texture, textureLights) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	model.bindAnimation("tmf:other/armory").setData((entity, data) => {
		data.load(entity.getInterpolatedData('fiskheroes:mask_open_timer2'));
		});

    return model;
}