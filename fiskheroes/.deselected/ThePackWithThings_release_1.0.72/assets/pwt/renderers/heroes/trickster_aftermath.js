extend("fiskheroes:hero_basic");
loadTextures({
	"helmet": "pwt:tricker_helmet",
	"layer1": "pwt:tricker_layer1_test5",
    "layer2": "pwt:tricker_layer2",
	"glow_1": "pwt:trickster_mask_anim.tx.json",
	"glow_2": "pwt:tricker_glow_3",
	"cape": "pwt:tricker_cape",
	"colar": "pwt:trickster_aftermath_colar",
	"glyphs": "pwt:trickster_glyphs",
	"shadow_dome": "pwt:end_dome"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var mandalas_1 = implement("pwt:external/trickster_tao_mandalas");
var squares_1 = implement("pwt:external/trickster_square_arms");
var time_large = implement("pwt:external/trickster_time_large");

var sphere = implement("pwt:external/trickster_sphere");
var cube = implement("pwt:external/trickster_cube");
var cube_beam = implement("pwt:external/trickster_cube_beam");


var sword = implement("fiskheroes:external/eldritch_sword");

var boosters = implement("pwt:external/bloom_booster_trickster");

var beam_aiming;
var beam_chest_power;

var beam_shape_1;
var beam_shape_2;
var beam_shape_3;

var tao_mandala;
var square_shape;
	
var square_cube;
	
var time_large_shape;

var beam;

var sphere_aiming;
	
var cube_aiming;
	
var cube_L1;

var tp_telekinesis; 

var physics;
var cape;

var helmet;
var shield;
var spell;

var forcefield_small;
var forcefield_big;

var overlay_1;
var overlay_2;

var booster_boots;
var booster_back;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
		if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "helmet" && "layer1";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
	renderer.setLights((entity, renderLayer) => {
		if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:mask_open_timer2") > 0 || entity.as("DISPLAY").getDisplayType() === "HOLOGRAM") {
            return "helmet";
        }
        return null;
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
	
	///unpowered forcefield
	forcefield_small = renderer.bindProperty("fiskheroes:forcefield");
    forcefield_small.color.set(0x7D31FF);
    forcefield_small.setShape(36, 36).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield_small.setCondition(entity => {
		forcefield_small.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15 * (1-entity.getInterpolatedData('pwt:dyn/trickster_timer'));
		
        return true;
    });
	
	///powered forcefield
	forcefield_big = renderer.bindProperty("fiskheroes:forcefield");
    forcefield_big.color.set(0x7D31FF);
    forcefield_big.setShape(36, 36).setOffset(0.0, 6.0, 0.0).setScale(2.25);
    forcefield_big.setCondition(entity => {
		forcefield_big.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15 * entity.getInterpolatedData('pwt:dyn/trickster_timer');
		
        return true;
    });

	
	overlay_1 = renderer.createEffect("fiskheroes:overlay");
    overlay_1.texture.set(null, "glow_1");
	
	overlay_2 = renderer.createEffect("fiskheroes:overlay");
    overlay_2.texture.set(null, "glow_2");
	
	///cape
    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 8;
    physics.setTickHandler(entity => {
        var f = 1 - (entity.getData("fiskheroes:flight_timer") + 0.1*entity.getData("fiskheroes:shield_timer"));
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 20;
        physics.restAngle = f * 40;
        physics.restFlare = f * 0.7;
        physics.idleFlutter = 0.15 + 0.25 * f;
        physics.flutterSpeed = f * 0.3;
    });

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");
    cape.effect.texture.set("cape");


	///helmet
    helmet = renderer.createEffect("fiskheroes:ears");
    helmet.anchor.set("head");
    helmet.angle = -7;
    helmet.inset = -0.065;
	
	///shapes
    var color = 0x7D31FF;
	var color_pink = 0xf748f7;
	var color_pink_2 = 0xf74897;
	var color_blue = 0x318eff;
	var color_divine = 0x6e6ce7;
	tao_mandala = renderer.createResource("SHAPE", "fiskheroes:tao_mandala");
	square_shape = renderer.createResource("SHAPE", "pwt:square");
	
	square_cube = renderer.createResource("SHAPE", "pwt:square");
	
	time_large_shape = renderer.createResource("SHAPE", "pwt:time_large");
	
    beam = renderer.createResource("BEAM_RENDERER", "pwt:line_trickster");
    spell = renderer.createEffect("fiskheroes:lines").setShape(tao_mandala).setRenderer(beam);
    spell.color.set(color);
    spell.setOffset(1.0, 8.0, 0.0).setScale(3.2);
    spell.anchor.set("rightArm");
    spell.mirror = true;

    arm_mandalas = mandalas_1.create(renderer, color, tao_mandala, beam);
	arm_squares = squares_1.create(renderer, color, square_shape, beam);
	
	sphere_aiming = sphere.create(renderer, color_pink, time_large_shape, beam, "rightArm", 1.0, 15.0, 0.0, true);
	
	cube_aiming = cube.create(renderer, color, square_cube, beam, "rightArm", 1.0, 13.0, 0.0, true);
	
	cube_L1 = cube_beam.create(renderer, color, square_cube, beam, "body", 10.0, 0.0, -8.0);
	
	tp_telekinesis = time_large.create(renderer, color, color_blue, time_large_shape, beam);

	beam_shape_1 = renderer.createEffect("fiskheroes:lines").setShape(time_large_shape).setRenderer(beam);
	beam_shape_2 = renderer.createEffect("fiskheroes:lines").setShape(square_shape).setRenderer(beam);
	beam_shape_3 = renderer.createEffect("fiskheroes:lines").setShape(square_shape).setRenderer(beam);
	beam_shape_1.color.set(color);
	beam_shape_2.color.set(color);
	beam_shape_3.color.set(color);
	beam_shape_1.anchor.set("body");
	beam_shape_2.anchor.set("body");
	beam_shape_3.anchor.set("body");
	
	beam_shape_divine = renderer.createEffect("fiskheroes:lines").setShape(time_large_shape).setRenderer(beam);
	beam_shape_divine.color.set(color_divine);
	beam_shape_divine.anchor.set("body");
	
	tricker_protective_timer = renderer.createEffect("fiskheroes:lines").setShape(time_large_shape).setRenderer(beam);
	tricker_protective_timer.setOffset(1.0, 9.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(3.0);
	tricker_protective_timer.color.set(color_pink);
	tricker_protective_timer.anchor.set("right_arm");
	
    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(color);
    magic.colorEarthCrack.set(color);
    magic.colorAtmosphere.set(color);
    magic.colorWhip.set(color);
	
	var shadow_dome = renderer.bindProperty("fiskheroes:shadowdome");
	shadow_dome.texture.set("shadow_dome", "shadow_dome");
	shadow_dome.setShape(36, 36)

	///particle clouds 
	
	telekinesis = renderer.bindProperty("fiskheroes:telekinesis");
	drain = renderer.bindProperty("fiskheroes:telekinesis");
	var trickster_smoke = renderer.createResource("PARTICLE_CLOUD", "pwt:trickster_smoke");
	var trickster_smoke_drain = renderer.createResource("PARTICLE_CLOUD", "pwt:trickster_smoke_drain");
	
	
	telekinesis.setCondition(entity => {

		telekinesis.setCloud(trickster_smoke)
        return !(entity.getData('pwt:dyn/ability_timer') > 0) ;
    });
	drain.setCondition(entity => {

		drain.setCloud(trickster_smoke_drain)
		
        return entity.getData('pwt:dyn/ability_timer') > 0 ;
    });
	
	utils.bindParticles(renderer, "pwt:trickster_tp");
	
	
	///beams
	beam_chest_power = utils.createLines(renderer, "pwt:star_hands", color, [
        {"start": [-0.05, 0, 0], "end": [0.15, 0.0, 0.0], "size": [2.0, 1.0]},
		{"start": [0.05, 0, 0], "end": [-0.15, 0.0, 0.0], "size": [2.0, 1.0]}
    ]);
    beam_chest_power.anchor.set("body");
    beam_chest_power.setOffset(0.0, 4.5, -1.7).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    beam_chest_power.mirror = false;
	
	
	beam_aiming = utils.createLines(renderer, "pwt:star_hands", color, [
        {"start": [0, 0, 0], "end": [0.0, 0.1, 0.0], "size": [1.0, 1.0]},
    ]);
    beam_aiming.anchor.set("rightArm");
    beam_aiming.setOffset(1, 14.5, 0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    beam_aiming.mirror = true;
	
	beam_aiming_defense = utils.createLines(renderer, "pwt:star_hands", color_pink, [
        {"start": [0, 0, 0], "end": [0.0, 0.1, 0.0], "size": [2.0, 2.0]},
    ]);
    beam_aiming_defense.anchor.set("rightArm");
    beam_aiming_defense.setOffset(1, 14.5, 0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    beam_aiming_defense.mirror = true;
	
	beam_charged_beam = utils.createLines(renderer, "pwt:star_hands", color, [
        {"start": [1.0, -1.2, 0.0], "end": [0.0, -0.2, -1.5], "size": [1.0, 1.0]},
		{"start": [-1.0, -1.2, 0.0], "end": [0.0, -0.2, -1.5], "size": [1.0, 1.0]},
		{"start": [1.0, 0.6, 0.0], "end": [0.0, -0.2, -1.5], "size": [1.0, 1.0]},
		{"start": [-1.0, 0.6, 0.0], "end": [0.0, -0.2, -1.5], "size": [1.0, 1.0]},
    ]);
    beam_charged_beam.anchor.set("body");
    beam_charged_beam.setOffset(0.0, 6.0, -8.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    beam_charged_beam.mirror = false;
	
	beam_charged_beam_shoot = utils.createLines(renderer, "pwt:star_hands", color, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, 0.0, -0.5], "size": [3.0, 3.0]}
    ]);
    beam_charged_beam_shoot.anchor.set("body");
    beam_charged_beam_shoot.setOffset(0.0, 4.0, -23.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    beam_charged_beam_shoot.mirror = false;
	
	
	
	///energy_projection
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:trickster_beam", "rightArm", color, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] },

    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("offensive"));
	
		utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:trickster_beam", "rightArm", color_pink, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.5, 1.5] },

    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster_heal")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("defensive"));
	
	utils.bindBeam(renderer, "fiskheroes:energy_projection", "pwt:lightning_cast_divine", "body", color_divine, [
        { "offset": [0.0, -4560.0, -100.0], "size": [20.5, 20.5] },

    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster_divine")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("divine"));
	
	///charged_beam
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "pwt:trickster_charged_beam", "body", color, [
        { "firstPerson": [0.0, 4.0, -27.0], "offset": [0.0, 4.0, -27.0], "size": [4.0, 4.0] },

    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("offensive"));
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "pwt:star_beam", "body", color, [
        { "firstPerson": [0.0, 4.0, -27.0], "offset": [0.0, 4.0, -27.0], "size": [3.0, 3.0] },

    ]).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("offensive"));
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "pwt:trickster_defensive_beam", "rightArm", color_pink_2, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [3.0, 3.0] },
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [0.5, 12.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster_defense")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("defensive"));
	
	utils.bindBeam(renderer, "fiskheroes:charged_beam", "pwt:lightning_cast_divine", "body", color_divine, [
        { "offset": [0.0, -4560.0, -100.0], "size": [40.0, 40.0] },

    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster_divine")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("divine"));
	
	///lightning_cat
	utils.bindBeam(renderer, "fiskheroes:lightning_cast", "pwt:lightning_cast_divine", "body", color_divine, [
        { "offset": [0.0, -4560.0, -100.0], "size": [20.5, 20.5] },
	]).setParticles(renderer.createResource("PARTICLE_EMITTER", "pwt:impact_trickster_divine")).setCondition(entity => entity.getEquipmentInSlot(3).nbt().getBoolean("divine"));
	
	///GLYPHS
		var glyphs_model = renderer.createResource("MODEL", "pwt:trickster_glyphs");
		glyphs_model.bindAnimation("pwt:trickster_glyphs").setData((entity, data) => {
			var cycle = entity.getEquipmentInSlot(3).nbt().getFloat("MAGICTYPE");
			var scroll_timer = entity.getData('pwt:dyn/scroll_timer')
			data.load(0, entity.getInterpolatedData("pwt:dyn/menu_timer"));
			data.load(1, 2*entity.loop(180)*Math.PI);
			data.load(2, 2*entity.loop(180)*Math.PI-Math.PI);
			data.load(3, 2*entity.loop(180)*Math.PI+(Math.PI/2));
			data.load(4, 2*entity.loop(180)*Math.PI-(Math.PI/2));
			data.load(5, entity.getInterpolatedData('pwt:dyn/cooldown_interp')*entity.getInterpolatedData("pwt:dyn/menu_timer"));
			data.load(6, cycle == 0 ? entity.getInterpolatedData('pwt:dyn/select_timer') : 0);
			data.load(7, cycle == 1 ? entity.getInterpolatedData('pwt:dyn/select_timer') : 0);
			data.load(8, cycle == 2 ? entity.getInterpolatedData('pwt:dyn/select_timer') : 0);
			data.load(9, cycle == 3 ? entity.getInterpolatedData('pwt:dyn/select_timer') : 0);
			
		})
		.priority = -1;
		glyphs_model.texture.set("glyphs", "glyphs");
		glyphs = renderer.createEffect("fiskheroes:model").setModel(glyphs_model);
		glyphs.anchor.set("body");
		
	var colar_model = renderer.createResource("MODEL", "pwt:trickster_colar");
	colar_model.texture.set("colar");
	colar = renderer.createEffect("fiskheroes:model").setModel(colar_model);
	colar.anchor.set("head");
	
	var beam_booster = renderer.createResource("BEAM_RENDERER", "fiskheroes:atom_booster");
    var blue_fire = renderer.createResource("ICON", "fiskheroes:deep_blue_fire_layer_%s");
	booster_boots = boosters.create(renderer, "rightLeg", true, color_blue, blue_fire, beam_booster).setOffset(0.0, 13.0, 0.0).setSize(2.0, 2.0);
    booster_arms = boosters.create(renderer, "rightArm", true, color_blue, blue_fire, beam_booster).setOffset(1.0, 11.0, 0.0).setSize(2.5, 3.0);
	
	renderer.bindProperty("fiskheroes:gravity_manipulation").color.set(color_blue);
	
	///invisibility
	renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 1.0 + (0.999-0.5*entity.getInterpolatedData('fiskheroes:intangibility_timer') - 1.0) * entity.getInterpolatedData("fiskheroes:mask_open_timer2");
    });

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	renderer.removeCustomAnimation("basic.ENERGY_PROJ");
	renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "basic.AIMING", "fiskheroes:aiming", "fiskheroes:aiming_timer")
        .priority = 10;
		
	addAnimation(renderer, "beam.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getEquipmentInSlot(3).nbt().getBoolean("divine") ? 0 : entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(charge);
    });
	
	addAnimation(renderer, "beam.AIMING_DIVINE", "pwt:trickster_shield").setData((entity, data) => {
        var charge = entity.getEquipmentInSlot(3).nbt().getBoolean("divine") ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0;
        data.load(charge);
    });
	
	
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "basic.BLOCKING", "pwt:trickster_shield", "fiskheroes:shield_blocking_timer")
        .priority = -5;

    addAnimation(renderer, "strange.FLIGHT", "pwt:flight/trickster_levitate.anim.json")
        .setData((entity, data) => {
            data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
			data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        })
	.priority = -10;
	addAnimation(renderer, "strange.HOVER", "pwt:flight/idle/trickster_idle")
        .setData((entity, data) => {
			
            data.load(0, entity.getInterpolatedData("fiskheroes:levitate_timer"));
            data.load(1, entity.loop(20 * Math.PI) + 0.4);
        })
	.priority = -9.5;	
	
	addAnimation(renderer, "trickster.CYCLE", "pwt:trickster_aiming_glyphs") 
		.setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("pwt:dyn/menu_timer"));
		data.load(1, entity.getInterpolatedData("pwt:dyn/scroll_timer"));
		data.load(2, entity.getInterpolatedData("pwt:dyn/select_timer"));
    })
	.priority = -6;
}

function render(entity, renderLayer, isFirstPersonArm) {
	var item = entity.getEquipmentInSlot(3);
    var nbt = item.nbt();
	var offensive = nbt.getBoolean('offensive');
	var defensive = nbt.getBoolean('defensive');
	var evasive = nbt.getBoolean('evasive');
	var divine = nbt.getBoolean('divine');
	var aiming_timer = entity.getInterpolatedData("fiskheroes:aiming_timer");
	var trickster_timer = entity.getInterpolatedData("pwt:dyn/trickster_timer");
	var power_timer = entity.getInterpolatedData("pwt:dyn/trickster_timer");
	var menu_timer = entity.getInterpolatedData("pwt:dyn/menu_timer");
	var pitch = entity.rotPitch() * Math.PI / 180;
	var flight = entity.getInterpolatedData("fiskheroes:flight_timer");
	var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
	

    if (renderLayer == "CHESTPLATE") {
		if (!isFirstPersonArm) {
			
			overlay_1.opacity = entity.as("DISPLAY").getDisplayType() === "HOLOGRAM" ? 0.6 : entity.getInterpolatedData("fiskheroes:mask_open_timer2") * 0.6 - 0.3*entity.getInterpolatedData('fiskheroes:intangibility_timer') ;
			overlay_1.render();

			overlay_2.opacity = entity.as("DISPLAY").getDisplayType() === "HOLOGRAM" ? 0.2 : entity.getInterpolatedData("fiskheroes:mask_open_timer2") * 0.2;
			overlay_2.render();
			
			colar.setScale(1.015);
			colar.render();
			
			helmet.render();

            var f = entity.getInterpolatedData("fiskheroes:flight_timer");
            cape.render({
                "wind": 1 + 0.3 * f,
                "windFactor": 1 - 0.7 * f,
                "flutter": physics.getFlutter(entity),
                "flare": physics.getFlare(entity)
            });
			
			booster_arms.speedScale = 0.5 * boost;
			booster_arms.flutter = 1 + boost;
			booster_arms.setRotation(0, 0, -7 * flight - 10 * boost);

			var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
			f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
			booster_arms.setSize(1.5 + f * 2, 3.5 - f * 2);
			booster_arms.render(entity, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
			
			beam_chest_power.opacity = power_timer;
			beam_chest_power.render();
		}
		
		if (isFirstPersonArm){
			glyphs.anchor.ignoreAnchor(true);
			beam_shape_1.anchor.ignoreAnchor(true);
			beam_shape_2.anchor.ignoreAnchor(true);
			beam_shape_3.anchor.ignoreAnchor(true);
			beam_charged_beam.anchor.ignoreAnchor(true);
			beam_charged_beam_shoot.anchor.ignoreAnchor(true);
		}
		if (divine) {
			beam_shape_divine.setOffset(0.0, -4560.0, -100.0).setRotation(0.0, 0.0, 0.0).setScale(70.0);
			beam_shape_divine.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1.2, 0) + aiming_timer*trickster_timer;
			beam_shape_divine.render();
		}
		if (offensive) {
			beam_aiming.opacity = Math.max(1 - (1 - aiming_timer) * 2, 0) * power_timer;
			beam_aiming.render();
			cube_aiming.render(entity, aiming_timer*trickster_timer);
			
			
			beam_shape_1.setOffset(0.0, 4.0, -23.0).setRotation(90.0, 0.0, 0.0).setScale(8.3);
			beam_shape_2.setOffset(0.0, 4.0, -26.0).setRotation(90.0, 0.0, 0.0).setScale(5.0);
			beam_shape_3.setOffset(0.0, 4.0, -28.0).setRotation(90.0, 45.0, 0.0).setScale(5.0);
			
			
			
			beam_shape_1.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1.2, 0);
			beam_shape_1.render();
			beam_shape_2.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 2.2, 0);
			beam_shape_2.render();
			beam_shape_3.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 3.2, 0);
			beam_shape_3.render();
			
			cube_L1.render(entity, entity.getInterpolatedData('fiskheroes:beam_charge'));
			beam_charged_beam.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 2, 0);
			beam_charged_beam.render();
			beam_charged_beam_shoot.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 4, 0);
			beam_charged_beam_shoot.render();
		}
		
		if (defensive) {
			beam_aiming_defense.opacity = Math.max(1 - (1 - aiming_timer) * 2, 0) * power_timer;
			beam_aiming_defense.render();
			sphere_aiming.render(entity, aiming_timer*trickster_timer);
			
		}
		
		glyphs.opacity = 0.2*Math.sin(Math.PI*2*entity.loop(50)*menu_timer) + 0.8*menu_timer ;
		glyphs.render();
		
		
        spell.progress = entity.getInterpolatedData("fiskheroes:spellcast_timer");
        spell.render();

        arm_mandalas.render(entity, trickster_timer);
		arm_squares.render(entity);
		
		tp_telekinesis.render(entity, isFirstPersonArm, 0.49, 0.19, 1.0, -0.3, 0.37, 0, 0.48, 0.09, -0.61);
		
		tricker_protective_timer.progress = (1-entity.getInterpolatedData('pwt:dyn/trickster_protective_cooldown'))*entity.getInterpolatedData('pwt:dyn/trickster_protective_timer');
        tricker_protective_timer.render();

		
		
    }
	else if (renderLayer == "BOOTS") {
		if (!isFirstPersonArm) {
			booster_boots.speedScale = 0.5 * boost;
			booster_boots.flutter = 1 + boost;

			var f = Math.min(Math.max(boost * 3 - 1.25, 0), 1);
			f = entity.isSprinting() ? 0.5 - Math.cos(2 * f * Math.PI) / 2 : 0;
			booster_boots.setSize(1.5 + f * 2, 3.5 - f * 2);
			booster_boots.render(entity, entity.getInterpolatedData("fiskheroes:dyn/booster_timer"));
		}
	}
}
