/*
 * Utilidades para validación de caracteres
 */

export class ValidateChars {
    static isLetter(char) {
        return /^[a-zA-Z]$/.test(char);
    }

    static isNumber(char) {
        return /^\d$/.test(char);
    }

    static isWhitespace(char) {
        return /^[\t\n ]$/.test(char);
    }

    static isDelimiter(char) {
        const delimiters = [
            '"',
            "'",
            "\n",
            "\t",
            " ",
            ",",
            "}",
            "{",
            "=",
            "(",
            ")",
            ";",
            "[",
            "]",
            "#",
            undefined,
        ];
        return delimiters.includes(char);
    }

    static isNumericDelimiter(char) {
        const numericDelimiters = [
            '"',
            "'",
            "\n",
            "\t",
            " ",
            ",",
            "}",
            "{",
            "=",
            "(",
            ")",
            ";",
            "[",
            "]",
            "#",
            undefined,
        ];
        return numericDelimiters.includes(char);
    }
}
