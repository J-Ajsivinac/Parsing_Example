/*
 * Utilidades para validación de caracteres
 */

export class ValidateChars {
    static isLetter(char) {
        return /^[a-zA-Z]$/.test(char);
    }

    static isNumber(char) {
        return /^[0-9]$/.test(char);
    }

    static isWhitespace(char) {
        const spaces = ["\t", "\n", " "];
        return spaces.includes(char);
    }

    static isDelimiter(char) {
        const delimiters = ['"', "\n", "\t", " ", ",", "}", "{", "=", "(", ")"];
        return delimiters.includes(char);
    }

    static isNumericDelimiter(char) {
        const numericDelimiters = ['"', "\n", "\t", " ", ",", "}", ")"];
        return numericDelimiters.includes(char);
    }
}
