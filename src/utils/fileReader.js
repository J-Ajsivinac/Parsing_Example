import fs from "fs";

export function readerFile(ruta) {
    try {
        const contenido = fs.readFileSync(ruta, "utf-8");
        return contenido;
    } catch (error) {
        console.error(`Error al leer el archivo ${ruta}:`, error.message);
        return null;
    }
}
