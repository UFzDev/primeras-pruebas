test("aplica correctamente un descuento del 10%", () => {
    expect(calcularDescuento(100, 10)).toBe(90);
});