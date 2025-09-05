import { TokenTypes } from "../lexer/tokenTypes.js";
import { Error } from "../utils/error.js";

class Parser {
    constructor(listaTokens) {
        this.tokens = listaTokens;
        this.posicion = 0;
        this.errores = [];
    }

    _tokenActual() {
        return this.posicion < this.tokens.length
            ? this.tokens[this.posicion]
            : null;
    }

    _avanzar() {
        if (this.posicion < this.tokens.length) {
            const token = this.tokens[this.posicion];
            this.posicion++;
            return token;
        }
        return null;
    }

    _crearError(mensaje, token = null) {
        if (!token) token = this._tokenActual();
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

        this._crearError(
            mensaje ||
                `Se esperaba ${
                    tipoEsperado.name || tipoEsperado
                } pero se encontró '${token.valor}'`,
            token
        );

        // Recuperación: saltar hasta un token de sincronización
        if (
            [TokenTypes.SEMICOLON, TokenTypes.RIGHT_BRACKET].includes(
                tipoEsperado
            )
        ) {
            this._saltarHastaToken(tipoEsperado);
        }

        return false;
    }

    _saltarHastaToken(tipoToken) {
        while (this.posicion < this.tokens.length) {
            const token = this._tokenActual();
            if (!token) break;
            if (token.tipo === tipoToken) {
                // NO consumirlo, solo detenernos antes de él
                break;
            }
            this._avanzar();
        }
    }

    analizar() {
        this.posicion = 0;
        this.errores = [];

        while (this.posicion < this.tokens.length) {
            if (!this._analizarComando()) {
                // Intentar continuar con el siguiente token de sincronización
                this._saltarHastaToken(TokenTypes.SEMICOLON);
            }
        }

        return this.errores;
    }

    _analizarComando() {
        const token = this._tokenActual();
        if (!token) return false;

        if (token.tipo === TokenTypes.KEYWORD_KEYS) {
            return this._analizarClaves();
        } else if (
            token.tipo === TokenTypes.KEYWORD_PRINT ||
            token.tipo === TokenTypes.KEYWORD_PRINTLN
        ) {
            return this._analizarImprimir();
        } else {
            this._crearError(
                "Se esperaba 'Claves', 'imprimir' o 'imprimirln'",
                token
            );
            this._avanzar(); // avanzar para no quedar en bucle
            return false;
        }
    }

    _analizarClaves() {
        this._avanzar(); // consumir 'Claves'

        this._esperarToken(
            TokenTypes.EQUALS,
            "Se esperaba '=' después de 'Claves'"
        );
        this._esperarToken(
            TokenTypes.LEFT_BRACKET,
            "Se esperaba '[' después de '='"
        );

        this._analizarListaStrings();

        this._esperarToken(
            TokenTypes.RIGHT_BRACKET,
            "Se esperaba ']' para cerrar la lista"
        );
        this._esperarToken(
            TokenTypes.SEMICOLON,
            "Se esperaba ';' al final de la declaración"
        );

        return true;
    }

    _analizarListaStrings() {
        let token = this._tokenActual();

        if (!token || token.tipo === TokenTypes.RIGHT_BRACKET) return true;

        if (
            !this._esperarToken(
                TokenTypes.STRING_LITERAL,
                "Se esperaba una cadena de texto"
            )
        ) {
            this._saltarHastaToken(TokenTypes.RIGHT_BRACKET);
            return false;
        }

        while (true) {
            token = this._tokenActual();
            if (!token || token.tipo !== TokenTypes.COMMA) break;

            this._avanzar(); // consumir coma
            if (
                !this._esperarToken(
                    TokenTypes.STRING_LITERAL,
                    "Se esperaba una cadena de texto"
                )
            ) {
                this._saltarHastaToken(TokenTypes.RIGHT_BRACKET);
                return false;
            }
        }

        return true;
    }

    _analizarImprimir() {
        this._avanzar(); // consumir 'imprimir' o 'imprimirln'

        this._esperarToken(
            TokenTypes.LEFT_PAREN,
            "Se esperaba '(' después de 'imprimir'"
        );
        if (
            !this._esperarToken(
                TokenTypes.STRING_LITERAL,
                "Se esperaba una cadena de texto"
            )
        ) {
            this._saltarHastaToken(TokenTypes.RIGHT_PAREN);
        }
        this._esperarToken(
            TokenTypes.RIGHT_PAREN,
            "Se esperaba ')' para cerrar 'imprimir'"
        );
        this._esperarToken(
            TokenTypes.SEMICOLON,
            "Se esperaba ';' al final de la declaración"
        );

        return true;
    }

    imprimirErrores() {
        this.errores.forEach((error) => {
            console.log(
                `${error.tipo}: ${error.valor} en línea ${error.fila}, columna ${error.columna}`
            );
        });
    }

    esValido() {
        return this.errores.length === 0;
    }
}

export default Parser;
