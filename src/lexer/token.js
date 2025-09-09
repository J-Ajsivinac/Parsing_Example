import Expression from "../interfaces/expression.js";

/*
 * Clase para representar un token en el analizador léxico
 * Parámetros:
 *  - tipo: Tipo del token (identificador, número, operador, etc.).
 * - valor: Valor literal del token.
 * - fila: Fila donde se encuentra el token en el código fuente.
 * - columna: Columna donde se encuentra el token en el código fuente.
 */

export class Token extends Expression {
    constructor(tipo, valor, fila, columna) {
        super(tipo, valor, fila, columna);
    }
}
