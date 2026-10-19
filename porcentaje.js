function calcularDescuento(precio, porcentaje) {
  return precio - (precio * porcentaje / 100);
}

module.exports = { calcularDescuento };
