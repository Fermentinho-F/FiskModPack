var cube_back;
var cube_front;
var cube_side_1;
var cube_side_2;
var cube_bottom;
var cube_top;

function create(renderer, color, shape, beam, anchor, x, y, z, mirror) {
    cube_back = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	cube_front = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	cube_side_1 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	cube_side_2 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	cube_bottom = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	cube_top = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	
    cube_back.setOffset(x, y, z).setRotation(0.0, 45.0, 0.0).setScale(2.0);
	cube_front.setOffset(x, y+4, z).setRotation(0.0, 45.0, 0.0).setScale(2.0);
	cube_top.setOffset(x, y+2, z+2).setRotation(90.0, 45.0, 0.0).setScale(2.0);
	cube_bottom.setOffset(x, y+2, z-2).setRotation(90.0, 45.0, 0.0).setScale(2.0);
	cube_side_1.setOffset(x+2, y+2, z).setRotation(45.0, 0.0, 90.0).setScale(2.0);
	cube_side_2.setOffset(x-2, y+2, z).setRotation(45.0, 0.0, 90.0).setScale(2.0);

	
	
    cube_back.color.set(color);
	cube_front.color.set(color);
	cube_side_1.color.set(color);
	cube_side_2.color.set(color);
	cube_bottom.color.set(color);
	cube_top.color.set(color);
	
	cube_back.anchor.set(anchor);
	cube_front.anchor.set(anchor);
	cube_side_1.anchor.set(anchor);
	cube_side_2.anchor.set(anchor);
	cube_bottom.anchor.set(anchor);
	cube_top.anchor.set(anchor);
	

    cube_back.mirror = cube_front.mirror = cube_side_1.mirror = cube_side_2.mirror = cube_bottom.mirror = cube_top.mirror= mirror;

    return {
        render: (entity, progress) => {	
			cube_back.progress = cube_front.progress = cube_side_1.progress = cube_side_2.progress = cube_bottom.progress = cube_top.progress = progress;
			
			cube_back.render();
			cube_front.render();
			cube_side_1.render();
			cube_side_2.render();
			cube_bottom.render();
			cube_top.render();


        }
    };
}
