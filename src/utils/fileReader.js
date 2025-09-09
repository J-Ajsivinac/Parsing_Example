import fs from "fs";

/*
 * Función para leer el contenido de un archivo dado su ruta.
 * Parámetros:
 *   - ruta: Ruta del archivo a leer.
 */

export function readerFile(ruta) {
    try {
        const contenido = fs.readFileSync(ruta, "utf-8");
        return contenido;
    } catch (error) {
        console.error(`Error al leer el archivo ${ruta}:`, error.message);
        return null;
    }
}
