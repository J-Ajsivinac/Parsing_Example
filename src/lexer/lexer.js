import { TokenTypes } from "./tokenTypes";

export class Lexer {
    constructor() {
        this.clean();

        // Palabras reservadas
        this.patterns = new Map([
            ["claves", TokenTypes.KEYWORD_KEYS],
            ["imprimir", TokenTypes.KEYWORD_PRINT],
            ["promedio", TokenTypes.KEYWORD_AVERAGE],
            ["contar_si", TokenTypes.KEYWORD_COUNTIF],
        ]);

        // Mapear caracteres a tokens directos
        this.symbols = new Map([
            ["{", TokenTypes.LBRACE],
            ["}", TokenTypes.RBRACE],
            ["(", TokenTypes.LPAREN],
            [")", TokenTypes.RPAREN],
            ["[", TokenTypes.LBRACKET],
            ["]", TokenTypes.RBRACKET],
            [",", TokenTypes.COMMA],
            [";", TokenTypes.SEMICOLON],
            [".", TokenTypes.DOT],
            ["=", TokenTypes.EQUALS],
        ]);
    }

    clean() {
        this.tokens = [];
        this.errors = [];
        this.estado = 1;
        this.fila = 1;
        this.columna = 1;
        this.buffer = "";
    }
}
