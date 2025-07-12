var shield_large_no_block_R;
var shield_large_no_block_L;
var shield_large_block_power;
function create(renderer, color, shape, beam) {
    shield_large_no_block_R = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    shield_large_no_block_R.setScale(4.8);
    shield_large_no_block_R.color.set(color);
    shield_large_no_block_R.anchor.set("rightArm");
    shield_large_no_block_R.mirror = false;
	
	shield_large_no_block_L = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    shield_large_no_block_L.setScale(4.8);
    shield_large_no_block_L.color.set(color);
    shield_large_no_block_L.anchor.set("leftArm");
    shield_large_no_block_L.mirror = false;
	
	shield_large_block_power = renderer.createEffect("fiskheroes:lines").setShape(shape).setRenderer(beam);
    shield_large_block_power.setOffset(1.0, 26.0, 0.0).setRotation(10.0, 0.0, 0.0).setScale(9.6);
    shield_large_block_power.color.set(color);
    shield_large_block_power.anchor.set("rightArm");
    shield_large_block_power.mirror = true;
	

    return {
        render: (entity, timer_1)=> {
			var item = entity.getEquipmentInSlot(3);
			var nbt = item.nbt();
			var offensive = nbt.getBoolean('offensive');
			var defensive = nbt.getBoolean('defensive');
			var evasive = nbt.getBoolean('evasive');
            var shield_timer = entity.getInterpolatedData("fiskheroes:shield_timer");
            var blocking_timer = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
			var beam_charge = entity.getInterpolatedData("fiskheroes:beam_charge");
			//var trickster_timer = entity.getInterpolatedData("pwt:dyn/trickster_timer");
            shield_large_no_block_R.progress = shield_timer * (1 - timer_1 * blocking_timer);
			shield_large_no_block_L.progress = shield_timer * blocking_timer * (1 - timer_1 * blocking_timer) + (defensive ? beam_charge : 0);
			
            ///shield_large_block.progress = shield_timer * blocking_timer * (1 - timer_1);
			shield_large_block_power.progress = shield_timer * blocking_timer * timer_1;

            shield_large_no_block_R.setOffset(1.0, ( 3.0 + shield_timer + 8.0*blocking_timer + 8*(defensive ? beam_charge : 0)), 0.0);
			shield_large_no_block_L.setOffset(-1.0, ( 3.0 + shield_timer + 8.0*blocking_timer + 8*(defensive ? beam_charge : 0) ), 0.0);
			
			shield_large_no_block_R.setRotation((10.0*blocking_timer), 0.0, 0.0);
			shield_large_no_block_L.setRotation((10.0*blocking_timer), 0.0, 0.0);
			
			shield_large_no_block_R.setScale(4.8 - (defensive ? beam_charge : 0));
			shield_large_no_block_L.setScale(4.8 - (defensive ? beam_charge : 0));
			
            shield_large_no_block_R.render();
			shield_large_no_block_L.render();
            ///shield_large_block.render();
			shield_large_block_power.render();
        }
    };
}
