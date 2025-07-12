var square_high;
var square_low;
function create(renderer, color, shape, beam) {
    square_high = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    square_high.setRotation(0.0, 45.0, 0.0).setScale(2.4);
    square_high.color.set(color);
    square_high.anchor.set("rightArm");
    
    square_low = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    square_low.setRotation(0.0, 45.0, 0.0).setScale(2.4);
    square_low.color.set(color);
    square_low.anchor.set("rightArm");
	
    square_low.mirror = square_high.mirror = true;
	

    return {
        render: entity => {
            var shield_timer = entity.getInterpolatedData("fiskheroes:shield_timer");
            square_high.progress = square_low.progress = shield_timer;

			square_high.setOffset(1.0, (3.0 + 4*shield_timer), 0.0);
            square_low.setOffset(1.0, (3.0 + 5*shield_timer), 0.0);
			
            square_high.render();
            square_low.render();

        }
    };
}
