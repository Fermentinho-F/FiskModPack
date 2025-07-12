var flare;

function loadData(entity, data, width, length, res) {
    flare = data.flare;

    if (entity.is("DISPLAY")) {
        res.requestResolution(1, 1);
    }
    else {
        res.requestResolution(width, length);
    }
}

function evaluate(mesh, x, y, width, length) {
    mesh.vertX = width * (x + x * y * 20 * flare);
    mesh.vertY = length * y * Math.cos(x * flare);
    mesh.vertZ = Math.cos(x) - 0.57;
}
