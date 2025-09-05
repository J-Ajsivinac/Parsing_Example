import { Lexer } from "./src/lexer/index.js";
import Parser from "./src/parser/index.js";

function main() {
    const lexer = new Lexer();
    const result = lexer.analizar(
        'Claves = [	"12", "3"] ; imprimir ("Hola Mundo"); imprimir (123); &'
    );

    console.log("Tokens:", result.tokens);
    console.log("Errores:", result.errores);

    const parser = new Parser(result.tokens);
    const erroresSintacticos = parser.analizar();

    if (parser.esValido()) {
        console.log("Análisis sintáctico exitoso.");
    } else {
        console.log("Errores de análisis sintáctico encontrados:");
        parser.imprimirErrores();
    }
}

main();
