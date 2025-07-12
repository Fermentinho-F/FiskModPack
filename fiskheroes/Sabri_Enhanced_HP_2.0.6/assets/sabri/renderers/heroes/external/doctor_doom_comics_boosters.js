function create(renderer, icon, backBoosters) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }
    var back;
    if (backBoosters) {
        back = renderer.createEffect("fiskheroes:booster").setIcon(icon);
        back.setOffset(5, 12, 0).setSize(1.25, 3.0);
        back.anchor.set("body");
        back.mirror = true;
    }

    return {
        back: back,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    if (back != null) {
                        back.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                        back.speedScale = 0.5 * boost;
                        back.setRotation(7 * flight + 10 * boost, 0, 0);
                        back.render();
                    }
                }
            }
        }
    };
}
