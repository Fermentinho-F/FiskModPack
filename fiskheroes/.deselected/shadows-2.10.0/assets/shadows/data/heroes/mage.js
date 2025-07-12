/*
integer_reset:
1 - spell in use
2 - spel used
3 - slot chooser
4 - spell chooser
5 - spell duration
6 - spell > tracker id
boolean_reset:
1 - change slot
2 - change spell
3 - spell > charged beam
float_reset:
1 - spell activation visual timer
2 - spell > charged beam - sound
3 - spell > show health - display health
4 - spell > show health - true health
1float_interp_reset: spell > charged beam
*/
var dome = implement("shadows:external/shadow_dome");
var spell_slots = [];
// this variable is to define the spell
var spells = [
    //[<Name>,<KeybindName>,<Duration>,<Cooldown>, <Activation Visual Timer>]
    ["Empty", "Empty", 0, 0, 0],
    ["Shield", "Shield", 40, 6, 0.1],
    ["Charged Beam", "Charged Beam", 120, 8, 0.1],
    ["Movement", "Movement", 80, 3, 0.1],
    ["Invisible", "Invisible", 120, 5, 0.1],
    ["Telekinesis", "Telekinesis(Mouse Left Click)", 120, 10, 0.1],
    ["Tracker", "Tracker(Mouse Left Click)", 400, 10, 0.1],
    ["Show Health", "Show Health(Mouse Left Click)", 800, 10, 0.2]];
// this for each is to make the function for hero.addKeyBindFunc
spells.forEach((element, index) => {
    for (var i = 1; i <= 3; i++) {
        spells[index][spells[index].length] = (entity, manager) => {
            var randomPitch = 0.8 + Math.random() * 0.3;
            manager.setData(entity, "shadows:dyn/1integer_reset", 0);
            if (!entity.getData("fiskheroes:mask_open") && entity.getData("shadows:dyn/1integer_reset") == 0 && !entity.getData("shadows:dyn/spell_cooldown") && entity.getData("shadows:dyn/1float_reset") == 0) {
                manager.setData(entity, "shadows:dyn/1integer_reset", index);
                manager.setData(entity, "shadows:dyn/2integer_reset", index);
                if (index != 0) {
                    entity.playSound("fiskheroes:modifier.spell.cast", 50, randomPitch);
                }
            } else if (!entity.getData("shadows:dyn/spell_cooldown") && entity.getData("shadows:dyn/1integer_reset") == 0 && entity.getData("shadows:dyn/1float_reset") == 1) {
                entity.playSound("fiskheroes:modifier.spell.fail", 40, randomPitch);
            }
            return true;
        };
    }
});
for (var i = 0; i <= 3; i++) {
    spell_slots[i] = [];
    spells.forEach((element, index) => {
        spell_slots.push.apply(spell_slots[i], [[element[0], index]]);
    });

}
function init(hero) {
    hero.setName("Mage");
    hero.setTier(2);

    hero.addPowers("shadows:magic");


    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.robes");
    hero.setBoots("item.superhero_armor.piece.shoes");
    
    spells.forEach((element, index) => {
        hero.addKeyBindFunc("Spell_" + spells[index][0].replace(/\s/g, '_') + "_Slot_1", spells[index][spells[index].length - 3], "Spell-" + spells[index][1] + " Slot-1", 1);
        hero.addKeyBindFunc("Spell_" + spells[index][0].replace(/\s/g, '_') + "_Slot_2", spells[index][spells[index].length - 2], "Spell-" + spells[index][1] + " Slot-2", 2);
        hero.addKeyBindFunc("Spell_" + spells[index][0].replace(/\s/g, '_') + "_Slot_3", spells[index][spells[index].length - 1], "Spell-" + spells[index][1] + " Slot-3", 3);
        hero.addKeyBindFunc("Cycle_" + index, cycle, "Cycle(spell <" + spells[index][0] + ">)", 5);
    });
    for (var i = 1; i <= 3; i++) {
        hero.addKeyBindFunc("Cycle_Slot_" + String(i - 1), cycleSlot, "Cycle(slot <" + i + ">)", 4);
    }
    hero.addKeyBind("EXAMPLE", 'Use "Open Mask" Key to toggle change mode', 4);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", -1);
    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var nbt_compound = (byte) => {
            return nbt.getCompoundTag("SpellsSlot").getByte(byte) | 0;
        };
        //spell keybind defaults
        if (!nbt.hasKey("SpellsSlot")) {
            var output = manager.newCompoundTag("{1:0b, 2:0b, 3:0b}");
            manager.setCompoundTag(nbt, "SpellsSlot", output);
        }
        //keybind functions - slot/spell changers
        if (entity.getData("shadows:dyn/1boolean_reset")) {
            var data1 = entity.getData("shadows:dyn/3integer_reset");
            manager.setData(entity, "shadows:dyn/4integer_reset", 0);
            manager.setData(entity, "shadows:dyn/3integer_reset", data1 == 2 ? 0 : data1 + 1);
            manager.setData(entity, "shadows:dyn/1boolean_reset", false);
        }

        if (entity.getData("shadows:dyn/2boolean_reset")) {
            var data1 = entity.getData("shadows:dyn/4integer_reset");
            var data2 = entity.getData("shadows:dyn/3integer_reset");
            manager.setData(entity, "shadows:dyn/4integer_reset", data1 >= spells.length - 1 ? 0 : data1 + 1);
            var Valid = (spell, slot) => {
                if (spell !== 0) {
                    if (
                        (slot == 0 && (entity.getData("shadows:dyn/4integer_reset") == nbt_compound(2) || entity.getData("shadows:dyn/4integer_reset") == nbt_compound(3))) ||
                        (slot == 1 && (entity.getData("shadows:dyn/4integer_reset") == nbt_compound(1) || entity.getData("shadows:dyn/4integer_reset") == nbt_compound(3))) ||
                        (slot == 2 && (entity.getData("shadows:dyn/4integer_reset") == nbt_compound(1) || entity.getData("shadows:dyn/4integer_reset") == nbt_compound(2)))) {
                        return true;
                    }
                }
                return false;
            };
            spells.forEach((element, index) => {
                if (Valid(entity.getData("shadows:dyn/4integer_reset"), data2)) {
                    manager.setData(entity, "shadows:dyn/4integer_reset", entity.getData("shadows:dyn/4integer_reset") + 1);
                    if (entity.getData("shadows:dyn/4integer_reset") >= spells.length) {
                        manager.setData(entity, "shadows:dyn/4integer_reset", 0);
                    }
                }
            });
            var change_spell = (slot) => {
                return slot == data2 + 1 ? entity.getData("shadows:dyn/4integer_reset") : nbt_compound(slot);
            };
            var output_nbt = manager.newCompoundTag("{1:" + change_spell(1) + "b, 2:" + change_spell(2) + "b, 3:" + change_spell(3) + "b}");
            manager.setCompoundTag(nbt, "SpellsSlot", output_nbt);
            manager.setData(entity, "shadows:dyn/2boolean_reset", false);
        }
        manager.setData(entity, "shadows:dyn/4integer_reset", nbt_compound(entity.getData("shadows:dyn/3integer_reset") + 1));

        //spell duration/visual-timer
        if (entity.getData("shadows:dyn/1integer_reset") != 0) {
            var data1 = Math.max(entity.getData("shadows:dyn/1integer_reset"), 0);
            var data2 = entity.getData("shadows:dyn/5integer_reset");
            var data3 = entity.getData("shadows:dyn/1float_reset");
            if (data2 < spells[data1][2]) {
                manager.setData(entity, "shadows:dyn/5integer_reset", data2 + 1);
            }
            if (data2 >= spells[data1][2] && spells[data1][2] > 0 || entity.getData("fiskheroes:mask_open")) {
                manager.setData(entity, "shadows:dyn/1integer_reset", 0);
            }
            if (data3 < 1) {
                manager.setData(entity, "shadows:dyn/1float_reset", data3 + spells[data1][4]);
            } else if (data3 > 1) {
                manager.setData(entity, "shadows:dyn/1float_reset", 1);
            }
        } else if (entity.getData("shadows:dyn/1integer_reset") == 0) {
            var data3 = entity.getData("shadows:dyn/1float_reset");
            if (data3 > 0) {
                var data4 = Math.max(entity.getData("shadows:dyn/2integer_reset"), 0);
                manager.setData(entity, "shadows:dyn/1float_reset", data3 - spells[data4][4]);
            } else if (data3 < 0) {
                manager.setData(entity, "shadows:dyn/spell_used_cooldown", entity.getData("shadows:dyn/2integer_reset"));
                manager.setData(entity, "shadows:dyn/spell_cooldown_timer", 0);
                manager.setData(entity, "shadows:dyn/spell_cooldown", true);
                manager.setData(entity, "shadows:dyn/1integer_reset", 0);
                manager.setData(entity, "shadows:dyn/2integer_reset", 0);
                manager.setData(entity, "shadows:dyn/5integer_reset", 0);
                manager.setData(entity, "shadows:dyn/1float_reset", 0);
            }
        }

        //spell cooldown
        if (entity.getData("shadows:dyn/spell_cooldown")) {
            var data1 = Math.max(entity.getData("shadows:dyn/spell_used_cooldown"), 0);
            var data2 = entity.getData("shadows:dyn/spell_cooldown_timer");
            if (data2 <= spells[data1][3]) {
                manager.setData(entity, "shadows:dyn/spell_cooldown_timer_visual", Math.min(Math.max((data2 / spells[data1][3]), 0), 1));
                manager.setData(entity, "shadows:dyn/spell_cooldown_timer", data2 + 0.1);
            } else if (data2 > spells[data1][3]) {
                manager.setData(entity, "shadows:dyn/spell_cooldown_timer_visual", 0);
                manager.setData(entity, "shadows:dyn/spell_cooldown_timer", 0);
                manager.setData(entity, "shadows:dyn/spell_cooldown", false);
            }
        }
        //spell used
        var spell_used = entity.getData("shadows:dyn/1integer_reset");
        //spell-shield
        if (spell_used == 1) {
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);
        }
        //spell-Charged Beam
        if (spell_used == 2) {
            manager.setDataWithNotify(entity, "shadows:dyn/3boolean_reset", true);
            if (entity.getData("shadows:dyn/1float_interp_reset") == 1) {
                manager.setDataWithNotify(entity, "fiskheroes:heat_vision", true);
            }
        }
        //spell-Movment
        if (spell_used == 3) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
        //spell-Invisible
        if (spell_used == 4) {
            manager.setData(entity, "fiskheroes:invisible", true);
        }
        //spell-Telekinesis = Doesn't need anything in tick handler.
        //spell-Tracker
        if (nbt.hasKey("display")) {
            manager.removeTag(nbt, "display");
        }
        if (spell_used == 6) {
            if (entity.getData("fiskheroes:grab_id") != -1) {
                manager.setData(entity, "shadows:dyn/6integer_reset", entity.getData("fiskheroes:grab_id"));
                manager.setData(entity, "fiskheroes:telekinesis", false);
            }
            if (entity.getData("shadows:dyn/6integer_reset") > -1) {
                var tracked = entity.world().getEntityById(entity.getData("shadows:dyn/6integer_reset"));
                if (spell_used == 6) {
                    var lore = manager.newCompoundTag("{Lore:[" + "\u00A77Name " + tracked.getName() + "," + "\u00A77X " + String(Math.floor(tracked.posX())) + "," + "\u00A77Y " + String(Math.floor(tracked.posY())) + "," + "\u00A77Z " + String(Math.floor(tracked.posZ())) + "," + "\u00A77Distance " + String(Math.round(entity.pos().distanceTo(tracked.posX(), tracked.posY(), tracked.posZ()))) + "]}");
                    manager.setCompoundTag(nbt, "display", lore);
                }
                if (!tracked.isLivingEntity() && !nbt.hasKey("display")) {
                    manager.removeTag(nbt, "display");
                }
            }
        }

        //spell-Show Health
        if (spell_used == 7) {
            if (entity.getData("fiskheroes:grab_id") != -1) {
                manager.setData(entity, "shadows:dyn/6integer_reset", entity.getData("fiskheroes:grab_id"));
                manager.setData(entity, "fiskheroes:telekinesis", false);
            }
            if (entity.getData("shadows:dyn/6integer_reset") > -1) { 
                var target = entity.world().getEntityById(entity.getData("shadows:dyn/6integer_reset"));
                manager.setData(entity, "shadows:dyn/3float_reset", Math.min(Math.max(1 - (target.getHealth() / target.getMaxHealth()), 0.0001),  1));
                manager.setData(entity, "shadows:dyn/4float_reset", target.getHealth());
            }
            
        }
        //spell-reset
        if (spell_used == 0) {
            if (entity.getData("shadows:dyn/1float_interp_reset") != 0) {
                manager.setDataWithNotify(entity, "fiskheroes:heat_vision", false);
                manager.setDataWithNotify(entity, "shadows:dyn/3boolean_reset", false);
                manager.setDataWithNotify(entity, "shadows:dyn/1float_interp_reset", 0);
            }
            if (entity.getData("fiskheroes:shield_blocking")) {
                manager.setData(entity, "fiskheroes:shield", false);
                manager.setData(entity, "fiskheroes:shield_blocking", false);
            }
            if (entity.getData("fiskheroes:invisibility_timer") != 0) {
                manager.setData(entity, "fiskheroes:invisible", false);
            }
            if (entity.getData("fiskheroes:telekinesis")) {
                manager.setData(entity, "fiskheroes:telekinesis", false);
            }
            if (entity.getData("shadows:dyn/6integer_reset") != -1) {
                manager.setData(entity, "shadows:dyn/6integer_reset", -1);
            }
            if (entity.getData("shadows:dyn/3float_reset") != 0) {
                manager.setData(entity, "shadows:dyn/3float_reset", 0);
            }
        }
    });

    hero.setAttributeProfile(entity => entity.getData("shadows:dyn/1integer_reset") == 3 ? "SPEED" : null);
    hero.addAttributeProfile("SPEED", profile => {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", 0.4, 1);
    });

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.addSoundEvent("MASK_OPEN", "shadows:mage/mask_toggle");
    hero.addSoundEvent("MASK_CLOSE", "shadows:mage/mask_toggle");
}

function cycle(entity, manager) {
    entity.playSound("shadows:mage.select", 30, 0.9 + Math.random() * 0.2);
    manager.setData(entity, "shadows:dyn/2boolean_reset", true);
    return true;
}
function cycleSlot(entity, manager) {
    manager.setData(entity, "shadows:dyn/1boolean_reset", true);
    entity.playSound("shadows:mage.select_slot", 30, 0.9 + Math.random() * 0.2);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var spell_used = entity.getData("shadows:dyn/1integer_reset");
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return spell_used == 3 && !entity.isOnGround() && !entity.isSneaking();
    case "fiskheroes:telekinesis":
        return modifier.id() == "normal" && spell_used == 5 || modifier.id() == "mobs" && (spell_used == 6 || spell_used == 7);
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var spell_used = entity.getData("shadows:dyn/1integer_reset");
    var nbt_compound = (byte) => {
        return entity.getWornChestplate().nbt().getCompoundTag("SpellsSlot").getByte(byte) | 0;
    };
    var spell = (slot) => {
        return keyBind == "Spell_" + spells[nbt_compound(slot)][0].replace(/\s/g, '_') + "_Slot_" + slot;
    };
    switch (keyBind) {
    case "TELEKINESIS":
        return entity.getHeldItem().isEmpty() && (spell_used == 5 || spell_used == 6 || spell_used == 7);
    case "EXAMPLE":
        return !entity.getData("fiskheroes:mask_open") && spells[nbt_compound(1)][0] == "Empty" && spells[nbt_compound(2)][0] == "Empty" && spells[nbt_compound(3)][0] == "Empty";
    default:
        if (spell(1) || spell(2) || spell(3) || entity.getData("fiskheroes:mask_open") && (keyBind == "Cycle_" + entity.getData("shadows:dyn/4integer_reset") || keyBind == "Cycle_Slot_" + entity.getData("shadows:dyn/3integer_reset"))) {
            return true;
        }
        return !keyBind.startsWith("Spell_") && !keyBind.startsWith("Cycle_") && !keyBind.startsWith("Cycle_Slot_");
    }

}