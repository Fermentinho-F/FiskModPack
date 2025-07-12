function create(renderer, textureLarge, textureSmall) {
    var c1 = renderer.createEffect("fiskheroes:shield");
    c1.texture.set(textureLarge);
    c1.anchor.set("body");
	c1.large = true;
    c1.setRotation(-90.0, 90.0, 90.0).setCurve(60.0, 160.0);

    var c2 = renderer.createEffect("fiskheroes:shield");
    c2.texture.set(textureSmall);
    c2.anchor.set("body");
	c2.large = true;
    c2.setRotation(-90.0, 90.0, 90.0).setCurve(60.0, 180.0);



    c1.mirror = c2.mirror = true;
    return {
        c1: c1,
        c2: c2,

        render: timer => {
            var f = Math.min(timer * 4, 1);
            c1.unfold = c2.unfold = f;
    
            f = Math.min(f * 5, 1);
            c1.setOffset(20.5 * f, 2.0, 2.25 * f);
            c2.setOffset(28.5 * f, 2.0, 2.25 * f);

            c1.render();
            c2.render();

        }
    };
}
