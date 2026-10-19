function calcularDescuento(precio, porcentaje) {
  return precio - (precio * porcentaje / 100);
}

module.exports = { calcularDescuento };


/*
¿quién tuvo que detectar que 0, -300 y -900 eran incorrectos? 
Nosostros tuvimos que hacerlo la comprobación manuelmente, despues de ejecutar el codigo.

¿Qué ocurriría si tuvieras 50 o 500 casos?
Verificar con cada uno de los casos que el resultado es correcto, mientras mas cosos sean mas dificil es
verificar que todos los resultados sean correctos.

*/ 
