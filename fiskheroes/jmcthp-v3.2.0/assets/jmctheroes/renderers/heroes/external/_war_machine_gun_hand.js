function create(renderer, icon) {
    if (typeof icon === "undefined") {
        icon = renderer.createResource("ICON", icon);
    }

    var Hand1 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    Hand1.setOffset(3.5, 10.5, -0.5).setSize(1.0, 3.0);
    Hand1.anchor.set("rightArm");
    Hand1.mirror = true;

    var Hand2 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    Hand2.setOffset(3.5, 10.5, 0.5).setSize(1.0, 3.0);
    Hand2.anchor.set("rightArm");
    Hand2.mirror = true;

    return {
        render: entity => {
            var gun = entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
            Hand1.progress = gun * Math.sin(Math.PI * entity.loop(3));
            Hand1.render();
            Hand2.progress = gun * Math.sin(Math.PI * entity.loop(2));
            Hand2.render();
        
        }
    };
}