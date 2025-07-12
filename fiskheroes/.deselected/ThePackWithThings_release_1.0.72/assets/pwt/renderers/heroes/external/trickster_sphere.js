var aiming_shape_1;
var aiming_shape_2;
var aiming_shape_3;

function create(renderer, color, shape, beam, anchor, x, y, z, mirror) {
    aiming_shape_1 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aiming_shape_1.setOffset(x, y, z).setRotation(0.0, 0.0, 90.0).setScale(3.2);
    aiming_shape_1.color.set(color);
    aiming_shape_1.anchor.set(anchor);
    aiming_shape_1.mirror = mirror;
	
	aiming_shape_2 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aiming_shape_2.setOffset(x, y, z).setRotation(0.0, 0.0, 0.0).setScale(3.2);
    aiming_shape_2.color.set(color);
    aiming_shape_2.anchor.set(anchor);
    aiming_shape_2.mirror = mirror;
	
	aiming_shape_3 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aiming_shape_3.setOffset(x, y, z).setRotation(90.0, 0.0, 0.0).setScale(3.2);
    aiming_shape_3.color.set(color);
    aiming_shape_3.anchor.set(anchor);
    aiming_shape_3.mirror = mirror;
	

    return {
        render: (entity, progress) => {
			
			aiming_shape_1.setRotation(0.0, 360*entity.loop(60)*progress, 90.0+360*entity.loop(40)*progress);
			aiming_shape_2.setRotation( 360*entity.loop(40)*progress, 0.0, 360*entity.loop(60)*progress);
			aiming_shape_3.setRotation(90.0+360*entity.loop(60)*progress, 0.0, 360*entity.loop(40)*progress);
			
            aiming_shape_1.progress = aiming_shape_2.progress = aiming_shape_3.progress = progress;
            aiming_shape_1.render();
			aiming_shape_2.render();
			aiming_shape_3.render();
			

        }
    };
}
