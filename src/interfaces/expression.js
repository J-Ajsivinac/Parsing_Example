/*
 * Javascript no tiene clases abstractas nativas,
 * pero se pueden simular utilizando otras características del lenguaje,
 * como las funciones constructoras y los prototipos.
 */

class Expression {
    constructor(tipo, valor, fila, columna) {
        if (this.constructor === Expression) {
            throw new Error(
                "No se puede crear una instancia de la clase abstracta Expression"
            );
        }
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
}

export default Expression;
