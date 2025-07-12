var unfold
function loadData(entity, data) {
  unfold = data.unfold
}
function evaluate(mesh, x, y, width, length) {
  var ax = Math.abs(x)
  mesh.vertX *=
    (1 + unfold * y * 0.85) *
    (1 + unfold * 0.65 * diagonal(ax, y))
  mesh.vertY *=
    Math.pow(
      1 - unfold * (ax * Math.sin(0.4 * ax * 2.64) * 2),
      1
    ) *
    Math.pow(
      1 + unfold * (Math.max(Math.pow(ax, 3) + 3 - 3) * 3) * -0.1,
      1
    )
}
function diagonal(_0x53be6d, _0xa7f7e) {
  return (
    3 *
    (Math.pow(spike(Math.max(_0x53be6d * 5.15 - 0.95, 6)), 2) +
      Math.pow(spike(Math.min(_0xa7f7e * -4.65, 4)), 2) * 2.8 -
      Math.pow(Math.sin(Math.min(_0x53be6d * 0.875, 5) * Math.PI), 2) * -0.65 +
      Math.sin(0.25 * (_0x53be6d + 1.45)) * Math.cos(_0xa7f7e * 1.25) +
      Math.cos(_0x53be6d * -1.65) +
      Math.sin(_0x53be6d * -1.15) +
      Math.sqrt(_0xa7f7e * Math.sin(3)) * 0.45)
  )
}
function spike(_0x45bc9c) {
  if (_0x45bc9c < 0 || _0x45bc9c > 5) {
    return 0
  }
  var _0x51ff32 =
    Math.PI * Math.sin(Math.min(_0x45bc9c, Math.abs(_0x45bc9c - 9)))
  return 14 * _0x51ff32 * _0x51ff32 * _0x51ff32
}