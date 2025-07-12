extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:kid_danger/kid_danger_layer1",
    "layer2": "sl:kid_danger/kid_danger_layer2",
    "layer1_maskless": "sl:kid_danger/kid_danger_layer1_maskless",
    "null": "sl:null",
    "bubble_texture": "sl:gumBubble",
    "gumpiece_texture": "sl:redGum"
});

var utils = implement("fiskheroes:external/utils");
var bubblegum;
var gumpiece;
var glow_head;
var glow_body;
var glow_arms;
var glow_legs;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if ((!entity.getData("fiskheroes:dyn/steeled") && entity.getData("fiskheroes:dyn/steel_timer") == 0) || (entity.getData("fiskheroes:dyn/steeled") && entity.getData("fiskheroes:dyn/steel_timer") < 1)) {
            
            if (renderLayer == "HELMET") {
                var maskOpen = entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? 
                               entity.getData("fiskheroes:mask_open") : 
                               entity.getData("fiskheroes:mask_open_timer2");

                if (maskOpen > 0.35) {
                    return "layer1_maskless";
                }
            }

            if (renderLayer == "LEGGINGS") {
                return "layer2";
            }

            return "layer1";
        } else {
            return "null";
        }
    });
}

function initEffects(renderer) {

    glow_head = utils.createLines(renderer, "sl:glow", 0xFFFFFF, [{
        "start": [0.0, 0.0, 0.0],
        "end": [0.0, -1.0, 0.0],
        "size": [8.1, 8.1]
    }]);
    glow_head.anchor.set("head");
    glow_head.setOffset(0.0, -8.5, 0.0);
    glow_head.mirror = false;

    glow_body = utils.createLines(renderer, "sl:glow", 0xFFFFFF, [{
        "start": [0.0, 0.0, 0.0],
        "end": [0.0, -1.0, 0.0],
        "size": [4.0, 8.0]
    }]);
    glow_body.anchor.set("body");
    glow_body.setOffset(0.0, -1, 0.0).setScale(16.0, 14.0, 16.0);
    glow_body.mirror = false;

    glow_arms = utils.createLines(renderer, "sl:glow", 0xFFFFFF, [{
            "start": [0.0, 0.0, 0.0],
            "end": [0.0, -1.0, 0.0],
            "size": [4.0, 4.0]
        }
    ]);
    glow_arms.anchor.set("rightArm");
    glow_arms.setOffset(1.0, -3, 0.0).setScale(16.0, 14.0, 16.0);
    glow_arms.mirror = true;

    glow_legs = utils.createLines(renderer, "sl:glow", 0xFFFFFF, [{
            "start": [0.0, 0.0, 0.0],
            "end": [0.0, -1.0, 0.0],
            "size": [4.0, 4.0]
        }
    ]);
    glow_legs.anchor.set("rightLeg");
    glow_legs.setOffset(0.0, 0, 0.0).setScale(16.0, 14.0, 16.0);
    glow_legs.mirror = true;

bubble = utils.createModel(renderer, "sl:gumBubble", "bubble_texture");
bubblegum = renderer.createEffect("fiskheroes:model");
bubblegum.setModel(bubble);
bubblegum.anchor.set("head");

gum = utils.createModel(renderer, "sl:gumPiece", null, "gumpiece_texture");
gumpiece = renderer.createEffect("fiskheroes:model");
gumpiece.setModel(gum);
gumpiece.anchor.set("leftArm");

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "kid_danger.MASK", "sl:remove_mask")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });

    addAnimation(renderer, "kid_danger.TAKEGUM", "sl:take_gum")
        .setData((entity, data) => {
            var steelTimer = entity.getInterpolatedData("fiskheroes:dyn/steel_timer");
            var isSteeled = entity.getData("fiskheroes:dyn/steeled");
            var scaledValue = isSteeled ? steelTimer : Math.abs(1 - steelTimer);
            data.load(Math.min(1, scaledValue * 5));
        });

    addAnimation(renderer, "kid_danger.EATGUM", "sl:inhale_left")
        .setData((entity, data) => {
            var steelTimer = entity.getInterpolatedData("fiskheroes:dyn/steel_timer");
            var isSteeled = entity.getData("fiskheroes:dyn/steeled");
            var loadProgress;
            
            if (isSteeled) {
                if (steelTimer >= 0.2 && steelTimer <= 0.4) {
                    loadProgress = (steelTimer - 0.2) / 0.2;
                    data.load(loadProgress);
                }
            } else {
                if (Math.abs(1 - steelTimer) >= 0.2 && Math.abs(1 - steelTimer) <= 0.4) {
                    loadProgress = (Math.abs(1 - steelTimer) - 0.2) / 0.2;
                    data.load(loadProgress);
                }
            }
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
var steel_timer = entity.getData("fiskheroes:dyn/steeled")
    ? entity.getData("fiskheroes:dyn/steel_timer")
    : Math.abs(1 - entity.getData("fiskheroes:dyn/steel_timer"));
    if (steel_timer >= 0.225 && steel_timer < 0.35) {
        gumpiece.render();
        gumpiece.setOffset(-7, -2, 0);
    }
    if (steel_timer > 0.4) {
        if (steel_timer <= 0.7) {
            var scale = 1 + (steel_timer - 0.4) / 0.3 * 4;
            bubblegum.setScale(scale);
            bubblegum.setOffset(0, 0.5 * scale, 3 * scale);
            bubblegum.render();
        } else if (steel_timer < 1) {
            var progress = (steel_timer - 0.7) / 0.8;
            var scale_y = progress * (renderLayer === "CHESTPLATE" ? 18 : 16);

            if (renderLayer === "HELMET") {
                glow_head.setScale(16.0, -1.5 * scale_y, 16.0);
                glow_head.color.set(0x50E80B);
                glow_head.render();
            } else if (renderLayer === "CHESTPLATE") {
                glow_body.setScale(16.0, -2 * scale_y, 16.0);
                glow_arms.setScale(16.0, -2 * scale_y, 16.0);
                glow_body.color.set(0x50E80B);
                glow_body.render();
                glow_arms.color.set(0x50E80B);
                glow_arms.render();
            } else if (renderLayer === "LEGGINGS") {
                glow_legs.setScale(16.0, -2 * scale_y, 16.0);
                glow_legs.color.set(0x50E80B);
                glow_legs.render();
            }
        }
    }
}
