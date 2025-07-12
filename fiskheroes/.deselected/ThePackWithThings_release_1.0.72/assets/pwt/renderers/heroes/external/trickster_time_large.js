var aiming_shape;
var aiming_shape_evasive;
var boosting_shape_arms;
var boosting_shape_legs;
function create(renderer, color, color_boost, shape, beam) {
    aiming_shape = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aiming_shape.setOffset(1.0, 11.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(3.04);
    aiming_shape.anchor.set("rightArm");
    aiming_shape.mirror = true;
	
	aiming_shape_evasive = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    aiming_shape_evasive.setOffset(1.0, 11.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(3.04);
    aiming_shape_evasive.anchor.set("rightArm");
    aiming_shape_evasive.mirror = false;
	
	boosting_shape_arms = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    boosting_shape_arms.color.set(color_boost);
    boosting_shape_arms.anchor.set("rightArm");
    boosting_shape_arms.mirror = true;
	boosting_shape_legs = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    boosting_shape_legs.color.set(color_boost);
    boosting_shape_legs.anchor.set("rightLeg");
    boosting_shape_legs.mirror = true;
	

    return {
        render: (entity, isFirstPersonArm, r, g, b, rShift, gShift, bShift, rShift2, gShift2, bShift2) => {
			var item = entity.getEquipmentInSlot(3);
			var nbt = item.nbt();
			var offensive = nbt.getBoolean('offensive');
			var defensive = nbt.getBoolean('defensive');
			var evasive = nbt.getBoolean('evasive');
			
			var trickster = entity.getInterpolatedData("pwt:dyn/trickster");
			var beam_charge = entity.getInterpolatedData("fiskheroes:beam_charge");
            var aiming_timer = entity.getInterpolatedData("fiskheroes:aiming_timer");
			var power_timer = entity.getInterpolatedData("pwt:dyn/trickster_timer");
			var flight_boost_timer = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
			
			
			
			if (isFirstPersonArm) {
				aiming_shape_evasive.setRotation(0.0, 360*power_timer, -30.0*aiming_timer*power_timer);
			}
			else {
				aiming_shape_evasive.setRotation(30.0*aiming_timer*power_timer, 360*power_timer, 0.0);
			}
			aiming_shape_evasive.setOffset(1.0, 11.0 + 1.5*aiming_timer*power_timer, 0.0).setScale(3.04+1.5*aiming_timer*power_timer);
			aiming_shape_evasive.color.setRGB(r+rShift*power_timer, g+gShift*power_timer, b+bShift*power_timer);
			
			aiming_shape.color.setRGB(r+rShift2*power_timer*(defensive ? beam_charge : 0), g+gShift2*power_timer*(defensive ? beam_charge : 0), b+bShift2*power_timer*(defensive ? beam_charge : 0));
			
            aiming_shape.progress = aiming_timer + (defensive ? beam_charge : 0);
			aiming_shape_evasive.progress = aiming_timer*(0.7*Math.sin(-Math.PI*power_timer)+1);
			
			
			boosting_shape_arms.progress = boosting_shape_legs.progress = evasive ? power_timer * flight_boost_timer : 0;
			boosting_shape_arms.setOffset(1.0, 4.0 + 7*flight_boost_timer, 0.0).setRotation(0.0, 0.0, -15.0*Math.max(1 - (1 - flight_boost_timer) * 2, 0)).setScale(4.8 - 2.2*flight_boost_timer);
			boosting_shape_legs.setOffset(0.0, 6.0 + 7*flight_boost_timer, 0.0).setRotation(0.0, 0.0, 0.0).setScale(4.8 - 2.2*flight_boost_timer);
			
			if (evasive) {
				aiming_shape.setOffset(-1.0, 11.0, 0.0);
				aiming_shape.anchor.set("leftArm");
				aiming_shape.mirror = false;
				aiming_shape_evasive.render();
			}
			else {
				aiming_shape.setOffset(1.0, 11.0 + 3.5*(defensive ? beam_charge : 0), 0.0);
				aiming_shape.anchor.set("rightArm");
				aiming_shape.mirror = true;
			}
            aiming_shape.render();
			
			boosting_shape_arms.render();
			boosting_shape_legs.render();


        }
    };
}
