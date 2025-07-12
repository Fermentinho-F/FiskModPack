function createHead(renderer, icon) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var base = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    base.setOffset(0.0, -4, -0.5).setRotation(135, 0.0, 0.0).setSize(8, 1.75).setScale(1.25, 1.15, 1.3);
    base.anchor.set("head");

    var mouth1 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    mouth1.setOffset(3.0, -1.5, -3.52).setRotation(90.0, 0.0, 90.0).setSize(1, 1.8);
    mouth1.anchor.set("head");
    mouth1.mirror = true
    
    var mouth2 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    mouth2.setOffset(4.0, -1.5, -3.5).setRotation(135.0, 0.0, 10.0).setSize(1,5.0);
    mouth2.anchor.set("head");
    mouth2.mirror = true

    base.speedScale = mouth1.speedScale = mouth2.speedScale = 0;
    base.flutter = mouth1.flutter = mouth2.flutter = 0;
    return {
        base: base,
        mouth1: mouth1,
        mouth2: mouth2,
        render: timer => {
            base.progress = mouth1.progress = mouth2.progress = timer;
            mouth2.render();
            mouth1.render();
            base.render();
        }
    };
}