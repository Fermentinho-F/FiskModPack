function create(renderer, icon, backBoosters) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var boots = renderer.createEffect("fiskheroes:booster").setIcon(icon);
    boots.setOffset(0.0, 12.0, 0.0).setSize(2.5, 3.0);
    boots.anchor.set("rightLeg");
    boots.mirror = true;

    return {

        boots: boots,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {

                if (all || renderLayer == "BOOTS") {
                    var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
                    boots.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
                    boots.speedScale = 0.5 * boost;
                    boots.flutter = 1 + boost;

                    var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
                    f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
                    boots.setSize(2.5 + f * 4, 3.0 - f * 3.9);
                    boots.render();
                }
            }
        }
    };
}
