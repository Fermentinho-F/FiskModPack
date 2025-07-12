function oxygenStrongInverse(entity, manager) {
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var breathlevel2 = entity.getData("sl:dyn/heat_breath_level");
    var heatbreath1 = (breathlevel2 <= -0.25 && breathlevel2 > -0.5);
    var heatbreath2 = (breathlevel2 <= -0.5 && breathlevel2 > -0.75);
    var heatbreath3 = (breathlevel2 <= -0.75);
    var superbreath1 = (breathlevel >= 0.25 && breathlevel < 0.5);
    var superbreath2 = (breathlevel >= 0.5 && breathlevel < 0.75);
    var superbreath3 = (breathlevel >= 0.75);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    var oxygen = entity.getData("sl:dyn/oxygen");

var energypTimer = entity.getData("fiskheroes:energy_projection_timer");
var flightTimer = entity.getData("fiskheroes:flight_timer");
var result = energypTimer - flightTimer;
if (result < 0) {
    result = 0;
}
manager.setData(entity, "sl:dyn/steelchargedata", result);

    if (entity.getData("fiskheroes:energy_projection")) {
        // Adjust oxygen consumption for energy projection (breath power)
        if (heatbreath1 || superbreath1) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0022); // Low level consumption
        } else if (heatbreath2 || superbreath2) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.005); // Medium level consumption
        } else if (heatbreath3 || superbreath3) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0075); // High level consumption
        }
    }

    if ((dim === 0 || dim === -1 || dim === 2 || dim === 7 || dim === 20) && !entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/oxygen") > 0 && entity.world().getBlock(entity.pos().add(0.0, 1.5, 0.0)) != "minecraft:water") {
        // Adjust oxygen consumption for non-breath related activities (e.g., being underwater)
        manager.setData(entity, "sl:dyn/oxygen", oxygen - 0.005);
    }

    if ((dim === 2595 || dim === 2594) && !entity.getData("fiskheroes:energy_projection")) {
        manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0005); // Adjust oxygen gain on the moon
    } else if ((dim === 2595 || dim === 2594) && entity.getData("fiskheroes:energy_projection")) {
        manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0045); // Adjust oxygen gain on the moon with energy projection
    }

    if (dim !== 2595) {
        manager.setData(entity, "sl:dyn/notonmoon", true);
    } else {
        manager.setData(entity, "sl:dyn/notonmoon", false);
    }
}
function oxygenStrong(entity, manager) {
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var coldbreath1 = (breathlevel <= -0.25 && breathlevel > -0.5);
    var coldbreath2 = (breathlevel <= -0.5 && breathlevel > -0.75);
    var coldbreath3 = (breathlevel <= -0.75);
    var superbreath1 = (breathlevel >= 0.25 && breathlevel < 0.5);
    var superbreath2 = (breathlevel >= 0.5 && breathlevel < 0.75);
    var superbreath3 = (breathlevel >= 0.75);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    var oxygen = entity.getData("sl:dyn/oxygen");

var energypTimer = entity.getData("fiskheroes:energy_projection_timer");
var flightTimer = entity.getData("fiskheroes:flight_timer");
var result = energypTimer - flightTimer;
if (result < 0) {
    result = 0;
}
manager.setData(entity, "sl:dyn/steelchargedata", result);


    if (entity.getData("fiskheroes:energy_projection")) {
        // Adjust oxygen consumption for energy projection (breath power)
        if (coldbreath1 || superbreath1) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0022); // Low level consumption
        } else if (coldbreath2 || superbreath2) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.005); // Medium level consumption
        } else if (coldbreath3 || superbreath3) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0075); // High level consumption
        }
    }

    if ((dim === 0 || dim === -1 || dim === 2 || dim === 7 || dim === 20) && !entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/oxygen") > 0 && entity.world().getBlock(entity.pos().add(0.0, 1.5, 0.0)) != "minecraft:water") {
        // Adjust oxygen consumption for non-breath related activities (e.g., being underwater)
        manager.setData(entity, "sl:dyn/oxygen", oxygen - 0.005);
    }

    if ((dim === 2595 || dim === 2594) && !entity.getData("fiskheroes:energy_projection")) {
        manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0005); // Adjust oxygen gain on the moon
    } else if ((dim === 2595 || dim === 2594) && entity.getData("fiskheroes:energy_projection")) {
        manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0045); // Adjust oxygen gain on the moon with energy projection
    }

    if (dim !== 2595) {
        manager.setData(entity, "sl:dyn/notonmoon", true);
    } else {
        manager.setData(entity, "sl:dyn/notonmoon", false);
    }
}

function oxygenWeak(entity, manager) {
  var x = entity.posX();
  var y = entity.posY();
  var z = entity.posZ();
  var dim = entity.world().getDimension();
  var oxygen = entity.getData("sl:dyn/oxygen");

var energypTimer = entity.getData("fiskheroes:energy_projection_timer");
var flightTimer = entity.getData("fiskheroes:flight_timer");
var result = energypTimer - flightTimer;
if (result < 0) {
    result = 0;
}
manager.setData(entity, "sl:dyn/steelchargedata", result);

    if (entity.getData("fiskheroes:energy_projection")) {
      manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.005);
    }

    if ((dim === 0 || dim === -1 || dim === 2 || dim === 7 || dim === 20) && !entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/oxygen") > 0 && entity.world().getBlock(entity.pos().add(0.0, 1.5, 0.0)) != "minecraft:water") {
      manager.setData(entity, "sl:dyn/oxygen", oxygen - 0.005);
    }

    if ((dim === 2595 || dim === 2594) && !entity.getData("fiskheroes:energy_projection")) {
      manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0005);
    } else if ((dim === 2595 || dim === 2594) && entity.getData("fiskheroes:energy_projection")) {
      manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0055);
    }

    if (dim !== 2595) {
      manager.setData(entity, "sl:dyn/notonmoon", true);
    } else {
      manager.setData(entity, "sl:dyn/notonmoon", false);
    }
}

function oxygenWeakInverse(entity, manager) {
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var breathlevel2 = entity.getData("sl:dyn/heat_breath_level");
    var heatbreath1 = (breathlevel2 <= -0.25 && breathlevel2 > -0.5);
    var heatbreath2 = (breathlevel2 <= -0.5 && breathlevel2 > -0.75);
    var heatbreath3 = (breathlevel2 <= -0.75);
    var superbreath1 = (breathlevel >= 0.25 && breathlevel < 0.5);
    var superbreath2 = (breathlevel >= 0.5 && breathlevel < 0.75);
    var superbreath3 = (breathlevel >= 0.75);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    var oxygen = entity.getData("sl:dyn/oxygen");

var energypTimer = entity.getData("fiskheroes:energy_projection_timer");
var flightTimer = entity.getData("fiskheroes:flight_timer");
var result = energypTimer - flightTimer;
if (result < 0) {
    result = 0;
}
manager.setData(entity, "sl:dyn/steelchargedata", result);


    if (entity.getData("fiskheroes:energy_projection")) {
        // Adjust oxygen consumption for energy projection (breath power)
        if (heatbreath1 || superbreath1) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0032); // Low level consumption
        } else if (heatbreath2 || superbreath2) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.006); // Medium level consumption
        } else if (heatbreath3 || superbreath3) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0085); // High level consumption
        }
    }

    if ((dim === 0 || dim === -1 || dim === 2 || dim === 7 || dim === 20) && !entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/oxygen") > 0 && entity.world().getBlock(entity.pos().add(0.0, 1.5, 0.0)) != "minecraft:water") {
        // Adjust oxygen consumption for non-breath related activities (e.g., being underwater)
        manager.setData(entity, "sl:dyn/oxygen", oxygen - 0.00425);
    }

    if ((dim === 2595 || dim === 2594) && !entity.getData("fiskheroes:energy_projection")) {
        manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0005); // Adjust oxygen gain on the moon
    } else if ((dim === 2595 || dim === 2594) && entity.getData("fiskheroes:energy_projection")) {
        manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0045); // Adjust oxygen gain on the moon with energy projection
    }

    if (dim !== 2595) {
        manager.setData(entity, "sl:dyn/notonmoon", true);
    } else {
        manager.setData(entity, "sl:dyn/notonmoon", false);
    }
}

function kryptoniteWeakness(entity, manager) {
    if (
        entity.isPlayer() &&
        (
            entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" ||
            entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite" ||
            entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_ring" ||
            entity.hasPotionEffect(9)
        ) &&
        (
            entity.getWornChestplate().nbt().getString('HeroType') !== 'sl:anderson' ||
            entity.getData("sl:dyn/xkryptonite")
        )
    ) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", true);
} else {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", false);
}
var timer = entity.getData("sl:dyn/kryptonite_sickness_timer");
if (entity.getData("sl:dyn/kryptonite_sickness")) {
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.6) {
    manager.setData(entity, "sl:dyn/kryptonite_sickness_timer", timer + 0.0025);
  }
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.6) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer - 0.0025);
  }
} else {
  manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer / 1.025);
}
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55 && entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
}

function bluekryptoniteWeakness(entity, manager) {
if ((entity.getHeldItem().nbt().getString('WeaponType') === "sl:blue_kryptonite_shard" || entity.getHeldItem().nbt().getString('WeaponType') === "sl:blue_kryptonite" || entity.hasPotionEffect(23)) && entity.isPlayer() ) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", true);
} else {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", false);
}
var timer = entity.getData("sl:dyn/kryptonite_sickness_timer");
if (entity.getData("sl:dyn/kryptonite_sickness")) {
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.6) {
    manager.setData(entity, "sl:dyn/kryptonite_sickness_timer", timer + 0.0025);
  }
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.6) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer - 0.0025);
  }
} else {
  manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer / 1.025);
}
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55 && entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
}

function kryptoniteWeaknessInhaler(entity, manager) {
if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" || entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite" || entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_ring" || entity.hasPotionEffect(9) && entity.getData("sl:dyn/xkryptonite_timer") === 1) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", true);
} else {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", false);
}
var timer = entity.getData("sl:dyn/kryptonite_sickness_timer");
if (entity.getData("sl:dyn/kryptonite_sickness")) {
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.6 && entity.getData("sl:dyn/xkryptonite_timer") === 1) {
    manager.setData(entity, "sl:dyn/kryptonite_sickness_timer", timer + 0.0025);
  }
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.6) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer - 0.0025);
  }
} else {
  manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer / 1.025);
}
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55 && entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
}

function xkryptoniteWeakness(entity, manager) {
    if (
        (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard" || entity.hasPotionEffect(23)) &&
        (entity.getWornChestplate().nbt().getString('HeroType') !== 'sl:lana_rho' || entity.getData("sl:dyn/kryptonite"))
    ) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", true);
} else {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", false);
}
var timer = entity.getData("sl:dyn/kryptonite_sickness_timer");
if (entity.getData("sl:dyn/kryptonite_sickness")) {
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.6) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer + 0.0025);
  }
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.6) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer - 0.0025);
  }
} else {
  manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer / 1.025);
}
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55 && entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
}

function xkryptoniteWeaknessInhaler(entity, manager) {
if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard" || entity.hasPotionEffect(23) && entity.getData("sl:dyn/kryptonite_timer") === 1) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", true);
} else {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness", false);
}
var timer = entity.getData("sl:dyn/kryptonite_sickness_timer");
if (entity.getData("sl:dyn/kryptonite_sickness")) {
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.6 && entity.getData("sl:dyn/kryptonite_timer") === 1) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer + 0.0025);
  }
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.6) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer - 0.0025);
  }
} else {
  manager.setDataWithNotify(entity, "sl:dyn/kryptonite_sickness_timer", timer / 1.025);
}
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55 && entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
}

function supercharge(entity, manager) {
  var x = entity.posX();
  var y = entity.posY();
  var z = entity.posZ();
  var dim = entity.world().getDimension();
  var es_charge = entity.getData("sl:dyn/es_charge")
  manager.setData(
    entity,
    "fiskheroes:energy_charging",
    entity.posY() > 1028 &&
      (dim === 0 || dim === 2595) &&
      !entity.isSprinting() &&
      !entity.getData("sl:dyn/absorb") &&
      !entity.getData("sl:dyn/suitup") &&
      entity.getData("sl:dyn/absorb_cooldown") == 0 &&
      entity.getData("fiskheroes:prev_flight_timer") > 0.9
  );

  if (
    entity.getData("fiskheroes:energy_charging") &&
    entity.posY() > 1028 &&
    (dim === 0 || dim === 2595) &&
    !entity.isSprinting() &&
    entity.getData("sl:dyn/absorb_cooldown") == 0 &&
    !entity.getData("sl:dyn/absorb") &&
    !entity.getData("sl:dyn/suitup") &&
    entity.getData("fiskheroes:prev_flight_timer") > 0.9
  ) {
    manager.setData(entity, "sl:dyn/sun", true);
  } else {
    manager.setData(entity, "sl:dyn/sun", false);
  }
  if (!entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "sl:dyn/es_charge", 0);
  }
  if (entity.getData("sl:dyn/sboost2")) {
     manager.setData(entity, "sl:dyn/es_charge", es_charge + 0.00125);
  }
  if (entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "fiskheroes:energy_charge", 0);
  }

  if (!entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "sl:dyn/sboost2", false);
  }
}

function inversesupercharge(entity, manager) {
  var x = entity.posX();
  var y = entity.posY();
  var z = entity.posZ();
  var dim = entity.world().getDimension();
  var es_charge = entity.getData("sl:dyn/es_charge")
  manager.setData(
    entity,
    "fiskheroes:energy_charging",
    entity.posY() > 1028 &&
      dim === -1 &&
      !entity.isSprinting() &&
      !entity.getData("sl:dyn/inverseabsorb") &&
      !entity.getData("sl:dyn/suitup") &&
      entity.getData("sl:dyn/inverseabsorb_cooldown") == 0 &&
      entity.getData("fiskheroes:prev_flight_timer") > 0.9
  );

  if (
    entity.getData("fiskheroes:energy_charging") &&
    entity.posY() > 1028 &&
    dim === -1 &&
    !entity.isSprinting() &&
    entity.getData("sl:dyn/inverseabsorb_cooldown") == 0 &&
    !entity.getData("sl:dyn/inverseabsorb") &&
    !entity.getData("sl:dyn/suitup") &&
    entity.getData("fiskheroes:prev_flight_timer") > 0.9
  ) {
    manager.setData(entity, "sl:dyn/sun", true);
  } else {
    manager.setData(entity, "sl:dyn/sun", false);
  }
  if (!entity.getData("sl:dyn/inverseabsorb")) {
    manager.setData(entity, "sl:dyn/es_charge", 0);
  }
  if (entity.getData("sl:dyn/sboost2")) {
     manager.setData(entity, "sl:dyn/es_charge", es_charge + 0.00125);
  }
  if (entity.getData("sl:dyn/inverseabsorb")) {
    manager.setData(entity, "fiskheroes:energy_charge", 0);
  }

  if (!entity.getData("sl:dyn/inverseabsorb")) {
    manager.setData(entity, "sl:dyn/sboost2", false);
  }
}
function supercharged(entity, manager) {
  var ls = entity.getData("sl:dyn/lightonoff");
  var l = entity.getData("sl:dyn/light");
  if (l >=1) {
    manager.setInterpolatedData(entity, "sl:dyn/lightonoff", true)
  };
  if (l <=0) {
      manager.setInterpolatedData(entity, "sl:dyn/lightonoff", false)
  };
  manager.incrementData(entity, "sl:dyn/light", 20, !ls);

        var item3 = entity.getEquipmentInSlot(3);
        var item2 = entity.getEquipmentInSlot(2);
        var item1 = entity.getEquipmentInSlot(1);
    var supercharged_string = item1.nbt().getBoolean("supercharged_string");

    if (item1.nbt().getBoolean("supercharged_string")) {
      manager.setData(entity, "sl:dyn/absorb", true);
  } else {
      manager.setData(entity, "sl:dyn/absorb", false);
  }

    if (entity.getUUID() == !item1.nbt().getString("OwnerName")) {
        manager.setBoolean(item1.nbt(), "supercharged_string", false);
    } 

var item3 = entity.getEquipmentInSlot(3);
if (!entity.getData("sl:dyn/absorb") && item3.nbt().getString('HeroType') === "sl:superman_supercharged") {
    var item2 = entity.getEquipmentInSlot(2);
    var item1 = entity.getEquipmentInSlot(1);

    manager.setString(item1.nbt(), "HeroType", "sl:superman");
    manager.setString(item2.nbt(), "HeroType", "sl:superman");
    manager.setString(item3.nbt(), "HeroType", "sl:superman");

    if (!entity.as("PLAYER").isCreativeMode()) {
        manager.setBoolean(item3.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item2.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item1.nbt(), "NeedsUnlock", true);
    }
} else if (!entity.getData("sl:dyn/absorb") && item3.nbt().getString('HeroType') === "sl:superman_supercharged/black2") {
    var item2 = entity.getEquipmentInSlot(2);
    var item1 = entity.getEquipmentInSlot(1);

    manager.setString(item1.nbt(), "HeroType", "sl:superman/black2");
    manager.setString(item2.nbt(), "HeroType", "sl:superman/black2");
    manager.setString(item3.nbt(), "HeroType", "sl:superman/black2");

    if (!entity.as("PLAYER").isCreativeMode()) {
        manager.setBoolean(item3.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item2.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item1.nbt(), "NeedsUnlock", true);
    }
} else if (!entity.getData("sl:dyn/absorb") && item3.nbt().getString('HeroType') === "sl:superman_supercharged/ogsuperman") {
    var item2 = entity.getEquipmentInSlot(2);
    var item1 = entity.getEquipmentInSlot(1);

    manager.setString(item1.nbt(), "HeroType", "sl:superman/ogsuperman");
    manager.setString(item2.nbt(), "HeroType", "sl:superman/ogsuperman");
    manager.setString(item3.nbt(), "HeroType", "sl:superman/ogsuperman");

    if (!entity.as("PLAYER").isCreativeMode()) {
        manager.setBoolean(item3.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item2.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item1.nbt(), "NeedsUnlock", true);
    }
} else if (!entity.getData("sl:dyn/absorb") && item3.nbt().getString('HeroType') === "sl:superman_supercharged/s1") {
    var item2 = entity.getEquipmentInSlot(2);
    var item1 = entity.getEquipmentInSlot(1);

    manager.setString(item1.nbt(), "HeroType", "sl:superman/s1");
    manager.setString(item2.nbt(), "HeroType", "sl:superman/s1");
    manager.setString(item3.nbt(), "HeroType", "sl:superman/s1");

    if (!entity.as("PLAYER").isCreativeMode()) {
        manager.setBoolean(item3.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item2.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item1.nbt(), "NeedsUnlock", true);
    }
}

    if (entity.getData("sl:dyn/absorb_cooldown") < 0.05) {
        manager.setData(entity, "fiskheroes:flying", true);
    }

    if (entity.getData("sl:dyn/absorb_cooldown") == 1) {
        manager.setBoolean(item1.nbt(), "supercharged_string", false);
    }

}

function bizarroGlitch(entity, manager) {
  var t2 = entity.getData("sl:dyn/speedup_ticks");
  if (!entity.getData("fiskheroes:mask_open") && !entity.getData("fiskheroes:beam_shooting") && !entity.getData("fiskheroes:energy_projection") && Math.random() < 0.003) {
    manager.setDataWithNotify(entity, "sl:dyn/speedup_ticks", 5);
    if (entity.getEquipmentInSlot(3).nbt().getString('HeroType') === 'sl:bizarro/normalbizarro') {
      entity.playSound("sl:main.bizarroglitch", 1.0, 1.0);
    } else {
      entity.playSound("sl:main.bizarrosound", 1.0, 1.0);
    }
  } else if (t2 > 0) {
    manager.setData(entity, "sl:dyn/speedup_ticks", --t2);
  }

  manager.incrementData(entity, "sl:dyn/speedup_timer", 2, 1, t2 > 0);
}

function supermanGlitch(entity, manager) {
  var t2 = entity.getData("sl:dyn/speedup_ticks");
  if (!entity.getData("fiskheroes:mask_open") && !entity.getData("fiskheroes:beam_shooting") && !entity.getData("fiskheroes:energy_projection") && Math.random() < 0.003 && entity.getEquipmentInSlot(3).nbt().getDouble('inhaled') > 3) {
    manager.setDataWithNotify(entity, "sl:dyn/speedup_ticks", 7);
      entity.playSound("sl:main.bizarroglitch", 1.0, 1.0);
  } else if (t2 > 0) {
    manager.setData(entity, "sl:dyn/speedup_ticks", --t2);
  }

  manager.incrementData(entity, "sl:dyn/speedup_timer", 2, 1, t2 > 0);
}

function heatBreath(entity, manager) {
    var gravitylevel = entity.getData("fiskheroes:gravity_amount");
if (entity.getData("fiskheroes:gravity_manip") || entity.getData("sl:dyn/heat_breath_charge") == 0) {
    manager.setData(entity, "sl:dyn/heat_breath_level", gravitylevel);
} else if (!entity.getData("sl:dyn/heat_breath")){
    manager.setData(entity, "sl:dyn/heat_breath_level", 0);
}
if (entity.getData("fiskheroes:gravity_manip")) {
    manager.setData(entity, "sl:dyn/prev_heat_breath_level", gravitylevel);
}
var timer = entity.getData("sl:dyn/heat_breath_timer");
if (entity.getData("fiskheroes:energy_projection")) {
    if (timer < 1) {
        manager.setData(entity, "sl:dyn/heat_breath_timer", Math.min(timer + 0.125, 1));
    }
} else {
    if (timer > 0) {
        manager.setData(entity, "sl:dyn/heat_breath_timer", Math.max(timer - 0.125, 0));
    }
}

}

function kryptoniteInhaler(entity, manager) {
if (entity.getData("sl:dyn/kryptonite_timer") < 1 && (entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler")) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite", false);
}

    manager.setData(entity, "sl:dyn/kryptonite_on", entity.getData("sl:dyn/kryptonite_timer") == 1);
    if (entity.getData("sl:dyn/kryptonite_cooldown") === 1.0) {
        manager.setDataWithNotify(entity, "sl:dyn/kryptonite", false);
    }


if (entity.getData("sl:dyn/kryptonite_timer") == 0 && entity.getData("sl:dyn/kryptonite")) {
    manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:used_inhaler");
}

    var t = entity.getData("sl:dyn/inhaler_breathe");
    if (entity.getData("sl:dyn/kryptonite_timer") === 0.5) {
        manager.setDataWithNotify(entity, "sl:dyn/inhaler_breathe", t = 25);
    } else if (t > 0) {
        manager.setData(entity, "sl:dyn/inhaler_breathe", --t);
    }
    manager.incrementData(entity, "sl:dyn/inhaler_breathe_timer", 2, 8, t > 0);

}

function xkryptoniteInhaler(entity, manager) {
if (entity.getData("sl:dyn/xkryptonite_timer") < 1 && (entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:xkryptonite_inhaler")) {
    manager.setDataWithNotify(entity, "sl:dyn/xkryptonite", false);
}

    manager.setData(entity, "sl:dyn/kryptonite_on", entity.getData("sl:dyn/xkryptonite_timer") == 1);
    if (entity.getData("sl:dyn/xkryptonite_cooldown") === 1.0) {
        manager.setDataWithNotify(entity, "sl:dyn/xkryptonite", false);
    }


if (entity.getData("sl:dyn/xkryptonite_timer") == 0 && entity.getData("sl:dyn/xkryptonite")) {
    manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:used_inhaler");
    manager.setDouble(entity.getEquipmentInSlot(3).nbt(), "inhaled", entity.getEquipmentInSlot(3).nbt().getDouble('inhaled') + 1);
}

    var t = entity.getData("sl:dyn/inhaler_breathe");
    if (entity.getData("sl:dyn/xkryptonite_timer") === 0.5) {
        manager.setDataWithNotify(entity, "sl:dyn/inhaler_breathe", t = 25);
    } else if (t > 0) {
        manager.setData(entity, "sl:dyn/inhaler_breathe", --t);
    }
    manager.incrementData(entity, "sl:dyn/inhaler_breathe_timer", 2, 8, t > 0);

}