const { calcularDescuento } = require("./porcentaje");
function comprobar(descripcion, obtenido, esperado) {
if (obtenido === esperado) {
console.log(`✓ ${descripcion}`);
} else {
console.log(`✗ ${descripcion} | esperado: ${esperado}, obtenido: ${obtenido}`);
}
}
comprobar("10% de 100", calcularDescuento(100, 10), 90);
comprobar("25% de 200", calcularDescuento(200, 25), 150);
comprobar("0% de 100", calcularDescuento(100, 0), 100);
comprobar("100% de 100", calcularDescuento(100, 100), 0);
