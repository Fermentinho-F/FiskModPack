function createModel(renderer, modelType, texture, textureLights) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	model.bindAnimation("tmf:other/backpack_mk1").setData((entity, data) => {
		data.load(0, entity.getInterpolatedData('tmf:dyn/transform_timer'));
		});

    return model;
}