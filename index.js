import { Lexer } from "./src/lexer/lexer.js";

function main() {
    const lexer = new Lexer();
    const result = lexer.analizar(
        'Claves = [	"codigo", "producto", "precio_compra"] imprimir "Hola Mundo"; imprimir 123; &'
    );

    console.log("Tokens:", result.tokens);
    console.log("Errores:", result.errores);
}

main();
