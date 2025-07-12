function initEffects(renderer) {
    var anim = renderer.createResource("ANIMATION", "fiskheroes:speedster_sprint");
    anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")));
    renderer.addCustomAnimation("speedster.SPRINT", anim);

var anim1 = renderer.createResource("ANIMATION", "sl:bizarro_glitch");
anim1.setData((entity, data) => data.load(1, entity.getInterpolatedData("sl:dyn/speedup_timer")));
renderer.addCustomAnimation("superman.GLITCH", anim1);

var anim2 = renderer.createResource("ANIMATION", "sl:inhale");
anim2.setData((entity, data) => {
    if (entity.getData("sl:dyn/xkryptonite")) {
        data.load(entity.getInterpolatedData("sl:dyn/xkryptonite_timer"));
    } else if (entity.getData("sl:dyn/kryptonite")) {
        data.load(entity.getInterpolatedData("sl:dyn/kryptonite_timer"));
    }
});
anim2.setCondition(entity => {
    return entity.getData("sl:dyn/xkryptonite_cooldown") < 0.5 && entity.getData("sl:dyn/xkryptonite");
});
anim2.priority = 10;
renderer.addCustomAnimation("superman.USE", anim2);

var shakehvc = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shakehvc.factor = entity.getData("fiskheroes:heat_vision_timer") == 1 ? ((Math.log(1) + 1) * 0.25) : 0;
    return true;
});

var shake3 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    var landingTimer2 = entity.getInterpolatedData("sl:dyn/soft_landing_timer");
    var factor2 = landingTimer2 > 0 ? 1 * landingTimer2 : 0;
    shake3.factor = factor2 > 0 ? factor2 : 0;
    return true;
});

shake3.intensity = 0.05; // Initial intensity set to 0.05

function updateIntensity() {
    var landingTimer2 = entity.getInterpolatedData("sl:dyn/soft_landing_timer");
    var maxIntensity = 0.05; // Set the maximum intensity
    var minIntensity = 0.01; // Set the minimum intensity
    var intensity2 = maxIntensity - (maxIntensity - minIntensity) * landingTimer2; // Gradually decrease the intensity as the landing timer progresses
    shake3.intensity = intensity2 > minIntensity ? intensity2 : minIntensity;
}

var shakeg = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shakeg.factor = (Math.log(6) + 1) * 0.6 * Math.sin(Math.PI * entity.getInterpolatedData("sl:dyn/speedup_timer"));
    return true;
});

var shakehv = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shakehv.factor = (Math.log(5) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
    return true;
});

var shaketc = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    shaketc.factor = (Math.log(6) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:beam_shooting_timer"));
    return true;
});

    var shakefb2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakefb2.factor = (entity.getData("sl:dyn/sboost2")) ? (Math.log(6) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("sl:dyn/sboost2_timer")) : 0;
        return true;
    });
    shakefb2.intensity = 0.2;

    var shakefb = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakefb.factor = (entity.getData("sl:dyn/sboost")) ? (Math.log(6) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("sl:dyn/sboost_timer")) : 0;
        return true;
    });
    shakefb.intensity = 0.2;

    var shakef = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakef.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? (Math.log(6) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shakef.intensity = 0.1;

    var shakes = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shakes.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return true;
    });
    shakes.intensity = 0.1;
    
    var dome = renderer.bindProperty("fiskheroes:shadowdome");
    
    dome.texture.set("null")

    var solarflareshake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => (entity.getData("sl:dyn/absorb") && entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_shooting_timer") > 0));
    solarflareshake.factor = 0.15;
}

function nightVision(renderer) {
  renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getHeldItem().nbt().getString('WeaponType') !== "sl:blue_kryptonite_shard").firstPersonOnly = true;
}