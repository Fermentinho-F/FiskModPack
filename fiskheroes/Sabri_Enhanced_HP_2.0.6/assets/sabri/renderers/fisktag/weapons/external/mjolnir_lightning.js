function create(renderer, beam, color, entries) {
    var effect = renderer.createLineEffect();
    var shape = renderer.createResource("SHAPE", null);
    var lines = [ ];

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    for (var i = 0; i < entries.length; ++i) {
        lines.push(shape.bindLine(entries[i]));
    }

    effect.setShape(shape);
    effect.setRenderer(beam);
    effect.color.set(color);

    return {
        effect: effect,
        render: () => { effect.render() }
    };
}