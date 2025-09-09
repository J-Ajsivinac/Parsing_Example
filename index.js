import { Lexer } from "./src/lexer/index.js";
import Parser from "./src/parser/index.js";
import { readerFile } from "./src/utils/fileReader.js";

/*
 * Función principal para ejecutar el análisis léxico y sintáctico.
 * Lee un archivo de entrada, realiza el análisis léxico para generar tokens,
 * y luego realiza el análisis sintáctico para validar la estructura.
 * Imprime los tokens generados y cualquier error encontrado durante ambos análisis.
 */

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
