var SPIRITDIVE = {
    timerFunc: entity => entity.getInterpolatedData("tmhp:dyn/spiritdive_timer"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};
var SPIRITDIVE2 = {
    timerFunc: entity => entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};
var AELITA = {
    timerFunc: entity => entity.getInterpolatedData("fiskheroes:flying"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};
var BLACKFORM = {
    timerFunc: entity => entity.getInterpolatedData("tmhp:dyn/blackform_timer"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};
var BLACKFORM_TWO = {
    timerFunc: entity => entity.getInterpolatedData("tmhp:dyn/blackform2_timer"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};
var DEVIL_UNION = {
    timerFunc: entity => entity.getInterpolatedData("tmhp:dyn/devil_union_timer"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};
var DEVIL_UNION2 = {
    timerFunc: entity => entity.getInterpolatedData("tmhp:dyn/devil_union2_timer"),
    apply: effect => {
        effect.bindAnimation("fiskheroes:wings/controlled_flight").setData((entity, data) => {
            data.load(0, Math.max(1 - entity.getInterpolatedData("fiskheroes:flight_timer")));
            data.load(1, entity.getPunchTimerInterpolated());
            data.load(2, entity.getInterpolatedData("fiskheroes:barrel_roll_timer"));
        });
    }
};

function create(renderer, texture, lights, type) {
    var effect = renderer.createEffect("fiskheroes:wings");
    effect.texture.set(texture, lights);
    effect.anchor.set("body");
    type.apply(effect);

    return {
        effect: effect,
        render: (entity, shieldUnfold) => {
            effect.unfold = type.timerFunc(entity);
            effect.shieldUnfold = shieldUnfold;
            effect.render();
        }
    };
}
