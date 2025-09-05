import Expression from "../interfaces/expression.js";

/*
 * Clase para representar un token en el analizador léxico
 */

export class Token extends Expression {
    constructor(tipo, valor, fila, columna) {
        super(tipo, valor, fila, columna);
    }
}
