# Lab U3-02 - Ejemplo simple de Prueba Unitaria

Reporte de la practica de ejecucion de codigo en **JavaScript con Node.js**, pasando por la comprobacion manual y la construccion de un comprobador automatizado, hasta la preparacion para frameworks de pruebas unitarias como **Jest**.

### Integrantes

- **Uriel Flores Zarate** (`UFzDev`)
- **Jose Manuel Ramos Iglesias** (`Manu`)

---

## Resumen del Proyecto y Estructura

El ejercicio se compone de los siguientes archivos en la raiz del proyecto:

```text
primeras-pruebas/
├── .git/                 # Control de versiones del repositorio
├── img/                  # Capturas de evidencia de ejecucion
│   ├── Prueba fallida y superada.png
│   └── Pruebas Automatizadas.png
├── package.json          # Metadatos del proyecto y configuracion de Node.js
├── porcentaje.js         # Modulo con la funcion calcularDescuento
├── porcentaje.test.js    # Prueba unitaria en formato Jest
├── probarPorcentaje.js   # Script de comprobacion manual y runner casero
└── README.md             # Documentacion de la practica y bitacora de commits
```

---

## Desarrollo Paso a Paso de la Practica

### 1. Inicializacion y Preparacion del Entorno

- Se verifico la disponibilidad de `node` y `npm`.
- Se inicializo el directorio del proyecto con `npm init -y` para generar el archivo `package.json`.
- Se crearon los archivos base `porcentaje.js` y `probarPorcentaje.js`.

### 2. Implementacion y Exportacion Modular (`porcentaje.js`)

Se definio la funcion que calcula el valor final tras aplicar un descuento porcentual:

```javascript
function calcularDescuento(precio, porcentaje) {
  return precio - (precio * porcentaje) / 100;
}

module.exports = { calcularDescuento };
```

- **Concepto clave**: `module.exports` permite exponer la funcion hacia otros archivos bajo el sistema de modulos CommonJS sin necesidad de duplicar codigo.

### 3. Importacion y Primera Ejecucion (`probarPorcentaje.js`)

Se importo la funcion usando `require("./porcentaje")` y se probo el caso base 100 con 10% de descuento:

```javascript
const { calcularDescuento } = require("./porcentaje");
const resultado = calcularDescuento(100, 10);
console.log(resultado); // Imprime 90
```

- **Conclusion**: El flujo modular funciono, pero hasta este punto solo se estaba imprimiendo un numero en consola; la verificacion dependia de la inspeccion visual humana.

### 4. Casos de Prueba y Comprobacion Manual

Se definieron cuatro casos representativos:

| Caso  | Entrada (`precio`, `porcentaje`) | Esperado | Tipo de Caso              |
| :---- | :------------------------------- | :------- | :------------------------ |
| **1** | `100`, `10`                      | `90`     | Normal                    |
| **2** | `200`, `25`                      | `150`    | Normal                    |
| **3** | `100`, `0`                       | `100`    | Frontera (sin descuento)  |
| **4** | `100`, `100`                     | `0`      | Extremo (descuento total) |

Al ejecutarlos mediante `console.log`:

```javascript
console.log(calcularDescuento(100, 10)); // 90
console.log(calcularDescuento(200, 25)); // 150
console.log(calcularDescuento(100, 0)); // 100
console.log(calcularDescuento(100, 100)); // 0
```

Se observo que el desarrollador debe leer y cotejar cada salida manualmente contra la tabla de resultados.

### 5. Provocacion y Deteccion de Error Logico

Para experimentar la vulnerabilidad de las revisiones manuales:

1. Se modifico la formula en `porcentaje.js` cambiando `/ 100` por `/ 10`.
2. Las salidas pasaron a ser `0`, `-300`, `100` y `-900`.
3. **Analisis**: Node.js no lanzo ningun error de sintaxis ni de ejecucion porque el codigo era sintacticamente valido. Sin embargo, los resultados eran erroneos.
4. Si se tuvieran decenas o cientos de casos, detectar este fallo de forma visual seria infactible y propenso a errores humanos.

#### Preguntas de reflexion

- **Quien tuvo que detectar que 0, -300 y -900 eran incorrectos?**
  Nosotros tuvimos que hacer la comprobacion manualmente tras ejecutar el codigo y contrastar visualmente la terminal con la tabla esperada.
- **Que ocurriria si tuvieras 50 o 500 casos?**
  Tener que verificar manualmente cada uno de los casos se vuelve impráctico, lento y sumamente propenso al error humano; a mayor cantidad de casos, mas dificil es garantizar que todos los resultados sean correctos sin automatizacion.

### 6. Transicion a Comprobacion Automatica (El programa evalua)

Se programo una primera asercion condicional:

```javascript
const resultado = calcularDescuento(100, 10);
if (resultado === 90) {
  console.log("PRUEBA SUPERADA");
} else {
  console.log("PRUEBA FALLIDA");
}
```

Con esto, el programa asumio la responsabilidad de comparar `obtenido === esperado` y reportar el estado de la prueba.

- Al conservar el error logico (`/ 10`), el resultado obtenido fue `0`, por lo que la condicion evaluo a falso y la terminal mostro:
  ```text
  PRUEBA FALLIDA
  ```
- Al restaurar la formula correcta en `porcentaje.js` (`/ 100`), la condicion se cumplio (`90 === 90`) y la terminal mostro:
  ```text
  PRUEBA SUPERADA
  ```

A continuacion se muestra la evidencia de ambas ejecuciones en la terminal:

![Evidencia de Prueba Fallida y Superada](img/Prueba%20fallida%20y%20superada.png)

### 7. Construccion de un Runner Casero Reutilizable

Se encapsulo la logica de comparacion en una funcion de utilidad `comprobar()`:

```javascript
const { calcularDescuento } = require("./porcentaje");

function comprobar(descripcion, obtenido, esperado) {
  if (obtenido === esperado) {
    console.log(`PASS: ${descripcion}`);
  } else {
    console.log(
      `FAIL: ${descripcion} | esperado: ${esperado}, obtenido: ${obtenido}`,
    );
  }
}

comprobar("10% de 100", calcularDescuento(100, 10), 90);
comprobar("25% de 200", calcularDescuento(200, 25), 150);
comprobar("0% de 100", calcularDescuento(100, 0), 100);
comprobar("100% de 100", calcularDescuento(100, 100), 0);
```

#### Salida en consola:

```text
PASS: 10% de 100
PASS: 25% de 200
PASS: 0% de 100
PASS: 100% de 100
```

A continuacion se muestra la captura de la ejecucion con todas las pruebas automatizadas superadas:

![Evidencia de Pruebas Automatizadas](img/Pruebas%20Automatizadas.png)

---

## Anatomia de una Prueba Unitaria

Cada comprobacion realizada cumple con la estructura estandar de una prueba unitaria:

```text
[ ENTRADA ] ---> [ EJECUCION (UNIDAD) ] ---> [ VALOR OBTENIDO ]
                                                     |
                                        (Comparacion con ESPERADO)
                                                     v
                                              [ PASS / FAIL ]
```

---

## Evolucion hacia Jest (`porcentaje.test.js`)

Los frameworks profesionales como **Jest** no cambian la logica fundamental de la prueba, sino que estandarizan el vocabulario, la administracion de suites, el aislamiento y el reporte:

| En nuestro script (`probarPorcentaje.js`) | En Jest (`porcentaje.test.js`)    | Proposito                          |
| :---------------------------------------- | :-------------------------------- | :--------------------------------- |
| `comprobar("...", ...)`                   | `test("...", () => { ... })`      | Definir y aislar el caso de prueba |
| `obtenido === esperado`                   | `expect(obtenido).toBe(esperado)` | Realizar la asercion declarativa   |
| `node probarPorcentaje.js`                | `npm test` / `jest`               | Ejecutor y reportador de pruebas   |

Contenido preparado en `porcentaje.test.js`:

```javascript
test("aplica correctamente un descuento del 10%", () => {
  expect(calcularDescuento(100, 10)).toBe(90);
});
```

---

## Colaboradores y Bitacora de Commits

La practica fue desarrollada de manera colaborativa por **Uriel Flores Zarate** y **Jose Manuel Ramos Iglesias**. El historial de commits en Git documenta las contribuciones de cada uno:

| Hash      | Mensaje de Commit       | Autor en Git | Contribuidor                   | Descripcion del Aporte                                                                                                                                      |
| :-------- | :---------------------- | :----------- | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `c96d91a` | `Checkpoint 1`          | `UFzDev`     | **Uriel Flores Zarate**        | Configuracion inicial de `package.json`, creacion de la funcion `calcularDescuento` en `porcentaje.js` e invocacion inicial en `probarPorcentaje.js`.       |
| `6c59aaa` | `error logico`          | `Manu`       | **Jose Manuel Ramos Iglesias** | Introduccion intencional del error logico dividiendo entre 10 en `porcentaje.js`, probando el fallo en consola e integrando las preguntas de analisis.      |
| `6df62b4` | `Pruebas Automatizadas` | `UFzDev`     | **Uriel Flores Zarate**        | Correccion del error logico en `porcentaje.js` e implementacion de la suite de pruebas automatizadas con la funcion `comprobar()` y cuatro casos de prueba. |
| `cd8d33a` | `archivo jest`          | `Manu`       | **Jose Manuel Ramos Iglesias** | Creacion del archivo `porcentaje.test.js` estructurando la prueba en la sintaxis estandar de Jest con `test()` y `expect().toBe()`.                         |

---

## Cuestionario de Checkpoint (Paso 12)

1. **Por que `porcentaje.js` y `probarPorcentaje.js` estan separados?**
   - **Respuesta**: Para respetar el principio de separacion de responsabilidades. La logica de negocio (`porcentaje.js`) debe mantenerse limpia, modular y desacoplada del codigo que valida su funcionamiento (`probarPorcentaje.js`), evitando contaminar el codigo productivo con llamadas de prueba.

2. **Que hace `module.exports`?**
   - **Respuesta**: Expone variables, funciones u objetos del archivo actual en el sistema de modulos CommonJS de Node.js, permitiendo que otros archivos del proyecto puedan importarlos mediante `require()`.

3. **Que hace `require("./porcentaje")`?**
   - **Respuesta**: Resuelve y carga las entidades exportadas por el archivo local `porcentaje.js` ubicado en el mismo directorio (`./`).

4. **Cual es la diferencia entre ejecutar la funcion y comprobarla?**
   - **Respuesta**: Ejecutar la funcion consiste unicamente en invocarla para obtener una salida. Comprobarla implica comparar de manera estricta y sistematica el resultado obtenido contra un valor esperado previamente definido para emitir un veredicto (`PASS` o `FAIL`).

5. **Por que `/ 10` fue un error logico que Node no reporto?**
   - **Respuesta**: Porque la expresion matematica era sintacticamente valida para el interprete de JavaScript y no provocaba ninguna excepcion en tiempo de ejecucion. El error residia en la logica del algoritmo de negocio, produciendo numeros validos pero incorrectos segun el requerimiento.

6. **Que trabajo realizara Jest que hoy realiza `comprobar()`?**
   - **Respuesta**: Jest provee un entorno integral de pruebas automatizadas: descubrimiento dinamico de archivos de prueba (`*.test.js`), aserciones declarativas (`expect`), reporte visual detallado de diferencias ante fallos, ejecucion en paralelo y calculo de cobertura de codigo.
