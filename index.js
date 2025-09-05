import { Lexer } from "./src/lexer/index.js";
import Parser from "./src/parser/index.js";
import { readerFile } from "./src/utils/fileReader.js";

function main() {
    const rutaArchivo = "./test.txt";
    const contenido = readerFile(rutaArchivo);
    if (!contenido) {
        console.error("No se pudo leer el archivo. Terminando ejecución.");
        return;
    }

    const lexer = new Lexer();
    const result = lexer.analizar(contenido);

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
