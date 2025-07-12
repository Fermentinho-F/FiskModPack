var lengths = [1.9, 2.55, 2.675, 2.8, 2.9];

function create(renderer, anchor, energyColor) {
    var c1 = renderer.createEffect("fiskheroes:shield");
    c1.texture.set("cannon1", "cannon1_lights");
    c1.anchor.set(anchor);
    c1.setRotation(3.0, 90.0, 3.0).setCurve(30.0, 136.0);
    c1.large = true;

    var c2 = renderer.createEffect("fiskheroes:shield");
    c2.texture.set("cannon2", "cannon2_lights");
    c2.anchor.set(anchor);
    c2.setRotation(-7.0, -90.0, 7.0).setCurve(60.0, 136.0);
    c2.large = true;

    var c3 = renderer.createEffect("fiskheroes:shield");
    c3.texture.set(null, "cannon_inner");
    c3.anchor.set(anchor);
    c3.setRotation(0.0, 0.0, -90.0).setCurve(0.0, -77.0);

    var shape = renderer.createResource("SHAPE", null);
    var energy = renderer.createEffect("fiskheroes:lines");
    energy.anchor.set(anchor);
    energy.color.set(energyColor);
    energy.setOffset(1.0, 13.75, -0.25);



    energy.setShape(shape);
    energy.setRenderer(renderer.createResource("BEAM_RENDERER", "fiskheroes:crab_cannon"));
    return {

        energy: energy,
        render: timer => {


            energy.progress = c3.unfold;
            energy.render();
        }
    };
}
