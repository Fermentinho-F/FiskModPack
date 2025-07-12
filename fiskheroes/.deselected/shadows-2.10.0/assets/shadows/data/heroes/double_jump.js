var jumpMin = 0.8
var jumpMax = 1.4
function init(hero) {
    hero.setName("Double Jump");
    hero.setTier(1);
    hero.hide();

    hero.setChestplate("Suit");

    hero.addPowers("shadows:double_jump_power"/*, "fiskheroes:web_shooters"*/);

    hero.setModifierEnabled(isModifierEnabled);
    //hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:web_swinging_timer") == 1 && entity.getData("shadows:dyn/1float_reset") != 1) {
            manager.setData(entity, "shadows:dyn/1float_reset", 1);
        }
        if (entity.getData("fiskheroes:web_swinging_timer") == 0 && entity.motionY() < 0.1 && entity.getData("shadows:dyn/1float_reset") > 0) {
            manager.setData(entity, "shadows:dyn/1float_reset", entity.getData("shadows:dyn/1float_reset") - 0.1);
        }
        if ((!entity.isOnGround() && !entity.getData("fiskheroes:web_swinging") || entity.getData("shadows:dyn/1float_reset") > 0 && entity.getData("fiskheroes:web_swinging_timer") == 0 && entity.motionY() < 0.1) && !entity.getData("shadows:dyn/jump")) {
            manager.setData(entity, "shadows:dyn/jump", true);
            manager.setData(entity, "shadows:dyn/choose_jump_animation", Math.floor(Math.random() * 3));

        }
        if ((entity.isOnGround() || entity.getData("fiskheroes:web_swinging_timer") == 1) && entity.getData("shadows:dyn/jump")) {
            manager.setData(entity, "shadows:dyn/jump", false);
        }

        // jump timer
        if (entity.getData("shadows:dyn/jump")) {
            manager.setData(entity, "shadows:dyn/jump_timer", entity.getData("shadows:dyn/jump_timer") + 0.1)
        } else if (!entity.getData("shadows:dyn/jump") && entity.getData("shadows:dyn/jump_timer") != 0.0) {
            manager.setData(entity, "shadows:dyn/jump_timer", 0.0);
        }

        // jump animation
        if (entity.getData("shadows:dyn/jump_timer") >= 1.0 && entity.getData("fiskheroes:jetpacking") && !entity.getData("shadows:dyn/double_jump")) {
            manager.setData(entity, "shadows:dyn/double_jump", true);
        }
        if (entity.getData("shadows:dyn/jump_timer") >= 1.0) {
            manager.setData(entity, "shadows:dyn/jump_animation", entity.getData("shadows:dyn/jump_animation") + 0.1)
        } else if (entity.getData("shadows:dyn/jump_timer") == 0.0 && entity.getData("shadows:dyn/jump_animation") != 0.0) {
            manager.setData(entity, "shadows:dyn/jump_animation", 0.0);
            manager.setData(entity, "shadows:dyn/double_jump", false);
        }
    });

}

function webSwingingKey(entity, manager) {
    var flag = entity.getData("fiskheroes:web_swinging");
    manager.setDataWithNotify(entity, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:propelled_flight") {
        return (entity.getData("shadows:dyn/jump_timer") > jumpMin && entity.getData("shadows:dyn/jump_timer") < (entity.getData("fiskheroes:web_swinging") ? entity.getData("fiskheroes:jetpacking") ? jumpMax + 0.2 : jumpMax - 0.2 : jumpMax));
    }
    return true;
}
