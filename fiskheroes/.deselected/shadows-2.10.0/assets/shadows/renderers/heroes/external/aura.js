function model(renderer, utils, texture) {
    var head;
    var body;
    var arms;
    var legs;

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "shadows:aura/Head", null, texture));
    head.anchor.set("head");

    body = renderer.createEffect("fiskheroes:model");
    body.setModel(utils.createModel(renderer, "shadows:aura/Body", null, texture));
    body.anchor.set("body");

    arms = renderer.createEffect("fiskheroes:model");
    arms.setModel(utils.createModel(renderer, "shadows:aura/RightArm", null, texture));
    arms.anchor.set("rightArm");
    arms.mirror = true;

    legs = renderer.createEffect("fiskheroes:model");
    legs.setModel(utils.createModel(renderer, "shadows:aura/RightLeg", null, texture));
    legs.anchor.set("rightLeg");
    legs.mirror = true;



    return {
        head: head,
        bodx: body,
        arms: arms,
        legs: legs,
        render: (overall_opacity) => {
            if (overall_opacity != undefined) {
                head.opacity = overall_opacity;
                body.opacity = overall_opacity;
                arms.opacity = overall_opacity;
                legs.opacity = overall_opacity;

            }
            head.render();
            body.render();
            arms.render();
            legs.render();
        }

    };
}
