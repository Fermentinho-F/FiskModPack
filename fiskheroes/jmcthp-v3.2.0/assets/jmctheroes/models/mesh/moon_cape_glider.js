var unfold;

function loadData(entity, data, width, length, res) {
    unfold = data.unfold;

    if (unfold > 0) {
        res.requestResolution(2 * width, length);
    }
}

function evaluate(mesh, x, y, width, length) {
    var ax = Math.abs(x);
    mesh.vertX *= ((1 + unfold * y * 4) );
    mesh.vertX += unfold * x * Math.sin(y * Math.PI / 2) * 1.0;
    mesh.vertY *= ((1 - unfold * (ax * 1.5 + Math.sin(0.75 * ax * Math.PI) * -0.2))
    * (1 - unfold * Math.sin(Math.min(ax * 0.8, 1) * Math.PI) * 0.1)
    * (1 + unfold * 0.3) * (1 + unfold * diagonal(ax, y))
    );
}

function diagonal(x, y) {
    return Math.sin(Math.abs(x) * Math.PI / 2.5);
}

function spike(x) {
    if (x < 0 || x > 1) {
        return 0;
    }
    var f = Math.min(x, Math.abs(x - 1));
    return 8 * f * f * f;
}
