function damageProfiles(hero) {
    hero.addAttributeProfile("MUD", mudProfile);
    hero.addAttributeProfile("CASTLE", castleProfile);
    hero.addAttributeProfile("GIANT", giantProfile);
    hero.addAttributeProfile("SAND", sandProfile);
    hero.addAttributeProfile("SAND_FIST", sandFistProfile);
    hero.addAttributeProfile("GIANT_FIST", giantFistProfile);
    hero.addAttributeProfile("FIST", fistProfile);
    hero.addAttributeProfile("SAND_HAMMER", sandHammerProfile);
    hero.addAttributeProfile("GIANT_HAMMER", giantHammerProfile);
    hero.addAttributeProfile("HAMMER", hammerProfile);
    hero.addAttributeProfile("SAND_MACE", sandMaceProfile);
    hero.addAttributeProfile("GIANT_MACE", giantMaceProfile);
    hero.addAttributeProfile("MACE", maceProfile);
    hero.setAttributeProfile(getProfile);

    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("GIANT", {
      "types": {
          "BLUNT": 1.0
      },
      "properties": {
        "EFFECTS": [
          {
              "id": "minecraft:blindness",
              "duration": 30,
              "amplifier": 0,
              "chance": 0.8
            }
        ]
      }
    });
    hero.addDamageProfile("SAND", {
    "types": {
        "BLUNT": 1.0
    },
    "properties": {
      "EFFECTS": [
        {
            "id": "minecraft:blindness",
            "duration": 10,
            "amplifier": 0,
            "chance": 0.6
          }
      ]
    }
    });
    hero.addDamageProfile("FIST", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
          "EFFECTS": [
            {
                "id": "minecraft:blindness",
                "duration": 20,
                "amplifier": 0,
                "chance": 0.6
              }
          ]
        }
    });
    hero.addDamageProfile("SAND_FIST", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
          "EFFECTS": [
            {
                "id": "minecraft:blindness",
                "duration": 30,
                "amplifier": 0,
                "chance": 0.75
              }
          ]
        }
    });
    hero.addDamageProfile("GIANT_FIST", {
      "types": {
          "BLUNT": 1.0
      },
      "properties": {
        "EFFECTS": [
          {
              "id": "minecraft:blindness",
              "duration": 30,
              "amplifier": 0,
              "chance": 0.85
            }
        ]
      }
  });
    hero.addDamageProfile("HAMMER", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
          "EFFECTS": [
            {
                "id": "minecraft:blindness",
                "duration": 15,
                "amplifier": 0,
                "chance": 0.5
              }
          ]
        }
    });
    hero.addDamageProfile("SAND_HAMMER", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
          "EFFECTS": [
            {
                "id": "minecraft:blindness",
                "duration": 25,
                "amplifier": 0,
                "chance": 0.6
              }
          ]
        }
    });
    hero.addDamageProfile("GIANT_HAMMER", {
      "types": {
          "BLUNT": 1.0
      },
      "properties": {
        "EFFECTS": [
          {
              "id": "minecraft:blindness",
              "duration": 25,
              "amplifier": 0,
              "chance": 0.7
            }
        ]
      }
  });
    hero.addDamageProfile("MACE", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.3
        },
        "properties": {
          "EFFECTS": [
            {
                "id": "minecraft:blindness",
                "duration": 15,
                "amplifier": 0,
                "chance": 0.5
              }
          ]
        }
    });
    hero.addDamageProfile("SAND_MACE", {
      "types": {
          "BLUNT": 1.0,
          "SHARP": 0.3
      },
      "properties": {
        "EFFECTS": [
          {
              "id": "minecraft:blindness",
              "duration": 20,
              "amplifier": 0,
              "chance": 0.6
            }
        ]
      }
  });
  hero.addDamageProfile("GIANT_MACE", {
    "types": {
        "BLUNT": 1.0,
        "SHARP": 0.3
    },
    "properties": {
      "EFFECTS": [
        {
            "id": "minecraft:blindness",
            "duration": 20,
            "amplifier": 0,
            "chance": 0.7
          }
      ]
    }
});
}

function mudProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("BASE_SPEED", -0.8, 1);
  profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
}

function giantProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
  profile.addAttribute("KNOCKBACK", 1.0, 0);
  profile.addAttribute("BASE_SPEED", -10.0, 1);
  profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function castleProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", -1.0, 1);
  profile.addAttribute("BASE_SPEED", -1.0, 1);
  profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function sandProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
  profile.addAttribute("BASE_SPEED", 0.1, 1);
}

function sandFistProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
  profile.addAttribute("KNOCKBACK", 2.0, 0);
  profile.addAttribute("BASE_SPEED", -0.1, 1);
}

function giantFistProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
  profile.addAttribute("KNOCKBACK", 3.0, 0);
  profile.addAttribute("BASE_SPEED", -10.0, 1);
  profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function fistProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
  profile.addAttribute("KNOCKBACK", 2.0, 0);
}

function sandHammerProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
  profile.addAttribute("KNOCKBACK", 1.0, 0);
  profile.addAttribute("BASE_SPEED", -0.1, 1);
}

function giantHammerProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
  profile.addAttribute("KNOCKBACK", 2.0, 0);
  profile.addAttribute("BASE_SPEED", -10.0, 1);
  profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function hammerProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
  profile.addAttribute("KNOCKBACK", 1.0, 0);
}

function sandMaceProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
  profile.addAttribute("BASE_SPEED", -0.1, 1);
}

function giantMaceProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
  profile.addAttribute("KNOCKBACK", 1.0, 0);
  profile.addAttribute("BASE_SPEED", -10.0, 1);
  profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function maceProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
}

function getProfile(entity) {
  if (entity.getData("sabri:dyn/drought_timer") == 1) {
    return "MUD";
  } else if (entity.getData("fiskheroes:scale") > 1 && !entity.getData("fiskheroes:shadowform")) {
      return entity.getData("sabri:dyn/weapon_cycle") == 1 ? "GIANT_FIST" : entity.getData("sabri:dyn/weapon_cycle") == 2 ? "GIANT_HAMMER" : entity.getData("sabri:dyn/weapon_cycle") == 3 ? "GIANT_MACE" : "GIANT";
  } else if (entity.getData("sabri:dyn/sand_castle_timer") > 0) {
      return "CASTLE";
  } else if (entity.getData("sabri:dyn/sand")) {
      return entity.getData("fiskheroes:blade") ? entity.getData("sabri:dyn/weapon_cycle") == 1 ? "SAND_FIST" : entity.getData("sabri:dyn/weapon_cycle") == 2 ? "SAND_HAMMER" : "SAND_MACE" : "SAND";
  }
  return entity.getData("sabri:dyn/weapon_cycle") == 1 ? "FIST" : entity.getData("sabri:dyn/weapon_cycle") == 2 ? "HAMMER" : entity.getData("sabri:dyn/weapon_cycle") == 3 ? "MACE" : null;
}