import { Error } from "../utils/error.js";
import { ValidateChars } from "../utils/validate.js";
import { Token } from "./token.js";
import { TokenTypes } from "./tokenTypes.js";

export class Lexer {
    constructor() {
        this.tokens = [];
        this.errores = [];
        this.estado = 1;
        this.fila = 1;
        this.columna = 1;
        this.buffer = "";
        this.comAbierto = false;

        // Palabras reservadas
        this.patterns = new Map([
            ["claves", TokenTypes.KEYWORD_KEYS],
            ["imprimir", TokenTypes.KEYWORD_PRINT],
        ]);

        // Mapear caracteres a tokens directos
        this.symbols = new Map([
            ["{", TokenTypes.LEFT_BRACE],
            ["}", TokenTypes.RIGHT_BRACE],
            ["(", TokenTypes.LEFT_PAREN],
            [")", TokenTypes.RIGHT_PAREN],
            ["[", TokenTypes.LEFT_BRACKET],
            ["]", TokenTypes.RIGHT_BRACKET],
            [",", TokenTypes.COMMA],
            [";", TokenTypes.SEMICOLON],
            [".", TokenTypes.DOT],
            ["=", TokenTypes.EQUALS],
        ]);
    }

    analizar(cadena) {
        this.estado = 1;

        while (cadena) {
            const resultado = this.limpiar(cadena);
            cadena = resultado.cadena;

            if (!cadena) {
                break;
            }

            // Map de transiciones para mejor legibilidad
            const transiciones = new Map([
                [1, this.x_1.bind(this)],
                [2, this.x_2.bind(this)],
                [3, this.x_3.bind(this)],
                [5, this.x_5.bind(this)],
                [6, this.x_6.bind(this)],
                [7, this.x_7.bind(this)],
                [8, this.x_8.bind(this)],
                [18, this.x1_8.bind(this)],
            ]);

            const transicion = transiciones.get(this.estado);
            if (transicion) {
                cadena = transicion(cadena);
            } else {
                break;
            }
        }
        return {
            tokens: this.tokens,
            errores: this.errores,
        };
    }

    // --------------------------
    // UTILIDADES
    // --------------------------
    limpiar(cadena) {
        /**
         * Ignora espacios, tabs y saltos de línea
         */
        while (cadena) {
            const char = cadena[0];

            if (char === "\t") {
                this.columna += 4;
            } else if (char === "\n") {
                this.fila += 1;
                this.columna = 1;
            } else if (char === " ") {
                this.columna += 1;
            } else {
                break;
            }

            cadena = cadena.slice(1);
        }

        return { cadena, procesados: 0 };
    }

    _agregarToken(tipo, valor, ajustarColumna = true) {
        const col = ajustarColumna ? this.columna : this.columna - valor.length;
        this.tokens.push(new Token(tipo, valor, this.fila, col));
        this.columna += valor.length;
        this.estado = 1;
    }

    _agregarNumero(tipo, valor) {
        /**
         * Agrega enteros o reales parseados
         */
        const valorNum =
            tipo === TokenTypes.INTEGER_LITERAL
                ? parseInt(valor, 10)
                : parseFloat(valor);
        this.tokens.push(new Token(tipo, valorNum, this.fila, this.columna));
        this.columna += valor.length;
        this.estado = 1;
    }

    _crearError(valor, fila = null, columna = null, ajustar = false) {
        const errorValor =
            valor !== undefined && valor !== null
                ? valor
                : "Carácter desconocido";

        this.errores.push(
            new Error(
                "Error Léxico",
                errorValor,
                fila || this.fila,
                columna || this.columna
            )
        );

        if (ajustar) {
            const lineas = errorValor.toString().split("\n");
            this.columna += lineas[lineas.length - 1].length;
        } else {
            this.columna += errorValor.toString().length;
        }
    }

    // --------------------------
    // ESTADO INICIAL
    // --------------------------
    x_1(cadena) {
        const char = cadena[0];

        // Verificar símbolos directos
        if (this.symbols.has(char)) {
            console.log(this.symbols.get(char), char);
            this._agregarToken(this.symbols.get(char), char);
            return cadena.slice(1);
        }

        // Comentarios
        if (char === "#") {
            this.buffer = char;
            this.estado = 2;
            return cadena.slice(1);
        }

        // Strings con comillas dobles
        if (char === '"') {
            this.buffer = char;
            this.estado = 8;
            this.comAbierto = true;
            return cadena.slice(1);
        }

        // Strings con comillas simples
        if (char === "'") {
            this.buffer = char;
            this.estado = 18;
            this.comAbierto = true;
            return cadena.slice(1);
        }

        // Identificadores y palabras reservadas
        if (ValidateChars.isLetter(char)) {
            this.estado = 3;
            return cadena;
        }

        // Números
        if (ValidateChars.isNumber(char)) {
            this.estado = 5;
            return cadena;
        }

        // Caracter inválido
        this._crearError(char);
        return cadena.slice(1);
    }

    // --------------------------
    // IDENTIFICADORES Y PALABRAS RESERVADAS
    // --------------------------
    x_3(cadena) {
        const char = cadena[0];

        if (!char) {
            // Fin de cadena
            const tipo =
                this.patterns.get(this.buffer.toLowerCase()) ||
                TokenTypes.TEXT_LITERAL;
            this._agregarToken(tipo, this.buffer);
            this.buffer = "";
            return cadena;
        }

        if (ValidateChars.isLetter(char)) {
            this.buffer += char;
            return this.x_3(cadena.slice(1));
        }

        if (ValidateChars.isDelimiter(char)) {
            const tipo =
                this.patterns.get(this.buffer.toLowerCase()) ||
                TokenTypes.TEXT_LITERAL;
            this._agregarToken(tipo, this.buffer);
            this.buffer = "";
            return cadena;
        }

        // ERROR: Consumir el carácter inválido
        this._crearError(char, this.fila, this.columna + this.buffer.length);
        this.buffer = "";
        this.estado = 1;
        return cadena.slice(1);
    }
    // --------------------------
    // NÚMEROS
    // --------------------------
    x_5(cadena) {
        const char = cadena[0];

        if (!char) {
            // Fin de cadena
            this._agregarNumero(TokenTypes.INTEGER_LITERAL, this.buffer);
            this.buffer = "";
            return cadena;
        }

        if (ValidateChars.isNumber(char)) {
            this.buffer += char;
            return this.x_5(cadena.slice(1));
        }

        if (char === ".") {
            this.buffer += char;
            return this.x_6(cadena.slice(1));
        }

        if (ValidateChars.isNumericDelimiter(char)) {
            this._agregarNumero(TokenTypes.INTEGER_LITERAL, this.buffer);
            this.buffer = "";
            return cadena;
        }

        // ERROR: Consumir el carácter inválido y continuar
        this._crearError(char, this.fila, this.columna + this.buffer.length);
        this.buffer = ""; // Limpiar buffer
        this.estado = 1; // Volver al estado inicial
        return cadena.slice(1); // Consumir el carácter inválido
    }

    x_6(cadena) {
        const char = cadena[0];

        if (!char) {
            // Fin de cadena - número incompleto
            this._crearError(
                "Número incompleto",
                this.fila,
                this.columna + this.buffer.length
            );
            this.buffer = "";
            this.estado = 1;
            return cadena;
        }

        if (ValidateChars.isNumber(char)) {
            this.buffer += char;
            return this.x_7(cadena.slice(1));
        }

        // ERROR: Consumir el carácter inválido
        this._crearError(char, this.fila, this.columna + this.buffer.length);
        this.buffer = "";
        this.estado = 1;
        return cadena.slice(1);
    }

    x_7(cadena) {
        const char = cadena[0];

        if (!char) {
            // Fin de cadena
            this._agregarNumero(TokenTypes.FLOAT_LITERAL, this.buffer);
            this.buffer = "";
            return cadena;
        }

        if (ValidateChars.isNumber(char)) {
            this.buffer += char;
            return this.x_7(cadena.slice(1));
        }

        if (ValidateChars.isNumericDelimiter(char)) {
            this._agregarNumero(TokenTypes.FLOAT_LITERAL, this.buffer);
            this.buffer = "";
            return cadena;
        }

        // ERROR: Consumir el carácter inválido
        this._crearError(char, this.fila, this.columna + this.buffer.length);
        this.buffer = "";
        this.estado = 1;
        return cadena.slice(1);
    }

    // --------------------------
    // STRINGS Y COMENTARIOS
    // --------------------------
    x_8(cadena) {
        /**
         * Manejo de strings con comillas dobles
         */
        const char = cadena[0];

        if (char === '"') {
            this.buffer += char;
            this._agregarToken(TokenTypes.STRING_LITERAL, this.buffer);
            this.buffer = "";
            this.comAbierto = false;
            return cadena.slice(1);
        }

        if (char === "\n") {
            this._crearError('Falta de cierre "', this.fila, this.columna);
            this.fila += 1;
            this.columna = 1;
            this.estado = 1;
            this.buffer = "";
            this.comAbierto = false;
            return cadena.slice(1);
        }

        this.buffer += char;
        return this.x_8(cadena.slice(1));
    }

    x1_8(cadena) {
        /**
         * Manejo de strings con comillas simples
         */
        const char = cadena[0];

        if (char === "'") {
            this.buffer += char;
            this._agregarToken(TokenTypes.STRING_LITERAL, this.buffer);
            this.buffer = "";
            this.comAbierto = false;
            return cadena.slice(1);
        }

        if (char === "\n") {
            this._crearError("Falta de cierre '", this.fila, this.columna);
            this.fila += 1;
            this.columna = 1;
            this.estado = 1;
            this.buffer = "";
            this.comAbierto = false;
            return cadena.slice(1);
        }

        this.buffer += char;
        return this.x1_8(cadena.slice(1));
    }

    // Método  x_2 (comentarios con #)
    x_2(cadena) {
        const char = cadena[0];

        if (char === "\n") {
            // Fin del comentario
            this.estado = 1;
            this.buffer = "";
            return cadena;
        }

        this.buffer += char;
        return this.x_2(cadena.slice(1));
    }

    clean() {
        this.tokens = [];
        this.errors = [];
        this.estado = 1;
        this.fila = 1;
        this.columna = 1;
        this.buffer = "";
    }

    obtenerErrores() {
        return this.errores;
    }

    tieneErrores() {
        return this.errores.length > 0;
    }
}
