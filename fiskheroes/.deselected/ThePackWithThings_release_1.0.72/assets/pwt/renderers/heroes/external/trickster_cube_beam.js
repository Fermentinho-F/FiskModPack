var L1cube_back;
var L1cube_front;
var L1cube_side_1;
var L1cube_side_2;
var L1cube_bottom;
var L1cube_top;

function create(renderer, color, shape, beam, anchor, x, y, z) {
    L1cube_back = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L1cube_front = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L1cube_side_1 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L1cube_side_2 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L1cube_bottom = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L1cube_top = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	
	L2cube_back = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L2cube_front = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L2cube_side_1 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L2cube_side_2 = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L2cube_bottom = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	L2cube_top = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
	
    L1cube_back.setOffset(x, y+10, z).setRotation(0.0, 45.0, 0.0).setScale(2.0);
	L1cube_front.setOffset(x, y+14, z).setRotation(0.0, 45.0, 0.0).setScale(2.0);
	L1cube_top.setOffset(x, y+12, z+2).setRotation(90.0, 45.0, 0.0).setScale(2.0);
	L1cube_bottom.setOffset(x, y+12, z-2).setRotation(90.0, 45.0, 0.0).setScale(2.0);
	L1cube_side_1.setOffset(x+2, y+12, z).setRotation(45.0, 0.0, 90.0).setScale(2.0);
	L1cube_side_2.setOffset(x-2, y+12, z).setRotation(45.0, 0.0, 90.0).setScale(2.0);
	
	L2cube_back.setOffset(x, y-8, z).setRotation(0.0, 45.0, 0.0).setScale(2.0);
	L2cube_front.setOffset(x, y-4, z).setRotation(0.0, 45.0, 0.0).setScale(2.0);
	L2cube_top.setOffset(x, y-6, z+2).setRotation(90.0, 45.0, 0.0).setScale(2.0);
	L2cube_bottom.setOffset(x, y-6, z-2).setRotation(90.0, 45.0, 0.0).setScale(2.0);
	L2cube_side_1.setOffset(x+2, y-6, z).setRotation(45.0, 0.0, 90.0).setScale(2.0);
	L2cube_side_2.setOffset(x-2, y-6, z).setRotation(45.0, 0.0, 90.0).setScale(2.0);

	
	
    L1cube_back.color.set(color);
	L1cube_front.color.set(color);
	L1cube_side_1.color.set(color);
	L1cube_side_2.color.set(color);
	L1cube_bottom.color.set(color);
	L1cube_top.color.set(color);
	
	L2cube_back.color.set(color);
	L2cube_front.color.set(color);
	L2cube_side_1.color.set(color);
	L2cube_side_2.color.set(color);
	L2cube_bottom.color.set(color);
	L2cube_top.color.set(color);
	
	L1cube_back.anchor.set(anchor);
	L1cube_front.anchor.set(anchor);
	L1cube_side_1.anchor.set(anchor);
	L1cube_side_2.anchor.set(anchor);
	L1cube_bottom.anchor.set(anchor);
	L1cube_top.anchor.set(anchor);
	
	L2cube_back.anchor.set(anchor);
	L2cube_front.anchor.set(anchor);
	L2cube_side_1.anchor.set(anchor);
	L2cube_side_2.anchor.set(anchor);
	L2cube_bottom.anchor.set(anchor);
	L2cube_top.anchor.set(anchor);
	

    L1cube_back.mirror = L1cube_front.mirror = L1cube_side_1.mirror = L1cube_side_2.mirror = L1cube_bottom.mirror = L1cube_top.mirror = true;
	L2cube_back.mirror = L2cube_front.mirror = L2cube_side_1.mirror = L2cube_side_2.mirror = L2cube_bottom.mirror = L2cube_top.mirror = true;

    return {
        render: (entity, progress) => {	
			L1cube_back.progress = L1cube_front.progress = L1cube_side_1.progress = L1cube_side_2.progress = L1cube_bottom.progress = L1cube_top.progress = progress;
			L2cube_back.progress = L2cube_front.progress = L2cube_side_1.progress = L2cube_side_2.progress = L2cube_bottom.progress = L2cube_top.progress = progress;
			
			L1cube_back.render();
			L1cube_front.render();
			L1cube_side_1.render();
			L1cube_side_2.render();
			L1cube_bottom.render();
			L1cube_top.render();
			
			L2cube_back.render();
			L2cube_front.render();
			L2cube_side_1.render();
			L2cube_side_2.render();
			L2cube_bottom.render();
			L2cube_top.render();


        }
    };
}
