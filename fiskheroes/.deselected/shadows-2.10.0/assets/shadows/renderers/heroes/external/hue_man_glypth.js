function create(renderer, color, beam, mirror) {
    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    var eye_shape = renderer.createResource("SHAPE", "fiskheroes:mysterio_eye");
    var currScale = 1;

    var eye = renderer.createEffect("fiskheroes:lines").setShape(eye_shape).setRenderer(beam);
    eye.color.set(color);
    eye.anchor.set("head");

    eye.mirror = mirror;
    var obj = {
        eye: eye,
        setScale: scale => {
            currScale = scale;
            eye.setScale(scale * 0.4);
            return obj;
        },
        setOffset: (x, y, z) => {
            eye.setOffset(x, y, z);
            return obj;
        },
        setRotation: (x, y, z) => {
            eye.setRotation(x, y, z);
            return obj;
        },
        ignoreAnchor: ignore => {
            eye.anchor.ignoreAnchor(ignore);
            return obj;
        },
        render: (f,isFirstPersonArm , func) => {
            var timer = Math.min(f * 1.5 - 0.5, 1);
            var timerEye = Math.min(f * 2 - 0.25, 1);
            eye.opacity = timerEye;
            eye.setScale(currScale * 0.4 * (0.8 + timer * 0.2));
            if (isFirstPersonArm) {
                eye.setOffset(0, 3, -19.5).setRotation(80, 0, 0);
                eye.anchor.ignoreAnchor(true);
            } else {
                eye.setOffset(0, 3, -19.5).setRotation(90, 0, 0);
                eye.anchor.ignoreAnchor(false);
            }
            if (typeof func == "function") {
                func(eye);
            }
            eye.render();
        }
    };
    return obj;
}
