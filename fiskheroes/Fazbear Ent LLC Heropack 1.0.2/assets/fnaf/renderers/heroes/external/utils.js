function createHeadWithJumpscare(renderer, model, texture, lights, eyes, animation, unlit) {
    var model_head = renderer.createResource("MODEL", model);
    var model_head2 = renderer.createResource("MODEL", model);

    var head = renderer.createEffect("fiskheroes:model").setModel(model_head);
    head.anchor.set("head");
    model_head.texture.set(texture, lights);
    var head2 = renderer.createEffect("fiskheroes:model").setModel(model_head2);
    head2.anchor.set("head");
    model_head2.texture.set(texture, eyes);

    model_head.bindAnimation(animation).setData((entity, data) => {
        var f = entity.getInterpolatedData("fnaf:dyn/jumpscare_timer") * 2.0;
        data.load(f);
    });
    model_head2.bindAnimation(animation).setData((entity, data) => {
        var f = entity.getInterpolatedData("fnaf:dyn/jumpscare_timer") * 2.0;
        data.load(f);
    });
    
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = 0.515 * entity.getInterpolatedData("fnaf:dyn/jumpscare_timer");
        return true;
    });

    return {
        render: (entity, renderLayer, isFirstPersonArm) => {
            if (entity.getData("fnaf:dyn/music_box")) {
                if ((entity.ticksExisted() * 6 % 8) | 0) {
                    model_head.texture.set(unlit, null)
                } else {
                    model_head.texture.set(texture, lights)
                }
            } else {
                model_head.texture.set(texture, lights)
            }
            if (entity.getData("fnaf:dyn/jumpscare")) {
                head2.render();
            } else {
                head.render();
            }
        }
    }
}

function createRabbitHeadWithJumpscare(renderer, model, texture, lights, eyes, animation) {
    var model_head = renderer.createResource("MODEL", model);
    var model_head2 = renderer.createResource("MODEL", model);

    var head = renderer.createEffect("fiskheroes:model").setModel(model_head);
    head.anchor.set("head");
    model_head.texture.set(texture, lights);
    var head2 = renderer.createEffect("fiskheroes:model").setModel(model_head2);
    head2.anchor.set("head");
    model_head2.texture.set(texture, eyes);

    model_head.bindAnimation(animation).setData((entity, data) => {
        var f = entity.getInterpolatedData("fnaf:dyn/jumpscare_timer") * 2.0;
        data.load(0, f);
        data.load(1, entity.isSneaking());
    });
    model_head2.bindAnimation(animation).setData((entity, data) => {
        var f = entity.getInterpolatedData("fnaf:dyn/jumpscare_timer") * 2.0;
        data.load(0, f);
        data.load(1, entity.isSneaking());
    });
    
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = 0.515 * entity.getInterpolatedData("fnaf:dyn/jumpscare_timer");
        return true;
    });


    return {
        render: (entity, renderLayer, isFirstPersonArm) => {
            if (entity.getData("fnaf:dyn/jumpscare")) {
                head2.render();
            } else {
                head.render();
            }
        }
    }
}

function createClassicBody(renderer, texture, lights) {
    var body;

    var l_arm;
    var r_arm;

    var l_leg;
    var r_leg;


    var model_l_arm = renderer.createResource("MODEL", "fnaf:FNAFLeftArm");

    model_l_arm.texture.set(texture, lights);
    l_arm = renderer.createEffect("fiskheroes:model").setModel(model_l_arm);
    l_arm.anchor.set("leftArm");

    var model_r_arm = renderer.createResource("MODEL", "fnaf:FNAFRightArm");

    model_r_arm.texture.set(texture, lights);
    r_arm = renderer.createEffect("fiskheroes:model").setModel(model_r_arm);
    r_arm.anchor.set("rightArm");

    var model_l_leg = renderer.createResource("MODEL", "fnaf:FNAFLeftLeg");

    model_l_leg.texture.set(texture, lights);
    l_leg = renderer.createEffect("fiskheroes:model").setModel(model_l_leg);
    l_leg.anchor.set("leftLeg");

    var model_r_leg = renderer.createResource("MODEL", "fnaf:FNAFRightLeg");

    model_r_leg.texture.set(texture, lights);
    r_leg = renderer.createEffect("fiskheroes:model").setModel(model_r_leg);
    r_leg.anchor.set("rightLeg");

    var model_body = renderer.createResource("MODEL", "fnaf:FNAFBody");

    model_body.texture.set(texture, lights);
    body = renderer.createEffect("fiskheroes:model").setModel(model_body);
    body.anchor.set("body");

    return {
        render: (entity, renderLayer, isFirstPersonArm) => {
            if (!isFirstPersonArm && renderLayer == "HELMET") {

                body.render();

                l_arm.render();

                l_leg.render();
                r_leg.render();
            }
            if (renderLayer == "HELMET") {
                r_arm.render();
            }
        }
    }
}

function createClassicFoxyBody(renderer, texture, lights) {
    var body;

    var l_arm;
    var r_arm;

    var l_leg;
    var r_leg;


    var model_l_arm = renderer.createResource("MODEL", "fnaf:foxyLeftArm");

    model_l_arm.texture.set(texture, lights);
    l_arm = renderer.createEffect("fiskheroes:model").setModel(model_l_arm);
    l_arm.anchor.set("leftArm");

    var model_r_arm = renderer.createResource("MODEL", "fnaf:foxyRightArm");

    model_r_arm.texture.set(texture, lights);
    r_arm = renderer.createEffect("fiskheroes:model").setModel(model_r_arm);
    r_arm.anchor.set("rightArm");

    var model_l_leg = renderer.createResource("MODEL", "fnaf:foxyLeftLeg");

    model_l_leg.texture.set(texture, lights);
    l_leg = renderer.createEffect("fiskheroes:model").setModel(model_l_leg);
    l_leg.anchor.set("leftLeg");

    var model_r_leg = renderer.createResource("MODEL", "fnaf:foxyRightLeg");

    model_r_leg.texture.set(texture, lights);
    r_leg = renderer.createEffect("fiskheroes:model").setModel(model_r_leg);
    r_leg.anchor.set("rightLeg");

    var model_body = renderer.createResource("MODEL", "fnaf:foxyBody");

    model_body.texture.set(texture, lights);
    body = renderer.createEffect("fiskheroes:model").setModel(model_body);
    body.anchor.set("body");

    return {
        render: (entity, renderLayer, isFirstPersonArm) => {
            r_arm.setOffset(0, 0 , 0)
            l_arm.setOffset(0, 0 , 0)

            if (entity.as("DISPLAY").getDisplayType() == "DATABASE_PREVIEW" || entity.as("DISPLAY").getDisplayType() == "FABRICATOR_PREVIEW" ||entity.as("DISPLAY").getDisplayType() == "FABRICATOR_RESULT" || entity.as("DISPLAY").getDisplayType() == "ITERATOR_PREVIEW") {
                r_arm.setOffset(-0.5, 0 , 0)
                l_arm.setOffset(0.5, 0 , 0)
            }

            if (renderLayer == "HELMET") {
                r_arm.render();
            if (!isFirstPersonArm) {
                body.render();

                l_arm.render();

                l_leg.render();
                r_leg.render();
            }
        }

        }
    }
}