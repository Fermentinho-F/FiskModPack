function init(renderer, trailType) {
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        var speed = entity.getData("fiskheroes:speed");
        shake.factor = speed > 1 && entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") ? (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer")) : 0;
        return true;
    });
    shake.intensity = 0.1;

var run_shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
    var speed = entity.getData("fiskheroes:speed");
    var sprintTimer = entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer");
    var isSprinting = entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting");
    
    if (speed > 1 && isSprinting) {
        var shakeFactor = (Math.log(speed - 1) + 1) * 0.5 * Math.sin(Math.PI * sprintTimer);
        
        // Check if entity_sprint_timer is 1 and adjust shakeFactor if needed
        if (sprintTimer === 1) {
            var epsilon = 1.0; // Small value to prevent shakeFactor from becoming 0
            shakeFactor = epsilon;
        }
        
        run_shake.factor = shakeFactor;
    } else {
        run_shake.factor = 0;
    }
    
    return true;
});

run_shake.intensity = 0.02


    if (typeof trailType !== "undefined") {
        bindTrail(renderer, trailType);
    }

var anim = renderer.createResource("ANIMATION", "sl:dceu_speedster_sprint");
anim.setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:dyn/speed_sprint_timer") / 1));
renderer.addCustomAnimation("speedster.SPRINT", anim);
anim.setCondition(entity => !entity.getData("sl:dyn/brake"));

var anim3 = renderer.createResource("ANIMATION", "sl:speedster_walking");
anim3.setData((entity, data) => data.load(entity.getInterpolatedData("sl:dyn/speed_timer") / 1));
renderer.addCustomAnimation("speedster.RUN", anim3);
anim3.setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.isSprinting() && !entity.getData("sl:dyn/brake"));

var anim4 = renderer.createResource("ANIMATION", "sl:speedster_walking");
anim4.setData((entity, data) => data.load(entity.getInterpolatedData("sl:dyn/speed_timer") / 1));
renderer.addCustomAnimation("speedster.RUNSLOW", anim4);
anim4.setCondition(entity => entity.getData("fiskheroes:speed") == 1 && entity.isSprinting() && !entity.getData("sl:dyn/brake"));

}

function bindTrail(renderer, trailType) {
    var prop = renderer.bindProperty("fiskheroes:trail");
    prop.setTrail(renderer.createResource("TRAIL", trailType));
    prop.setCondition(entity => entity.getData("fiskheroes:speed_sprinting"));
    return prop;

    var prop2 = renderer.bindProperty("fiskheroes:trail");
    prop2.setTrail(renderer.createResource("TRAIL", "sl:dceu_flash_static"));
    prop2.setCondition(entity => entity.getData("fiskheroes:speeding"));
    return prop2;
}
