function setTickHandler(entity, manager, info, enabled, shield) {
  if (enabled == undefined) {
    var enabled = true;
  }
  if (shield == undefined) {
    var shield = false;
  }

  var didDash = entity.getData(info["datas"]["didDash"]);
  var dashTimer = entity.getData(info["datas"]["dashTimer"]);
  var allowDash = entity.getData(info["datas"]["allowDash"]);
  var dash = entity.getData(info["datas"]["dash"]);
  var motionY = entity.motionY();

  // whether to allow dash or not
  if ((motionY < info["numbers"]["fallingCheck"] || entity.getData("fiskheroes:flying") || entity.isOnGround()) && enabled && !allowDash) {
    manager.setData(entity, info["datas"]["allowDash"], true);
  } else if ((!entity.isOnGround() && !entity.getData("fiskheroes:flying") && motionY >= info["numbers"]["fallingCheck"] || !enabled) && allowDash) {
    manager.setData(entity, info["datas"]["allowDash"], false);
  }

  // did dash or no
  if (dashTimer > 0.6 && !didDash) {
    manager.setData(entity, info["datas"]["didDash"], true);
  } else if (didDash && (!entity.isSprinting() || entity.getData('shadows:dyn/stamina_out')) && entity.isOnGround()) {
    manager.setData(entity, info["datas"]["didDash"], false);
  }
  // is dashing or not
  if (allowDash && entity.isSprinting() && dashTimer == 0 && (!didDash || didDash && !entity.isOnGround() &&
      motionY > info["numbers"]["fallingCheck"])) {
    manager.setData(entity, info["datas"]["dash"], true);
  } else if (!entity.isSprinting() && dash && motionY <= 0) {
    manager.setData(entity, info["datas"]["dash"], false);
  }
  // shielding while dashing and air dash
  if (dash && dashTimer < info["numbers"]["dashMaxTimer"]) {
    if (!entity.isOnGround() && !entity.getData("fiskheroes:flying")) {
      manager.setData(entity, "fiskheroes:flying", true);
    }
    if (shield && (!entity.getData("fiskheroes:shield") || !entity.getData("fiskheroes:shield_blocking"))) {
      manager.setData(entity, "fiskheroes:shield", true);
      manager.setData(entity, "fiskheroes:shield_blocking", true);
    }
  }
  
  if ((entity.getData("fiskheroes:shield") || entity.getData("fiskheroes:shield_blocking")) && (dashTimer >= info["numbers"]["dashMaxTimer"] || !dash || !shield)) {
    manager.setData(entity, "fiskheroes:shield", false);
    manager.setData(entity, "fiskheroes:shield_blocking", false);
  }
  
}

function setModifierEnabled(entity, modifier, info) {
  var didDash = entity.getData(info["datas"]["didDash"]);
  var dashTimer = entity.getData(info["datas"]["dashTimer"]);
  var allowDash = entity.getData(info["datas"]["allowDash"]);
  var dash = entity.getData(info["datas"]["dash"]);
  switch (modifier.name()) {
  case "fiskheroes:leaping":
    return (modifier.id() == "dash_leap" && !didDash || modifier.id() == "after_dash_leap" && didDash) && allowDash && (dashTimer < info["numbers"]["leapMaxTimer"] && dash || dashTimer == 0);
  case "fiskheroes:controlled_flight":
    return allowDash && !didDash && entity.getData(info["datas"]["dash"]) && dashTimer < info["numbers"]["dashMaxTimer"] && entity.motionY() < info["numbers"]["fallingCheck"] + 0.1;
  default:
    return true;
  }
}

function setAttributeProfile(entity, info) {
  var dashTimer = entity.getData(info["datas"]["dashTimer"]);
  if (dashTimer > 0 && dashTimer < info["numbers"]["dashMaxTimer"] && entity.getData(info["datas"]["dash"])) {
    if (dashTimer < info["numbers"]["leapMaxTimer"] - 0.05) {
      return "DASH";
    } else {
      return "DASH_NO_JUMP";
    }
  }
  if (entity.getData(info["datas"]["didDash"]) && entity.isOnGround()) {
    return "SPRINT";
  }
  return null;
}

function addAttributeProfiles(hero, info) {
  hero.addAttributeProfile("DASH", profile => {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", info["numbers"]["dashSprintSpeed"], 1);
  });
  hero.addAttributeProfile("DASH_NO_JUMP", profile => {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", info["numbers"]["dashSprintSpeed"], 1);
    profile.addAttribute("JUMP_HEIGHT", -1000, 1);
  });

  hero.addAttributeProfile("SPRINT", profile => {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", info["numbers"]["afterDashSprintSpeed"], 1);
  });
}