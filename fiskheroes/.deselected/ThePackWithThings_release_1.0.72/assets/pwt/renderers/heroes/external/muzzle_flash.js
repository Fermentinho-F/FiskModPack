function create(renderer, icon, anchor, x, y, z, scale) {

	if (typeof icon === "string") {
        icon = renderer.createResource("ICON", icon);
    }

    var flash_1 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
	var flash_2 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
	var flash_3 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
	var flash_4 = renderer.createEffect("fiskheroes:booster").setIcon(icon);
	var flash_core = renderer.createEffect("fiskheroes:booster").setIcon(icon);


	flash_core.setOffset(x, y, z).setRotation(0.0, 0.0, 0.0).setSize(2.8, 8.0).setScale(scale);
	flash_1.setOffset(x, y, z).setRotation(-30.0, 0.0, 0.0).setSize(2.5, 3.0).setScale(scale);
	flash_2.setOffset(x, y, z).setRotation(30.0, 0.0, 0.0).setSize(2.5, 3.0).setScale(scale);
	flash_3.setOffset(x, y, z).setRotation(0.0, 0.0, 30.0).setSize(2.5, 3.0).setScale(scale);
	flash_4.setOffset(x, y, z).setRotation(0.0, 0.0, -30.0).setSize(2.5, 3.0).setScale(scale);
    
	flash_1.anchor.set(anchor);
	flash_2.anchor.set(anchor);
	flash_3.anchor.set(anchor);
	flash_4.anchor.set(anchor);
	flash_core.anchor.set(anchor);

	return {
        flash_1: flash_1,
        flash_2: flash_2,
        flash_3: flash_3,
        flash_4: flash_4,
		flash_core: flash_core,
        render: (entity, renderLayer, isFirstPersonArm, all) => {
            var energy_projection_timer = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
			var loop = (entity.loop(1)*energy_projection_timer)*Math.PI;
			var loop_3 = (entity.loop(1)*energy_projection_timer)*Math.PI/2;
			var loop_2 = ((entity.loop(1)*energy_projection_timer)*Math.PI )-0.3;
			var sin = Math.sin(loop) ;
			var sin_2 = Math.sin(loop_2);
			var cos = Math.cos(loop) ;
			var on = entity.ticksExisted() % 3 >= 0 && entity.ticksExisted() % 3 < 1;
			if (all ||renderLayer == "CHESTPLATE") {
				if (on) {
					flash_1.progress = sin ;
					flash_1.opacity = 0.6 * energy_projection_timer;
					flash_1.flutter = Math.sin(loop_3);
					flash_1.render();
					flash_2.progress = sin;
					flash_2.opacity = 0.6 * energy_projection_timer;
					flash_2.flutter = Math.sin(loop_3);
					flash_2.render();
					flash_3.progress = sin;
					flash_3.opacity = 0.6 * energy_projection_timer;
					flash_3.flutter = Math.sin(loop_3);
					flash_3.render();
					flash_4.progress = sin;
					flash_4.opacity = 0.6 * energy_projection_timer;
					flash_4.flutter = Math.sin(loop_3);
					flash_4.render();
					flash_core.progress = sin_2;
					flash_core.flutter = Math.sin(loop_3);
					flash_core.opacity = 0.6 * energy_projection_timer;
					flash_core.render();
				}
			}
        }
    };

}
