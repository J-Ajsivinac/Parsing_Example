/* Simulando un Enum para los tipos de Tokens
 * Se utiliza Object.freeze para evitar modificaciones
 * Object.freeze hace que el objeto no se pueda modificar
 */
export const TokenTypes = Object.freeze({
    // Palabras reservadas
    KEYWORD_KEYS: 1,
    KEYWORD_PRINT: 12,
    KEYWORD_AVERAGE: 15,
    KEYWORD_COUNTIF: 16,

    // Símbolos y operadores
    EQUALS: 2, // =
    LEFT_BRACE: 3, // {
    RIGHT_BRACE: 4, // }
    DOUBLE_QUOTE: 5, // "
    COMMA: 7, // ,
    LEFT_BRACKET: 8, // [
    RIGHT_BRACKET: 9, // ]
    HASH: 10, // #
    LEFT_PAREN: 22, // (
    RIGHT_PAREN: 23, // )
    SEMICOLON: 24, // ;
    SINGLE_QUOTE: 27, // '

    // Tipos de datos y literales
    STRING_LITERAL: 29,
    INTEGER_LITERAL: 30,
    FLOAT_LITERAL: 31,
    TEXT_LITERAL: 32,

    // Comentarios
    SINGLE_LINE_COMMENT: 25,
    MULTI_LINE_COMMENT: 26,
});
