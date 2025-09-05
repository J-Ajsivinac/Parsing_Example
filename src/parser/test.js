// Asumiendo que tienes estos imports disponibles
// import { TipoToken } from './modules/Tipo.js';
// import { Error } from './modules/Abstract/error.js';

class AnalizadorSintacticoMinimo {
    /**
     * Analizador sintáctico mínimo para validar solo Claves, imprimir e imprimirln.
     * @param {Array} listaTokens - Lista de tokens a analizar
     */
    constructor(listaTokens) {
        this.tokens = this._filtrarComentarios(listaTokens);
        this.posicion = 0;
        this.errores = [];
    }

    /**
     * Elimina tokens de comentarios.
     * @param {Array} tokens - Lista de tokens
     * @returns {Array} Tokens filtrados
     */
    _filtrarComentarios(tokens) {
        return tokens.filter(
            (token) =>
                token.tipo !== TipoToken.COMENTARIO &&
                token.tipo !== TipoToken.COMENTARIO_M
        );
    }

    /**
     * Obtiene el token actual sin avanzar.
     * @returns {Object|null} Token actual o null
     */
    _tokenActual() {
        return this.posicion < this.tokens.length
            ? this.tokens[this.posicion]
            : null;
    }

    /**
     * Avanza al siguiente token y retorna el actual.
     * @returns {Object|null} Token actual antes de avanzar
     */
    _avanzar() {
        if (this.posicion < this.tokens.length) {
            const token = this.tokens[this.posicion];
            this.posicion++;
            return token;
        }
        return null;
    }

    /**
     * Crea un error sintáctico.
     * @param {string} mensaje - Mensaje de error
     * @param {Object|null} token - Token donde ocurrió el error
     */
    _crearError(mensaje, token = null) {
        if (token === null) {
            token = this._tokenActual();
        }
        if (token) {
            this.errores.push(
                new Error(
                    "Error Sintáctico",
                    mensaje,
                    token.fila,
                    token.columna,
                    token.valor
                )
            );
        }
    }

    /**
     * Verifica y consume un token específico.
     * @param {TipoToken} tipoEsperado - Tipo de token esperado
     * @param {string|null} mensaje - Mensaje de error personalizado
     * @returns {boolean} True si el token es del tipo esperado
     */
    _esperarToken(tipoEsperado, mensaje = null) {
        const token = this._tokenActual();
        if (!token) {
            this._crearError(
                `Se esperaba ${
                    tipoEsperado.name || tipoEsperado
                } pero se encontró fin de archivo`
            );
            return false;
        }

        if (token.tipo === tipoEsperado) {
            this._avanzar();
            return true;
        }

        mensaje = mensaje || `Se esperaba ${tipoEsperado.name || tipoEsperado}`;
        this._crearError(mensaje, token);
        return false;
    }

    /**
     * Inicia el análisis sintáctico.
     * @returns {boolean} True si el análisis fue exitoso
     */
    analizar() {
        this.posicion = 0;
        this.errores = [];

        while (this.posicion < this.tokens.length) {
            if (!this._analizarComando()) {
                // Si hay error, intenta continuar con el siguiente token
                this._avanzar();
            }
        }

        return this.errores.length === 0;
    }

    /**
     * Analiza un comando: Claves, imprimir o imprimirln.
     * @returns {boolean} True si el comando es válido
     */
    _analizarComando() {
        const token = this._tokenActual();
        if (!token) {
            return false;
        }

        if (token.tipo === TipoToken.R_CLAVES) {
            return this._analizarClaves();
        } else if (token.tipo === TipoToken.R_IMPRIMIR) {
            return this._analizarImprimir();
        } else {
            this._crearError("Se esperaba 'Claves', 'imprimir'", token);
            return false;
        }
    }

    /**
     * Analiza: Claves = ["clave1", "clave2", ...]
     * @returns {boolean} True si la sintaxis es válida
     */
    _analizarClaves() {
        // Consumir 'Claves'
        this._avanzar();

        // Esperar =
        if (
            !this._esperarToken(
                TipoToken.IGUAL,
                "Se esperaba '=' después de 'Claves'"
            )
        ) {
            return false;
        }

        // Esperar [
        if (
            !this._esperarToken(
                TipoToken.CORCHETE_APERTURA,
                "Se esperaba '[' después de '='"
            )
        ) {
            return false;
        }

        // Analizar lista de strings
        if (!this._analizarListaStrings()) {
            return false;
        }

        // Esperar ]
        return this._esperarToken(
            TipoToken.CORCHETE_CERRADURA,
            "Se esperaba ']' para cerrar la lista"
        );
    }

    /**
     * Analiza: "string1", "string2", ...
     * @returns {boolean} True si la lista de strings es válida
     */
    _analizarListaStrings() {
        let token = this._tokenActual();

        // Lista vacía
        if (!token || token.tipo === TipoToken.CORCHETE_CERRADURA) {
            return true;
        }

        // Primer string obligatorio
        if (
            !this._esperarToken(
                TipoToken.STRING,
                "Se esperaba una cadena de texto"
            )
        ) {
            return false;
        }

        // Strings adicionales precedidos por coma
        while (true) {
            token = this._tokenActual();
            if (!token || token.tipo !== TipoToken.COMA) {
                break;
            }

            this._avanzar(); // Consumir coma
            if (
                !this._esperarToken(
                    TipoToken.STRING,
                    "Se esperaba una cadena después de la coma"
                )
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Analiza: imprimir("texto"); o imprimirln("texto");
     * @returns {boolean} True si la sintaxis es válida
     */
    _analizarImprimir() {
        // Consumir 'imprimir' o 'imprimirln'
        this._avanzar();

        // Esperar (
        if (
            !this._esperarToken(
                TipoToken.PARENTESIS_APERTURA,
                "Se esperaba '(' después de 'imprimir'"
            )
        ) {
            return false;
        }

        // Esperar string
        const token = this._tokenActual();
        if (!token || token.tipo !== TipoToken.STRING) {
            this._crearError("Se esperaba una cadena de texto", token);
            // Recuperarse saltando hasta el final de la función
            this._recuperarseDeErrorEnFuncion();
            return false;
        }
        this._avanzar();

        // Esperar )
        if (
            !this._esperarToken(
                TipoToken.PARENTESIS_CERRADURA,
                "Se esperaba ')' para cerrar 'imprimir'"
            )
        ) {
            return false;
        }

        // Esperar ;
        return this._esperarToken(
            TipoToken.PUNTO_COMA,
            "Se esperaba ';' al final de la declaración"
        );
    }

    /**
     * Retorna la lista de errores encontrados.
     * @returns {Array} Lista de errores
     */
    obtenerErrores() {
        return this.errores;
    }

    /**
     * Imprime todos los errores encontrados.
     */
    imprimirErrores() {
        this.errores.forEach((error) => {
            console.log(
                `${error.tipo}: ${error.valor} en línea ${error.fila}, columna ${error.columna}`
            );
        });
    }

    /**
     * Verifica si el análisis fue exitoso (sin errores).
     * @returns {boolean} True si no hay errores
     */
    esValido() {
        return this.errores.length === 0;
    }
}

// Si usas módulos ES6
// export default AnalizadorSintacticoMinimo;

// Si usas CommonJS
// module.exports = AnalizadorSintacticoMinimo;
