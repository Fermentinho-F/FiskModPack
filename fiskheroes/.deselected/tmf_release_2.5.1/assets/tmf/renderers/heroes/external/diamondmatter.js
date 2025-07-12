var LOADTEXTURES = {
	"null": "tmf:null",
	"diamondmatter": "tmf:omnitrix/p1/aliens/diamond_matter",
    "grey_matter_lights": "tmf:omnitrix/p1/lights/grey_matter_lights.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

    var modelGreyMatterArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/grey_matterArm");
    modelGreyMatterArm.texture.set("diamondmatter");
    var greyMatterArm = renderer.createEffect("fiskheroes:model").setModel(modelGreyMatterArm);
    greyMatterArm.anchor.set("rightArm");

    //===================

    addAnimation(renderer, "diamondmatter.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            var item = entity.getHeldItem();
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
            }
            if (isFirstPersonArm) {
                greyMatterArm.render();
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_diamondmatter" : "tmf:omnitrix/aliens/diamondmatter");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/diamondmatter").setData((entity, data) => {
        data.load(0, entity.isSneaking() ? 1 : 0);
        data.load(1, entity.loop(60));
        data.load(2, entity.getPunchTimerInterpolated());
        data.load(3, entity.getInterpolatedData('fiskheroes:cryo_charge'));
    });
    modelAlien.texture.set("diamondmatter", "diamondmatter_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(2.2);
    alien.setOffset(0,2,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrix", "omnitrix_timeout");
                }
                else if (color == 0 || color == 360) {
                    modelAlien.texture.set("omnitrix", "omnitrix_white");
                }
                else {
                    modelAlien.texture.set("omnitrix", "omnitrix_lights");
                }
            }
            alien.render();
        }
    };
}