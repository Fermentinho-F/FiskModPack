function createModelVents(renderer, modelType, texture, textureLights, anim) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	
	model.bindAnimation(anim).setData((entity, data) => {
		data.load(0, entity.getInterpolatedData('uhp:dyn/transformation_timer'));
		});

    return model;
}

function createModelDots1(renderer, modelType, texture, textureLights, anim, anim2) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	
	model.bindAnimation(anim).setData((entity, data) => {
		data.load(0, entity.getInterpolatedData('uhp:dyn/transformation_timer'));
		});
	model.bindAnimation(anim2).setData((entity, data) => {
		data.load(0, entity.loop(35));
		});

    return model;
}

function createModelDots2(renderer, modelType, texture, textureLights, anim, anim2, anim3) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	
	model.bindAnimation(anim).setData((entity, data) => {
		data.load(0, entity.getInterpolatedData('uhp:dyn/transformation_timer'));
		});
	model.bindAnimation(anim2).setData((entity, data) => {
		data.load(0, entity.loop(15));
		});
	model.bindAnimation(anim3).setData((entity, data) => {
		data.load(0, entity.loop(35));
		});

    return model;
}

function createModelDots3(renderer, modelType, texture, textureLights, anim, anim2) {
    var model = renderer.createResource("MODEL", modelType);

    if (typeof textureLights !== "undefined") {
        model.texture.set(texture, textureLights);
    }
    else {
        model.texture.set(texture);
    }
	
	model.bindAnimation(anim).setData((entity, data) => {
		data.load(0, entity.loop(20));
		});
	model.bindAnimation(anim2).setData((entity, data) => {
		data.load(0, entity.loop(35));
		});

    return model;
}