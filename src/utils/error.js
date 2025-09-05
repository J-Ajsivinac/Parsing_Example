import Expression from "../interfaces/expression.js";

/*
 * Clase para manejar errores en la expresión
 */

export class Error extends Expression {
    constructor(tipo, valor, fila, columna) {
        super(tipo, valor, fila, columna);
    }
}
