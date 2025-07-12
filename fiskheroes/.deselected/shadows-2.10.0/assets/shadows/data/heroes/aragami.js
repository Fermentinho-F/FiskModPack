var dash = implement("shadows:external/dash");
var block = implement("shadows:external/block");
var suit = implement("shadows:external/return_to_random");

var info = {
    "datas": {
        "dash": "shadows:dyn/dash",
        "allowDash": "shadows:dyn/allow_dash",
        "didDash": "shadows:dyn/did_dash",
        "dashTimer": "shadows:dyn/dash_timer",
        "allowDashTimer": "shadows:dyn/allow_dash_timer"
    },
    "numbers": {
        "dashSprintSpeed": 5,
        "afterDashSprintSpeed": 2,
        "leapMaxTimer": 0.3,
        "dashMaxTimer": 0.7,
        "fallingCheck": 0.1
    },
    "ledge": [
        8,
        [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0], [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1]],
        [[0, 1, 1], [0, 1, -1], [1, 1, 0], [-1, 1, 0], [1, 1, 1], [1, 1, -1], [-1, 1, 1], [-1, 1, -1]]
    ]
};

var jump = 0.75;
function init(hero) {
    hero.setName("Aragami");
    hero.setTier(4);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2, 0);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addPowers("shadows:aragami_umbrakinesis");
    hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));

    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("TELEKINESIS_PULL", "Aim : Shadow Pull", 1);
    hero.addKeyBind("WARP_STRIKE", "Aim : Warp Strike", 1);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", -1);
    hero.addKeyBindFunc("LEDGE_TELEPORT", (entity, manager) => {
        var rayCast = block.raycast(entity, 32);
        if (rayCast != null) {
            var x = rayCast.blockPosition[0],
            y = rayCast.blockPosition[1],
            z = rayCast.blockPosition[2];
            var safeY = block.safeY(entity, [x, y, z], info["ledge"]);
            if (safeY.safe && entity.getData('fiskheroes:teleport_delay') == 0 && entity.getData('fiskheroes:teleport_timer') == 0) {
                manager.setDataWithNotify(entity, "shadows:dyn/stamina", entity.getData("shadows:dyn/stamina") + 0.1);
                manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, safeY.position, z, entity.world().getDimension()));
                manager.setData(entity, "fiskheroes:teleport_delay", 10);
            }
        }
        return true;
    }, "Ledge Teleport", 2);
    hero.addKeyBind("UTILITY_BELT", "Throwing Stars", 2);
    hero.addKeyBind("SPELL_MENU", "Mesmerize/Silhouette", 2);
    hero.addKeyBind("WRAITH", "Wraith", 3);
    hero.addKeyBind("CHARGED_BEAM", "Shadow Kill", 3);
    hero.addKeyBindFunc("WHISPER", (entity, manager) => {
        if (entity.getData("shadows:dyn/5float_interp_reset") == 0 && !entity.getData("shadows:dyn/5boolean_reset")) {
            manager.setData(entity, "shadows:dyn/5boolean_reset", true);
            entity.playSound("shadows:aragami.abilities.whisper", 2, 1 - Math.random() * 0.3);
        }
        return true;
    }, "Whisper", 3);

    hero.addKeyBind("BLOOD_SMOKE", "Blood Smoke(Punch To Activate)", 4);

    hero.addSoundEvent("PUNCH", "shadows:aragami/punch");
    dash.addAttributeProfiles(hero, info);
    hero.addAttributeProfile("WARP_STRIKE", profile => {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 5, 0);
        profile.addAttribute("WEAPON_DAMAGE", 8, 0);
    });

    hero.addAttributeProfile("DEATH", profile => {
        profile.inheritDefaults();
        profile.addAttribute("MAX_HEALTH", -10, 1);
    });
    hero.addAttributeProfile("BLOOD_SMOKE", profile => {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 1, 0);
        profile.addAttribute("WEAPON_DAMAGE", 4, 0);
    });
    hero.addAttributeProfile("STAMINA", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("JUMP_HEIGHT", 0, 1);
    });
    hero.addAttributeProfile("NOTHING", profile => {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -1, 1);
        profile.addAttribute("SPRINT_SPEED", -1, 1);
        profile.addAttribute("JUMP_HEIGHT", -10, 1);
        profile.addAttribute("PUNCH_DAMAGE", -10, 1);
        profile.addAttribute("WEAPON_DAMAGE", -10, 1);
    });
    hero.setAttributeProfile(entity => {
        switch (true) {
        case entity.getData("fiskheroes:beam_charge") > 0:
            return "NOTHING";
        case entity.getData("shadows:dyn/1float_reset") == 1 && entity.isInWater():
            return "DEATH";
        case entity.getData("shadows:dyn/stamina_out"):
            return "STAMINA";
        case entity.getData("shadows:dyn/warp_strike"):
            return "WARP_STRIKE";
        case entity.getData("shadows:dyn/2boolean_reset"):
            return "BLOOD_SMOKE";
        default:
            return dash.setAttributeProfile(entity, info);
        }
    });

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", (entity) => true);
    hero.setTickHandler((entity, manager) => {
        var clamp = (value, min, max) => {
            return Math.min(Math.max(value, min), max);
        };

        // sword hand
        var data1 = (entity.getData("fiskheroes:energy_projection_timer") == 0 && (Math.abs(entity.motionX()) == 0 || Math.abs(entity.motionZ()) == 0) && (entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() == 1 || !entity.getWornChestplate().nbt().hasKey("Equipment")) && entity.getHeldItem().isEmpty());
        var data2 = entity.getData("shadows:dyn/1float_interp_reset");

        if (!data1 && data2 > 0) {
            manager.setData(entity, "shadows:dyn/1float_interp_reset", clamp(data2 - 0.2, 0, 1))
        }
        if (data1 && data2 < 1) {
            manager.setData(entity, "shadows:dyn/1float_interp_reset", clamp(data2 + 0.2, 0, 1))
        }

        // air jump/dash

        var doubleJumpStart = entity.getData("shadows:dyn/3float_reset");
        var doubleJumpTimer = entity.getData("shadows:dyn/2float_interp_reset");
        var doubleJumpY = entity.getData("shadows:dyn/4float_reset");

        if (doubleJumpStart > jump && entity.posY() > doubleJumpY + 0.01 && doubleJumpTimer == 0 && !entity.isSprinting() && !entity.getData(info["datas"]["didDash"]) && !entity.getData("shadows:dyn/stamina_out")) {
            manager.setData(entity, "shadows:dyn/1boolean_reset", true);
        } else if (entity.getData("shadows:dyn/1boolean_reset") && entity.isOnGround()) {
            manager.setData(entity, "shadows:dyn/1boolean_reset", false);
        }

        if (!entity.getData("shadows:dyn/1boolean_reset")) {
            if (entity.getData("fiskheroes:teleport_timer") > 0) {
                manager.setData(entity, "shadows:dyn/4float_reset", entity.posY());
                manager.setData(entity, "shadows:dyn/3float_reset", 0);
            }
            if (doubleJumpStart > jump - 0.1 && doubleJumpStart < jump - 0.05) {
                manager.setData(entity, "shadows:dyn/4float_reset", entity.posY());
            } else if (doubleJumpStart == 1) {
                manager.setData(entity, "shadows:dyn/3float_reset", 0);
            }
        }
        var doubleJumpTimer = entity.getData("shadows:dyn/2float_interp_reset");
        dash.setTickHandler(entity, manager, info, entity.getData("fiskheroes:aiming_timer") == 0 && (doubleJumpTimer == 0 || doubleJumpTimer == 1) && entity.getData("fiskheroes:teleport_timer") == 0 && !entity.getData("shadows:dyn/stamina_out") && !entity.isInWater() && !entity.getData("shadows:dyn/3boolean_reset"), entity.getHeldItem().isEmpty() && !entity.getData("shadows:dyn/3boolean_reset"));

        // aim sneaking or aim not sneaking
        var data1 = entity.getData("fiskheroes:aiming");
        var aimType = entity.getData("shadows:dyn/1string_reset");
        if (aimType == null && data1) {
            manager.setData(entity, "shadows:dyn/1string_reset", entity.isSneaking() ? "Sneaking" : "NotSneaking");
        } else if (aimType != null && !data1) {
            manager.setData(entity, "shadows:dyn/1string_reset", null);
        }
        // shadow pull
        if (aimType == "Sneaking") {
            var data1 = entity.getData("shadows:dyn/shadow_pull_timer");
            var data2 = entity.getData("shadows:dyn/shadow_pull");
            if (data1 == 0 && data2 || data1 == 1 && !data2) {
                manager.setData(entity, "shadows:dyn/shadow_pull", !data2);
            }
            if (entity.getData("fiskheroes:grab_id") > -1 && entity.getData("fiskheroes:grab_distance") > 0) {
                manager.setData(entity, "fiskheroes:grab_distance", -0.05);
            }
        }

        // warp strike
        if (aimType == "NotSneaking" && entity.getData("fiskheroes:grab_id") > -1) {
            manager.setData(entity, "fiskheroes:telekinesis", false);
            var floor = (value) => {
                return Math.floor(value);
            };

            var entityGrabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
            manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(floor(entityGrabbed.posX()), floor(entityGrabbed.posY()), floor(entityGrabbed.posZ()), entity.world().getDimension()));
            manager.setData(entity, "fiskheroes:teleport_delay", 10);

            manager.setData(entity, "shadows:dyn/warp_strike", true);
        }
        // blood smoke
        if ((entity.getData("shadows:dyn/5float_reset") == 1 || entity.isSprinting() || !entity.isOnGround()) && entity.getData("shadows:dyn/2boolean_reset")) {
            manager.setData(entity, "shadows:dyn/2boolean_reset", false);
        }
        if (!entity.getData("shadows:dyn/2boolean_reset") && entity.getData("shadows:dyn/5float_reset") != 0) {
            manager.setData(entity, "shadows:dyn/5float_reset", 0);
        }
        if (entity.getPunchTimer() > 0 && entity.getData("shadows:dyn/2boolean_reset")) {
            manager.setData(entity, "shadows:dyn/3boolean_reset", true);
            manager.setData(entity, "shadows:dyn/2boolean_reset", false);
        }
        if (!entity.isOnGround() && entity.getData("shadows:dyn/3boolean_reset")) {
            manager.setData(entity, "shadows:dyn/3boolean_reset", false);
        }
        // invisibility for wraith and blood smoke
        var data = Math.max(entity.getData("shadows:dyn/4float_interp_reset"), entity.getData("shadows:dyn/3float_interp_reset"));
        if ((data == 1) != entity.getData("fiskheroes:invisible")) {
            manager.setData(entity, "fiskheroes:invisible", data == 1);
        }
        // whisper
        if (entity.getData("shadows:dyn/5float_interp_reset") == 1 && entity.getData("shadows:dyn/5boolean_reset")) {
            manager.setData(entity, "shadows:dyn/5boolean_reset", false);
        }
        // stamina
        var stamina_out = entity.getData("shadows:dyn/stamina_out");
        var stamina = entity.getData("shadows:dyn/stamina");
        if (!stamina_out && stamina >= 1) {
            manager.setData(entity, "shadows:dyn/stamina_out", true);
        } else if (stamina_out && stamina < 0.1) {
            manager.setData(entity, "shadows:dyn/stamina_out", false);
        }
        // return to random
        suit.returnSuit(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    var aimType = entity.getData("shadows:dyn/1string_reset");

    var doubleJumpTimer = entity.getData("shadows:dyn/2float_interp_reset");
    var doubleJumpStart = entity.getData("shadows:dyn/3float_reset");
    var motionY = entity.motionY();
    var motion = Math.abs(entity.motionZ()) > 0.2 || Math.abs(entity.motionX()) > 0.2;
    var hand = entity.getHeldItem().isEmpty();
    if ((entity.isInWater() || entity.getData("shadows:dyn/stamina_out")) && modifier.name() != "fiskheroes:cooldown") {
        return false;
    }
    switch (modifier.name()) {
    case "fiskheroes:propelled_flight":
        return !entity.getData(info["datas"]["didDash"]) && doubleJumpTimer == 0 && doubleJumpStart > jump - 0.2 && doubleJumpStart < jump && motionY > -0.3 && !entity.isSprinting() && entity.getData("fiskheroes:teleport_timer") == 0;
    case "fiskheroes:flight":
        var flight = entity.getData("shadows:dyn/1boolean_reset") && doubleJumpTimer < 0.7 && motionY > -0.2 && motionY < 0.3;
        return flight && motion ? modifier.id() == "double_jump_flight_slow" : flight;
    case "fiskheroes:telekinesis":
        return aimType == "Sneaking" && !entity.getData("shadows:dyn/shadow_pull") ? modifier.id() == "shadow_pull_telekinesis" : aimType == "NotSneaking" && entity.getData("shadows:dyn/warp_strike_timer") == 0 ? modifier.id() == "warp_strike_telekinesis" : false;
    case "fiskheroes:equipment":
        return !entity.isSprinting() && entity.getHeldItem().isEmpty() && !entity.getData("shadows:dyn/4boolean_reset") && entity.getData("shadows:dyn/3float_interp_reset") == 0;
    case "fiskheroes:charged_beam":
        return entity.getData("fiskheroes:aiming_timer") == 1 && entity.isOnGround() && hand;
    case "fiskheroes:shield":
        return entity.as("DISPLAY").getDisplayType() != "BOOK_PREVIEW";
    default:
        return dash.setModifierEnabled(entity, modifier, info);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var aim = entity.getData("fiskheroes:aiming_timer");
    var hand = entity.getHeldItem().isEmpty();
    if (entity.getData("shadows:dyn/stamina_out") || entity.isInWater() || entity.isSprinting() && keyBind != "AIM" || entity.getData(info["datas"]["dash"]) || entity.getData("shadows:dyn/1boolean_reset") && entity.getData("shadows:dyn/2float_interp_reset") < 1 || entity.getData("shadows:dyn/2boolean_reset") || entity.getData("shadows:dyn/4float_interp_reset") > 0 || entity.getData("shadows:dyn/3float_interp_reset") > 0 && keyBind != "WRAITH") {
        return false;
    }
    var condition = !entity.getData("shadows:dyn/4boolean_reset") && entity.getData("shadows:dyn/3float_interp_reset") == 0 && entity.getData("fiskheroes:beam_charge") == 0;
    switch (keyBind) {
    case "WARP_STRIKE":
        return condition && entity.getData("shadows:dyn/1string_reset") == "NotSneaking" && aim == 1;
    case "TELEKINESIS_PULL":
        return condition && entity.getData("shadows:dyn/1string_reset") == "Sneaking" && aim == 1;
    case "TELEKINESIS":
        return aim == 1 && entity.isOnGround() && entity.getData("shadows:dyn/3float_interp_reset") == 0;
    case "UTILITY_BELT":
        return condition && entity.isSneaking() && aim < 1 && hand;
    case "SPELL_MENU":
        return condition && (!entity.isSneaking() || !hand) && aim < 1;
    case "LEDGE_TELEPORT":
        return condition && aim == 1;
    case "CHARGED_BEAM":
        return aim == 1 && entity.isOnGround() && entity.getData("fiskheroes:beam_charge") == 0 && hand;
    case "WRAITH":
        return entity.getData("shadows:dyn/3float_interp_reset") == 0 && (!entity.isSneaking() || !hand) && aim < 1 || entity.getData("shadows:dyn/3float_interp_reset") > 0;
    case "WHISPER":
        return entity.getData("shadows:dyn/3float_interp_reset") == 0 && entity.isSneaking() && aim < 1 && hand;
    case "BLOOD_SMOKE":
        return aim < 1 && entity.isOnGround() && entity.getData("shadows:dyn/blood_smoke_cooldown") == 0 && entity.getData("shadows:dyn/3float_interp_reset") == 0;
    default:
        return true;
    }
}
