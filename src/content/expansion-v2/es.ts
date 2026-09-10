import type { ExpansionLocaleContent } from "./types";

const privacy = "El procesamiento se realiza localmente en tu navegador.";
const dataItems = [
  "El contenido pegado no se sube para procesarlo.",
  "El portapapeles solo se usa después de pulsar Copiar.",
  "La descarga crea un archivo de texto local solo cuando la solicitas.",
] as const;

export const spanishExpansionContent = {
  homePatch: {
    description:
      "Compara dos listas para encontrar diferencias, coincidencias, elementos únicos, intersección y unión directamente en tu navegador.",
    metadata: {
      title: "Comparar listas online – diferencias y coincidencias | ListContrast",
      description:
        "Compara dos listas online y encuentra diferencias, coincidencias, elementos únicos, intersección y unión. Gratis y procesado localmente.",
    },
    editorial: {
      resultsHeading: "Resultados de la comparación de listas",
      resultsIntro:
        "Las vistas muestran la misma comparación desde distintos ángulos y mantienen el orden original. Con la eliminación de duplicados activada, los resultados equivalen a operaciones de conjuntos conocidas; si se conservan duplicados, cada aparición se empareja por separado.",
      resultsItems: [
        {
          term: "Diferencias",
          description:
            "elementos que quedan en una sola lista; sin duplicados, corresponde a la diferencia simétrica.",
        },
        {
          term: "Solo A",
          description:
            "elementos o apariciones de la Lista A sin pareja en B; sin duplicados, corresponde a A − B.",
        },
        {
          term: "Solo B",
          description:
            "elementos o apariciones de la Lista B sin pareja en A; sin duplicados, corresponde a B − A.",
        },
        {
          term: "Coincidencias",
          description:
            "elementos presentes en ambas listas; sin duplicados, corresponde a la intersección.",
        },
        {
          term: "Todos",
          description:
            "Lista A seguida de valores de B que aún no están representados; sin duplicados, corresponde a la unión.",
        },
      ],
      commonUsesItems: [
        "correos electrónicos, nombres y listas de participantes",
        "IDs, SKU y listas de productos",
        "URL, palabras clave y etiquetas",
        "columnas copiadas desde Excel o Google Sheets",
        "exportaciones de dos sistemas para localizar registros faltantes",
        "inventarios o exportaciones antiguas y nuevas para conciliación",
      ],
    },
  },
  randomTeamGenerator: {
    page: {
      heading: "Generador de equipos aleatorios",
      description:
        "Pega nombres, elige cuántos equipos quieres o cuántas personas habrá por equipo y crea grupos al azar equilibrados.",
      privacy,
    },
    tool: {
      heading: "Crear equipos al azar",
      listLabel: "Participantes o elementos",
      pastePlaceholder: "Un participante o elemento por línea",
      clear: "Limpiar",
      loadExample: "Probar ejemplo",
      example: "Ana\nBruno\nCarla\nDiego\nElena\nFelipe\nGabriela\nHugo",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar la lista actual? Se perderá el contenido actual.",
      participant: "participante",
      participants: "participantes",
      modeLabel: "Configuración de grupos",
      numberOfTeams: "Número de equipos",
      peoplePerTeam: "Personas por equipo",
      valueLabel: "Valor",
      generate: "Generar equipos",
      reroll: "Generar de nuevo",
      resultLabel: "Equipos aleatorios",
      team: "Equipo",
      copy: "Copiar todo",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      emptyResult: "Añade al menos dos elementos para generar equipos.",
      invalidValue: "Introduce un número entero positivo.",
      tooManyTeams:
        "El número de equipos no puede ser mayor que el número de elementos.",
      noscript:
        "JavaScript es necesario para generar equipos. La lista se procesa localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo crear equipos aleatorios",
      howToSteps: [
        "Pega un nombre o elemento por línea.",
        "Elige Número de equipos o Personas por equipo.",
        "Introduce un entero positivo y selecciona Generar equipos.",
        "Copia los grupos o genera otra distribución al azar.",
      ],
      resultsHeading: "Cómo se equilibran los grupos aleatorios",
      resultsIntro:
        "La lista se mezcla en el navegador y luego se reparte de la forma más equilibrada posible. Cada aparición válida se asigna exactamente una vez.",
      resultsItems: [
        {
          term: "Número de equipos",
          description:
            "crea esa cantidad de grupos y sus tamaños difieren como máximo en una persona.",
        },
        {
          term: "Personas por equipo",
          description:
            "usa el valor como tamaño máximo objetivo, calcula cuántos grupos hacen falta y los equilibra.",
        },
        {
          term: "Nombres repetidos",
          description:
            "se mantienen como apariciones separadas porque distintas personas pueden tener el mismo nombre.",
        },
      ],
      commonUsesHeading: "Usos habituales",
      commonUsesIntro: "Los grupos aleatorios sirven para:",
      commonUsesItems: [
        "equipos de clase y grupos de estudio",
        "talleres y grupos de trabajo",
        "juegos y deportes informales",
        "dinámicas de oficina y eventos",
      ],
      dataHeading: "Generación privada en el navegador",
      dataParagraph:
        "La mezcla y el reparto de equipos se realizan por completo en tu navegador.",
      dataItems,
      dataLinkLabel: "Más información en la página de Privacidad.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿Los equipos tienen el mismo tamaño?",
          answer:
            "Se equilibran todo lo posible. Si el número de personas no se divide exactamente, los tamaños difieren como máximo en una persona.",
        },
        {
          question: "¿Puedo elegir el tamaño del grupo en vez del número de equipos?",
          answer:
            "Sí. Elige Personas por equipo y la herramienta creará suficientes grupos para no superar ese tamaño objetivo.",
        },
        {
          question: "¿Puede haber dos personas con el mismo nombre?",
          answer: "Sí. Las líneas repetidas se conservan como apariciones distintas.",
        },
        {
          question: "¿Se suben los nombres?",
          answer: "No. La generación de equipos ocurre localmente en tu navegador.",
        },
      ],
    },
  },
  randomPairGenerator: {
    page: {
      heading: "Generador de parejas aleatorias",
      description:
        "Pega nombres o elementos y crea parejas al azar; si la lista es impar, el elemento restante se muestra claramente.",
      privacy,
    },
    tool: {
      heading: "Crear parejas al azar",
      listLabel: "Participantes o elementos",
      pastePlaceholder: "Un participante o elemento por línea",
      clear: "Limpiar",
      loadExample: "Probar ejemplo",
      example: "Ana\nBruno\nCarla\nDiego\nElena\nFelipe\nGabriela",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar la lista actual? Se perderá el contenido actual.",
      item: "elemento",
      items: "elementos",
      generate: "Generar parejas",
      reroll: "Generar de nuevo",
      resultLabel: "Parejas aleatorias",
      pair: "Pareja",
      unpaired: "Sin pareja",
      copy: "Copiar todo",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      emptyResult: "Añade al menos un elemento para generar parejas.",
      noscript:
        "JavaScript es necesario para generar parejas. La lista se procesa localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo crear parejas aleatorias",
      howToSteps: [
        "Pega un nombre o elemento por línea.",
        "Selecciona Generar parejas.",
        "Revisa las parejas y, si aparece, el elemento Sin pareja.",
        "Copia el resultado o genera una nueva combinación.",
      ],
      resultsHeading: "Cómo funciona el emparejamiento aleatorio",
      resultsIntro:
        "La herramienta mezcla todas las apariciones válidas y recorre la lista resultante de dos en dos.",
      resultsItems: [
        { term: "Cantidad par", description: "cada elemento queda dentro de una pareja." },
        {
          term: "Cantidad impar",
          description:
            "se crean todas las parejas posibles y se muestra un elemento como Sin pareja.",
        },
        {
          term: "Nombres repetidos",
          description: "se conservan como apariciones separadas y no se eliminan.",
        },
      ],
      commonUsesHeading: "Usos habituales",
      commonUsesIntro: "Las parejas aleatorias son útiles para:",
      commonUsesItems: [
        "compañeros de estudio",
        "ejercicios de talleres",
        "parejas para entrevistas o revisión",
        "juegos y actividades prácticas",
      ],
      dataHeading: "Emparejamiento privado en el navegador",
      dataParagraph: "Las parejas se generan por completo en tu navegador.",
      dataItems,
      dataLinkLabel: "Más información en la página de Privacidad.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿Qué pasa si hay un número impar de nombres?",
          answer:
            "Se crean todas las parejas posibles y el elemento restante se marca como Sin pareja.",
        },
        {
          question: "¿Generar de nuevo evita parejas anteriores?",
          answer:
            "No. Cada generación es independiente y no se guarda el historial de parejas.",
        },
        {
          question: "¿Se eliminan los nombres repetidos?",
          answer: "No. Se conserva cada aparición válida.",
        },
        {
          question: "¿Se suben mis nombres?",
          answer: "No. Las parejas se generan localmente en tu navegador.",
        },
      ],
    },
  },
  removeLineBreaks: {
    page: {
      heading: "Eliminar saltos de línea",
      description:
        "Quita saltos de línea no deseados, conserva párrafos o reemplaza cada salto por un separador personalizado.",
      privacy,
    },
    tool: {
      heading: "Eliminar o reemplazar saltos de línea",
      textLabel: "Texto",
      pastePlaceholder: "Pega texto con saltos de línea no deseados",
      clear: "Limpiar",
      loadExample: "Probar ejemplo",
      example:
        "Este párrafo se copió\ncon saltos de línea duros\nque deberían convertirse en espacios.\n\nEste segundo párrafo\ndebe quedar separado.",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar el texto actual? Se perderá el contenido actual.",
      options: "Opciones",
      replaceWith: "Reemplazar saltos de línea por",
      separatorSpace: "Espacio",
      separatorNothing: "Nada",
      separatorComma: "Coma",
      separatorCommaSpace: "Coma + espacio",
      separatorSemicolon: "Punto y coma",
      separatorCustom: "Personalizado",
      customSeparator: "Separador personalizado",
      keepParagraphs: "Conservar saltos de párrafo",
      trimEachLine: "Recortar espacios de cada línea",
      collapseSpaces: "Reducir espacios repetidos",
      resultLabel: "Texto limpio",
      emptyResult: "Pega texto para ver el resultado limpio.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      noscript:
        "JavaScript es necesario para eliminar saltos de línea. El texto se procesa localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo quitar saltos de línea",
      howToSteps: [
        "Pega texto con saltos de línea duros no deseados.",
        "Elige con qué reemplazar cada salto de línea.",
        "Conserva los párrafos si las líneas vacías deben seguir separándolos.",
        "Copia o descarga el texto limpio.",
      ],
      resultsHeading: "Saltos de línea, nuevas líneas y párrafos",
      resultsIntro:
        "La herramienta normaliza primero los finales de línea de Windows, Unix y retornos de carro antiguos, y después aplica el reemplazo elegido.",
      resultsItems: [
        {
          term: "Espacio",
          description:
            "es la opción segura por defecto para recomponer texto sin pegar palabras contiguas.",
        },
        {
          term: "Conservar saltos de párrafo",
          description:
            "une saltos simples dentro de cada párrafo y mantiene separados los bloques divididos por líneas vacías.",
        },
        {
          term: "Personalizado",
          description: "permite sustituir nuevas líneas por cualquier separador corto.",
        },
      ],
      commonUsesHeading: "Usos habituales",
      commonUsesIntro: "Quitar saltos de línea resulta útil con texto copiado de:",
      commonUsesItems: [
        "documentos PDF",
        "correo electrónico y páginas web",
        "documentos Word y comentarios",
        "OCR o extracción de texto",
      ],
      dataHeading: "Limpieza privada en el navegador",
      dataParagraph: "La transformación del texto ocurre por completo en tu navegador.",
      dataItems,
      dataLinkLabel: "Más información en la página de Privacidad.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿Puedo quitar nuevas líneas sin borrar los párrafos?",
          answer:
            "Sí. Activa Conservar saltos de párrafo para mantener los bloques separados por líneas vacías.",
        },
        {
          question: "¿Puedo reemplazar saltos de línea por comas?",
          answer:
            "Sí. Elige Coma, Coma + espacio o introduce un separador personalizado.",
        },
        {
          question: "¿Funciona con finales de línea de Windows y Unix?",
          answer: "Sí. Se normalizan LF, CRLF y CR antes de transformar el texto.",
        },
        {
          question: "¿Se sube mi texto?",
          answer: "No. La transformación se realiza localmente en tu navegador.",
        },
      ],
    },
  },
  columnToCommaSeparatedList: {
    page: {
      heading: "Columna a lista separada por comas",
      description:
        "Convierte una columna con un elemento por línea en una lista separada por comas o usa otro separador.",
      privacy,
    },
    tool: {
      heading: "Convertir una columna en lista",
      listLabel: "Columna",
      pastePlaceholder: "Un elemento por línea",
      clear: "Limpiar",
      loadExample: "Probar ejemplo",
      example: "manzana\nbanana\ncereza",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar la columna actual? Se perderá el contenido actual.",
      options: "Opciones",
      trimWhitespace: "Recortar espacios alrededor",
      ignoreEmptyLines: "Ignorar líneas vacías",
      separator: "Separador",
      separatorCommaSpace: "Coma + espacio",
      separatorComma: "Coma",
      separatorSemicolon: "Punto y coma",
      separatorPipe: "Barra vertical",
      separatorTab: "Tabulación",
      separatorCustom: "Personalizado",
      customSeparator: "Separador personalizado",
      resultLabel: "Lista convertida",
      item: "elemento",
      items: "elementos",
      emptyResult: "Pega una columna para ver la lista convertida.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      noscript:
        "JavaScript es necesario para convertir la columna. La lista se procesa localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo convertir una columna en una lista separada por comas",
      howToSteps: [
        "Pega un valor por línea.",
        "Mantén Coma + espacio o elige otro separador.",
        "Ajusta los espacios y las líneas vacías si lo necesitas.",
        "Copia o descarga el resultado en una sola línea.",
      ],
      resultsHeading: "Cómo se convierte la columna",
      resultsIntro:
        "Cada línea procesada sigue siendo un valor independiente en el mismo orden y el separador elegido se inserta entre valores.",
      resultsItems: [
        {
          term: "Coma + espacio",
          description: "genera por defecto una lista separada por comas fácil de leer.",
        },
        {
          term: "Otros separadores",
          description:
            "incluyen coma, punto y coma, barra vertical, tabulación y un valor personalizado.",
        },
        {
          term: "Duplicados",
          description:
            "se conservan porque esta herramienta da formato a la lista, no elimina valores repetidos.",
        },
      ],
      commonUsesHeading: "Usos habituales",
      commonUsesIntro: "La conversión de columnas sirve para:",
      commonUsesItems: [
        "columnas copiadas desde Excel o Google Sheets",
        "IDs, nombres, URL y palabras clave",
        "valores separados por comas para formularios o filtros",
        "texto separado por punto y coma, barra vertical o tabulación",
      ],
      dataHeading: "Formato privado en el navegador",
      dataParagraph: "La conversión de la columna ocurre por completo en tu navegador.",
      dataItems,
      dataLinkLabel: "Más información en la página de Privacidad.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿Puedo usar un separador distinto de la coma?",
          answer:
            "Sí. Elige punto y coma, barra vertical, tabulación o introduce un separador personalizado.",
        },
        {
          question: "¿Se eliminan los valores duplicados?",
          answer: "No. Las líneas repetidas se mantienen en su orden original.",
        },
        {
          question: "¿Puedo conservar los espacios alrededor de los valores?",
          answer:
            "Sí. Desactiva Recortar espacios alrededor para conservarlos tal como los pegaste.",
        },
        {
          question: "¿Se sube mi columna?",
          answer: "No. La conversión se realiza localmente en tu navegador.",
        },
      ],
    },
  },
  metadata: {
    randomTeamGenerator: {
      title: "Generador de equipos aleatorios – crear grupos al azar | ListContrast",
      description:
        "Pega nombres, elige número de equipos o personas por equipo y crea grupos aleatorios equilibrados. Procesado localmente en el navegador.",
    },
    randomPairGenerator: {
      title: "Generador de parejas aleatorias online | ListContrast",
      description:
        "Crea parejas aleatorias a partir de nombres o elementos. Las listas impares se gestionan claramente y todo ocurre en tu navegador.",
    },
    removeLineBreaks: {
      title: "Eliminar saltos de línea online – conservar párrafos | ListContrast",
      description:
        "Quita saltos de línea y nuevas líneas, conserva párrafos o reemplaza los saltos con un separador. Procesado localmente.",
    },
    columnToCommaSeparatedList: {
      title: "Columna a lista separada por comas online | ListContrast",
      description:
        "Convierte una columna en lista separada por comas, punto y coma, barra vertical, tabulación o un separador personalizado.",
    },
  },
  toolsPageItems: {
    randomTeamGenerator: {
      label: "Generador de equipos aleatorios",
      description: "Divide nombres o elementos en equipos al azar equilibrados.",
    },
    randomPairGenerator: {
      label: "Generador de parejas aleatorias",
      description: "Crea parejas al azar y muestra claramente un elemento restante.",
    },
    removeLineBreaks: {
      label: "Eliminar saltos de línea",
      description: "Une texto cortado y conserva los párrafos cuando lo necesites.",
    },
    columnToCommaSeparatedList: {
      label: "Columna a lista separada por comas",
      description: "Convierte una columna de líneas en una lista con separadores.",
    },
  },
  aboutParagraphs: [
    "ListContrast es una colección enfocada de herramientas en el navegador para comparar, ordenar, aleatorizar, limpiar y dar formato a listas basadas en líneas.",
    "Incluye comparación de listas, orden alfabético, mezcla aleatoria, eliminación de duplicados, generación de equipos y parejas, limpieza de saltos de línea y conversión de columnas a listas delimitadas.",
    "Las herramientas están pensadas para tareas rápidas sin cuentas y sin procesamiento en servidor del contenido que pegas.",
  ],
} satisfies ExpansionLocaleContent;
