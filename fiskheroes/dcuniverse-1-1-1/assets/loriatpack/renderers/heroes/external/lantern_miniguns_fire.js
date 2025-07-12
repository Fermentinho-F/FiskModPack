function create(renderer, icon, backBoosters) {
    if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }
    
    var back;

    if (backBoosters) {
        back = renderer.createEffect("fiskheroes:booster").setIcon(icon);
        back.setOffset(0.0, 30.0, 15.0).setSize(3.0, 3.0);
        back.anchor.set("body");
        back.mirror = false;
    }

    return {
        back: back,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            if (!isFirstPersonArm) {
                if (all || renderLayer == "CHESTPLATE") {
                    var boost = entity.getData("fiskheroes:energy_projection");

                    if (back != null && entity.getData('fiskheroes:suit_open_timer') == 0) {
                        back.progress = entity.getData("fiskheroes:energy_projection");
                        back.speedScale = 0.5 * boost;
                        back.setRotation(75 - 0 * boost, 0.0, 0 - 0 * boost);
                        back.render();
                    }
                }
            }
        }
    };
}
