# Delimitadores en el Análisis Léxico

## ¿Qué son los Delimitadores?

Los delimitadores son caracteres especiales que tienen la función de separar elementos léxicos (tokens) dentro del código fuente. Funcionan como fronteras que permiten al analizador léxico identificar dónde termina un token y dónde comienza otro.

## Origen de los Delimitadores

Los delimitadores definidos en la clase `ValidateChars` del archivo `validate.js` tienen dos fuentes principales:

1. **La Gramática del Lenguaje**: La gramática formal definida en `grammar.txt` establece qué símbolos tienen significado especial en el lenguaje. Estos símbolos necesitan ser reconocidos individualmente durante el análisis léxico.

2. **El Diseño del Autómata Finito Determinista (AFD)**: El AFD que implementa el analizador léxico requiere identificar puntos de transición entre estados. Los delimitadores marcan muchas de estas transiciones.

## Clasificación de Delimitadores

En nuestro proyecto, los delimitadores se pueden clasificar en varias categorías según su función:

### 1. Símbolos con Significado Sintáctico

Estos caracteres tienen un significado específico en la sintaxis del lenguaje:

-   **Operadores**: `=` (asignación)
-   **Delimitadores de bloques**:
    -   `{`, `}` (llaves)
    -   `(`, `)` (paréntesis)
    -   `[`, `]` (corchetes)
-   **Separadores**:
    -   `,` (coma para separar elementos)
    -   `;` (punto y coma para finalizar instrucciones)

### 2. Caracteres de Espaciado

Estos caracteres separan tokens pero no tienen valor semántico por sí mismos:

-   Espacio en blanco (` `)
-   Tabulación (`\t`)
-   Salto de línea (`\n`)

### 3. Caracteres Especiales del Lenguaje

Estos caracteres tienen funciones específicas en el lenguaje:

-   **Delimitadores de cadenas**:
    -   Comillas dobles (`"`)
    -   Comillas simples (`'`)
-   **Marcadores de comentarios**:
    -   Almohadilla (`#`) para iniciar comentarios de línea

### 4. Valor Especial

-   `undefined`: Incluido para manejar el final del archivo o cadena de entrada.

## Implementación en el Código

En el archivo `validate.js`, los delimitadores se implementan a través de dos métodos:

```javascript
static isDelimiter(char) {
    const delimiters = [
        '"', "'", "\n", "\t", " ", ",", "}", "{", "=",
        "(", ")", ";", "[", "]", "#", undefined
    ];
    return delimiters.includes(char);
}

static isNumericDelimiter(char) {
    const numericDelimiters = [
        '"', "'", "\n", "\t", " ", ",", "}", "{", "=",
        "(", ")", ";", "[", "]", "#", undefined
    ];
    return numericDelimiters.includes(char);
}
```

Aunque ambos métodos contienen la misma lista de delimitadores en esta implementación, conceptualmente `isNumericDelimiter` podría haberse diseñado para tener un conjunto diferente de delimitadores específicos para números.

## Aplicación en el Análisis Léxico

Los delimitadores se utilizan en el analizador léxico (`lexer/index.js`) para:

1. **Detectar Límites de Tokens**:

    - Cuando el lexer está leyendo un identificador y encuentra un delimitador, sabe que el identificador ha terminado.
    - Ejemplo: En `Claves =`, el espacio después de "Claves" indica que el identificador ha terminado.

2. **Reconocer Tokens de Un Solo Carácter**:

    - Muchos delimitadores son tokens por sí mismos (como `{`, `}`, `;`).
    - Ejemplo: En `Claves = [`, los caracteres `=` y `[` son tokens individuales.

3. **Transiciones en el AFD**:
    - Ciertos delimitadores provocan cambios de estado en el autómata.
    - Ejemplo: Encontrar una comilla doble (`"`) cambia al estado de reconocimiento de cadenas.

## Ejemplo de Análisis Paso a Paso

Para ilustrar cómo funcionan los delimitadores en la práctica, analicemos el siguiente fragmento de código:

```
Claves = ["valor1", "valor2"];
```

1. El lexer lee `C` → No es un delimitador, comienza a acumular caracteres en el buffer.
2. Continúa leyendo `l`, `a`, `v`, `e`, `s` → Ninguno es delimitador, se siguen acumulando.
3. Encuentra un espacio (` `) → Es un delimitador, por lo que:
    - El buffer contiene "Claves"
    - Se identifica como palabra clave (KEYWORD_KEYS)
    - Se crea un token y se reinicia el buffer
4. Encuentra `=` → Es un delimitador y un token por sí mismo (EQUALS)
5. Encuentra un espacio → Es un delimitador (se ignora como whitespace)
6. Encuentra `[` → Es un delimitador y un token por sí mismo (LEFT_BRACKET)
7. Encuentra `"` → Es un delimitador especial que cambia el estado del autómata al modo de lectura de cadenas
8. Lee `v`, `a`, `l`, `o`, `r`, `1` → Ninguno es delimitador en el contexto de una cadena
9. Encuentra otra `"` → Indica el final de la cadena, creando un token STRING_LITERAL con valor "valor1"
10. Y así sucesivamente...

## Consideraciones de Diseño

1. **Eficiencia**: Usar un arreglo y el método `includes()` es simple pero no la implementación más eficiente para grandes volúmenes de texto. Para proyectos más grandes, se podría considerar usar un conjunto (Set) o un mapa de bits.

2. **Mantenibilidad**: La duplicación de la lista de delimitadores sugiere una oportunidad de refactorización para evitar redundancia y posibles inconsistencias.

3. **Extensibilidad**: Si se quisiera ampliar el lenguaje con nuevos operadores o símbolos, simplemente se agregarían a la lista de delimitadores.

## Conclusión

Los delimitadores son una parte fundamental del proceso de análisis léxico, actuando como los guardianes que ayudan a segmentar el código fuente en tokens significativos. Su correcta identificación es esencial para que las etapas posteriores del compilador (como el análisis sintáctico) puedan trabajar con una representación estructurada del código fuente.
