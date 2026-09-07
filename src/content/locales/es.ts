import type { LocaleContent, ToolPageKey } from "../../i18n/types";

const related = (pageKey: ToolPageKey, label: string, description: string) =>
  ({ pageKey, label, description }) as const;

export const spanishContent = {
  siteName: "ListContrast",
  home: {
    heading: "Comparar listas online",
    description:
      "Compara dos listas y encuentra diferencias, coincidencias y elementos únicos al instante.",
    privacy: "El procesamiento se realiza localmente en tu navegador.",
  },
  compare: {
    heading: "Comparar listas",
    listA: "Lista A",
    listB: "Lista B",
    pastePlaceholder: "Pega un elemento por línea",
    clear: "Borrar",
    swap: "Intercambiar",
    loadExample: "Probar ejemplo",
    replaceExampleConfirmation:
      "¿Cargar el ejemplo y reemplazar las dos listas actuales? Se perderá el contenido que has introducido.",
    comparisonOptions: "Opciones",
    trimWhitespace: "Ignorar espacios alrededor",
    ignoreEmptyLines: "Ignorar líneas vacías",
    ignoreCase: "Ignorar mayúsculas y minúsculas",
    removeDuplicates: "Eliminar duplicados",
    results: "Resultados",
    emptyResults:
      "Pega dos listas arriba para ver sus diferencias y coincidencias.",
    noDifferences: "No se encontraron diferencias.",
    sameValues:
      "Las dos listas contienen los mismos valores con las opciones de comparación actuales.",
    noMatches: "No hay valores coincidentes.",
    onlyInA: "Solo en A",
    inBoth: "En ambas",
    onlyInB: "Solo en B",
    row: "línea",
    rows: "líneas",
    item: "elemento",
    items: "elementos",
    differences: "Diferencias",
    onlyA: "Solo A",
    onlyB: "Solo B",
    matches: "Coincidencias",
    all: "Todo",
    noscript:
      "JavaScript es necesario para comparar listas. El contenido se procesa localmente en tu navegador y no se sube para realizar la comparación.",
    copy: "Copiar",
    copied: "Copiado",
    download: "Descargar",
    copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
  },
  alphabetizeList: {
    page: {
      heading: "Ordenar lista alfabéticamente",
      description:
        "Ordena nombres, palabras o cualquier lista por líneas de A a Z o de Z a A.",
      privacy: "El procesamiento se realiza localmente en tu navegador.",
    },
    tool: {
      heading: "Ordenar lista alfabéticamente",
      listLabel: "Lista",
      pastePlaceholder: "Pega un elemento por línea",
      clear: "Borrar",
      loadExample: "Probar ejemplo",
      example: "Árbol\nNaranja\nNiño\nZorro\nElemento 10\nElemento 2",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar la lista actual? Se perderá el contenido que has introducido.",
      options: "Opciones",
      trimWhitespace: "Quitar espacios alrededor",
      ignoreEmptyLines: "Ignorar líneas vacías",
      order: "Orden",
      ascending: "A → Z",
      descending: "Z → A",
      resultLabel: "Lista ordenada",
      item: "elemento",
      items: "elementos",
      emptyResult: "Pega una lista para ver el resultado ordenado.",
      noEffectiveItems: "No quedan elementos con las opciones actuales.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      noscript:
        "JavaScript es necesario para ordenar una lista. El contenido se procesa localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo ordenar una lista alfabéticamente",
      howToSteps: [
        "Pega un elemento por línea en el campo Lista.",
        "Mantén A → Z o cambia a Z → A.",
        "Ajusta el tratamiento de espacios y líneas vacías si lo necesitas.",
        "Revisa el resultado y copia o descarga la lista ordenada.",
      ],
      resultsHeading: "Cómo funciona el orden alfabético",
      resultsIntro:
        "La herramienta usa la intercalación del navegador para español, reconoce números dentro del texto y conserva los elementos repetidos y su escritura original.",
      resultsItems: [
        {
          term: "A → Z",
          description: "ordena los elementos procesados de forma ascendente.",
        },
        {
          term: "Z → A",
          description: "ordena los mismos elementos de forma descendente.",
        },
        {
          term: "Números en el texto",
          description:
            "se ordenan de forma natural, por lo que Elemento 2 aparece antes que Elemento 10.",
        },
      ],
      commonUsesHeading: "Usos habituales",
      commonUsesIntro: "El orden alfabético es útil para:",
      commonUsesItems: [
        "listas de nombres y participantes",
        "palabras y vocabulario",
        "palabras clave y etiquetas",
        "nombres de productos",
        "columnas copiadas desde Excel o Google Sheets",
      ],
      dataHeading: "Cómo se procesan tus datos",
      dataParagraph:
        "El ordenamiento se ejecuta por completo en tu navegador. La lista pegada y el resultado no se envían a un servidor para procesarlos.",
      dataItems: [
        "Los espacios al principio y al final solo se eliminan si activas esa opción.",
        "Las líneas vacías solo se descartan si la opción está activada.",
        "Copiar accede al portapapeles únicamente después de pulsar el botón.",
        "Descargar crea un archivo de texto local únicamente después de pulsar el botón.",
      ],
      dataLinkLabel: "Consulta la página de Privacidad para ver todos los detalles.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿Se eliminan los duplicados al ordenar?",
          answer:
            "No. Las líneas repetidas se conservan y solo cambian de posición dentro del orden alfabético.",
        },
        {
          question: "¿Cómo se ordenan letras como ñ y los caracteres acentuados?",
          answer:
            "La página usa las reglas de intercalación del navegador para español, incluidas letras y acentos propios del idioma.",
        },
        {
          question: "¿Puede ordenar números dentro del texto?",
          answer:
            "Sí. El orden numérico hace que, por ejemplo, Elemento 2 aparezca antes que Elemento 10.",
        },
        {
          question: "¿Puedo ordenar una columna de Excel o Google Sheets?",
          answer:
            "Sí. Copia una columna y pégala con un valor por línea.",
        },
        {
          question: "¿Se sube mi lista a un servidor?",
          answer:
            "No. El ordenamiento se ejecuta localmente en tu navegador y el contenido no se envía para procesarlo.",
        },
      ],
    },
  },
  randomizeList: {
    page: {
      heading: "Mezclar una lista",
      description:
        "Reordena nombres, palabras o cualquier lista por líneas en un orden aleatorio.",
      privacy: "El procesamiento se realiza localmente en tu navegador.",
    },
    tool: {
      heading: "Mezclar una lista",
      listLabel: "Lista",
      pastePlaceholder: "Pega un elemento por línea",
      clear: "Borrar",
      loadExample: "Probar ejemplo",
      example: "Manzana\nPera\nCereza\nCiruela\nUva",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar la lista actual? Se perderá el contenido que has introducido.",
      options: "Opciones",
      trimWhitespace: "Quitar espacios alrededor",
      ignoreEmptyLines: "Ignorar líneas vacías",
      randomize: "Mezclar",
      resultLabel: "Lista mezclada",
      item: "elemento",
      items: "elementos",
      emptyResult: "Pega una lista para crear un orden aleatorio.",
      readyResult: "Pulsa Mezclar para reordenar la lista actual.",
      noEffectiveItems: "No quedan elementos con las opciones actuales.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      noscript:
        "JavaScript es necesario para mezclar una lista. El contenido se procesa localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo mezclar una lista",
      howToSteps: [
        "Pega un elemento por línea.",
        "Ajusta los espacios o las líneas vacías si lo necesitas.",
        "Pulsa Mezclar para generar un nuevo orden aleatorio.",
        "Vuelve a mezclar o copia y descarga el resultado que quieras conservar.",
      ],
      resultsHeading: "Cómo funciona el orden aleatorio",
      resultsIntro:
        "La herramienta usa un algoritmo Fisher–Yates en el navegador. Cada aparición procesada permanece en el resultado, incluidos los elementos duplicados.",
      resultsItems: [
        {
          term: "Mezclar",
          description:
            "genera una nueva permutación aleatoria de la lista cada vez que lo pulsas.",
        },
        {
          term: "Elementos repetidos",
          description: "se mantienen como apariciones separadas en el resultado.",
        },
      ],
      commonUsesHeading: "Usos habituales de una lista aleatoria",
      commonUsesIntro: "Un orden mezclado puede servir para:",
      commonUsesItems: [
        "nombres y participantes",
        "preguntas o indicaciones",
        "tareas y actividades",
        "palabras y vocabulario",
        "columnas copiadas desde Excel o Google Sheets",
      ],
      dataHeading: "Cómo se procesan tus datos",
      dataParagraph:
        "La mezcla se ejecuta por completo en tu navegador. La lista y el resultado no se envían a un servidor para procesarlos.",
      dataItems: [
        "Los espacios alrededor solo se eliminan si activas la opción correspondiente.",
        "Las líneas vacías solo se descartan si esa opción está activada.",
        "Copiar accede al portapapeles únicamente después de pulsar el botón.",
        "Descargar crea un archivo de texto local únicamente después de pulsar el botón.",
      ],
      dataLinkLabel: "Consulta la página de Privacidad para ver todos los detalles.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿La herramienta elimina duplicados?",
          answer:
            "No. Cada línea se conserva como una aparición independiente en la lista mezclada.",
        },
        {
          question: "¿Cada mezcla será diferente?",
          answer:
            "No necesariamente. El azar puede producir el mismo orden, especialmente en listas cortas.",
        },
        {
          question: "¿La lista se mezcla mientras escribo?",
          answer:
            "No. Solo se genera un nuevo orden cuando pulsas Mezclar.",
        },
        {
          question: "¿Puedo mezclar nombres copiados desde una hoja de cálculo?",
          answer:
            "Sí. Pega una columna con un valor por línea.",
        },
        {
          question: "¿Se sube mi lista a un servidor?",
          answer:
            "No. La mezcla se realiza localmente en tu navegador y la lista no se envía para procesarla.",
        },
      ],
    },
  },
  removeDuplicateLines: {
    page: {
      heading: "Eliminar líneas duplicadas",
      description:
        "Elimina líneas repetidas conservando la primera aparición y el orden original.",
      privacy: "El procesamiento se realiza localmente en tu navegador.",
    },
    tool: {
      heading: "Eliminar líneas duplicadas",
      listLabel: "Lista",
      pastePlaceholder: "Pega un elemento por línea",
      clear: "Borrar",
      loadExample: "Probar ejemplo",
      example: "Manzana\nBanana\nManzana\nCereza\nbanana",
      replaceExampleConfirmation:
        "¿Cargar el ejemplo y reemplazar el texto actual? Se perderá el contenido que has introducido.",
      options: "Opciones",
      trimWhitespace: "Quitar espacios alrededor",
      ignoreEmptyLines: "Ignorar líneas vacías",
      ignoreCase: "Ignorar mayúsculas y minúsculas",
      resultLabel: "Líneas únicas",
      item: "elemento",
      items: "elementos",
      emptyResult: "Pega texto o una lista para eliminar líneas duplicadas.",
      noEffectiveItems: "No quedan líneas con las opciones actuales.",
      input: "Entrada",
      unique: "Únicas",
      removed: "Eliminadas",
      copy: "Copiar",
      copied: "Copiado",
      download: "Descargar",
      copyError: "No se pudo copiar. Selecciona el resultado manualmente.",
      noscript:
        "JavaScript es necesario para eliminar líneas duplicadas. El procesamiento se realiza localmente en tu navegador.",
    },
    editorial: {
      howToHeading: "Cómo eliminar líneas duplicadas",
      howToSteps: [
        "Pega texto o una lista con un elemento por línea.",
        "Ajusta el tratamiento de espacios, líneas vacías o mayúsculas y minúsculas si lo necesitas.",
        "Las líneas duplicadas se eliminan automáticamente y se conserva la primera aparición.",
        "Revisa las líneas únicas y copia o descarga el resultado.",
      ],
      resultsHeading: "Cómo funciona la eliminación de duplicados",
      resultsIntro:
        "Las líneas se procesan de arriba abajo. Se conserva la primera aparición de cada valor, se eliminan las repeticiones posteriores y se mantiene el orden original.",
      resultsItems: [
        {
          term: "Entrada",
          description:
            "cuenta las líneas procesadas antes de eliminar los duplicados.",
        },
        {
          term: "Únicas",
          description: "cuenta las líneas que se mantienen en el resultado.",
        },
        {
          term: "Eliminadas",
          description: "muestra cuántas repeticiones se han quitado.",
        },
      ],
      commonUsesHeading: "Usos habituales",
      commonUsesIntro: "Eliminar duplicados es útil para:",
      commonUsesItems: [
        "palabras clave y términos de búsqueda",
        "identificadores y referencias",
        "URL y dominios",
        "nombres y etiquetas",
        "columnas copiadas desde Excel o Google Sheets",
      ],
      dataHeading: "Cómo se procesan tus datos",
      dataParagraph:
        "La eliminación de duplicados se ejecuta por completo en tu navegador. Las líneas pegadas y el resultado no se envían para procesarlos.",
      dataItems: [
        "Los espacios alrededor se eliminan antes de comparar solo si activas esa opción.",
        "Las líneas vacías se ignoran solo si la opción está activada.",
        "Ignorar mayúsculas y minúsculas solo cambia la identidad usada para detectar duplicados; se conserva el texto de la primera línea.",
        "Copiar y Descargar exportan el resultado únicamente después de tu acción.",
      ],
      dataLinkLabel: "Consulta la página de Privacidad para ver todos los detalles.",
      faqHeading: "Preguntas frecuentes",
      faqItems: [
        {
          question: "¿Qué línea duplicada se conserva?",
          answer:
            "Se conserva la primera aparición. Las líneas posteriores con la misma identidad de comparación se eliminan.",
        },
        {
          question: "¿Se pueden ignorar mayúsculas y minúsculas?",
          answer:
            "Sí. Por ejemplo, Manzana y manzana pueden tratarse como duplicados sin modificar el texto de la primera aparición conservada.",
        },
        {
          question: "¿Se mantiene el orden original?",
          answer:
            "Sí. La herramienta no ordena la lista; mantiene el orden de las primeras apariciones.",
        },
        {
          question: "¿Puedo quitar duplicados de una columna de hoja de cálculo?",
          answer:
            "Sí. Pega una columna con un valor por línea.",
        },
        {
          question: "¿Se sube mi texto a un servidor?",
          answer:
            "No. La eliminación de duplicados se ejecuta localmente en tu navegador y el texto no se envía para procesarlo.",
        },
      ],
    },
  },
  header: {
    ariaLabel: "Navegación principal",
    tools: "Herramientas",
    about: "Acerca de",
    language: "Idioma",
  },
  editorial: {
    howToHeading: "Cómo comparar dos listas",
    howToSteps: [
      "Pega la primera lista en Lista A.",
      "Pega la segunda lista en Lista B.",
      "Ajusta las opciones de comparación si lo necesitas.",
      "Revisa Diferencias, Solo A, Solo B, Coincidencias o Todo y copia o descarga el resultado que necesites.",
    ],
    resultsHeading: "Qué significan los resultados de la comparación",
    resultsIntro:
      "Las vistas muestran la misma comparación desde distintos ángulos. Los resultados mantienen el orden de las listas originales y nunca se ordenan automáticamente.",
    resultsItems: [
      {
        term: "Diferencias",
        description: "elementos que aparecen solo en una de las dos listas.",
      },
      {
        term: "Solo A",
        description:
          "elementos o apariciones de la Lista A que no tienen pareja en la Lista B.",
      },
      {
        term: "Solo B",
        description:
          "elementos o apariciones de la Lista B que no tienen pareja en la Lista A.",
      },
      {
        term: "Coincidencias",
        description:
          "elementos presentes en ambas listas, mostrados en el orden de la Lista A.",
      },
      {
        term: "Todo",
        description:
          "la Lista A seguida de los valores de la Lista B que aún no están representados.",
      },
    ],
    commonUsesHeading: "Usos habituales al comparar listas",
    commonUsesIntro: "La comparación puede servir para:",
    commonUsesItems: [
      "direcciones de correo electrónico",
      "identificadores de clientes o pedidos",
      "URL",
      "listas de productos o SKU",
      "palabras clave y nombres",
      "columnas copiadas desde Excel o Google Sheets",
    ],
    dataHeading: "Cómo se procesan tus datos",
    dataParagraph:
      "La comparación se ejecuta por completo en tu navegador. Las listas originales y los resultados no se envían a un servidor para procesarlos.",
    dataItems: [
      "Las opciones cambian las reglas de coincidencia sin modificar el texto original que se muestra en los resultados.",
      "Copiar accede al portapapeles únicamente después de pulsar el botón.",
      "Descargar crea un archivo de texto local en tu dispositivo.",
      "El sitio no guarda tus listas en cookies, localStorage ni sessionStorage.",
      "Las entradas y resultados sin procesar no se incluyen en eventos de analytics ni en registros de la aplicación.",
    ],
    dataLinkLabel: "Consulta la página de Privacidad para ver todos los detalles.",
    faqHeading: "Preguntas frecuentes",
    faqItems: [
      {
        question: "¿Puedo comparar dos listas con duplicados?",
        answer:
          "Sí. Eliminar duplicados está activado de forma predeterminada. Desactívalo si quieres comparar cada aparición repetida por separado.",
      },
      {
        question: "¿La comparación distingue mayúsculas y minúsculas?",
        answer:
          "Sí, de forma predeterminada. Ignorar mayúsculas y minúsculas permite hacer coincidir variantes sin modificar el texto original.",
      },
      {
        question: "¿Qué hace Ignorar espacios alrededor?",
        answer:
          "Ignora espacios y tabulaciones al principio y al final de una línea al buscar coincidencias, pero conserva el texto original en los resultados.",
      },
      {
        question: "¿Puedo comparar columnas de Excel o Google Sheets?",
        answer:
          "Sí. Copia una columna en cada lista; cada línea se trata como un elemento.",
      },
      {
        question: "¿Se suben mis listas a un servidor?",
        answer:
          "No. La comparación se ejecuta localmente en tu navegador. El contenido no se envía para procesarlo ni se guarda en el sitio.",
      },
    ],
  },
  about: {
    heading: "Acerca de ListContrast",
    paragraphs: [
      "ListContrast es una pequeña colección de herramientas web para trabajar con listas por líneas.",
      "Puedes comparar dos listas, ordenarlas alfabéticamente, mezclarlas o eliminar líneas duplicadas.",
      "Las herramientas no requieren cuenta y procesan el contenido localmente en tu navegador. Tus listas no se envían para procesarlas ni se guardan en el sitio.",
    ],
    toolLinkLabel: "Ver herramientas de listas",
  },
  privacy: {
    heading: "Privacidad",
    intro:
      "Esta página explica cómo ListContrast trata los datos en sus herramientas de listas. Refleja la versión actual del sitio y se actualizará antes de activar cualquier servicio que afecte a la privacidad.",
    sections: [
      {
        heading: "Contenido de las listas",
        paragraphs: [
          "El texto original de las listas y los resultados se procesan completamente en tu navegador. El contenido no forma parte de solicitudes de red para procesar las herramientas y no se almacena en una base de datos, cookies, localStorage ni sessionStorage.",
          "Copiar coloca el resultado actual en el portapapeles del sistema solo después de pulsar el botón. Descargar crea un archivo de texto local en tu dispositivo solo después de pulsar el botón.",
        ],
      },
      {
        heading: "Solicitudes del sitio web",
        paragraphs: [
          "Como cualquier sitio web, ListContrast se sirve desde un alojamiento estático. Al abrir una página, el proveedor puede recibir metadatos habituales como tu dirección IP, agente de usuario y ruta solicitada. El contenido que pegas en las herramientas no forma parte de estas solicitudes.",
        ],
      },
      {
        heading: "Publicidad y analytics",
        paragraphs: [
          "La versión actual no utiliza scripts publicitarios, reproducción de sesiones ni un proveedor de analytics de producto en producción. El contenido original y los resultados nunca se incluyen en eventos de analytics ni registros de la aplicación.",
        ],
      },
      {
        heading: "Cambios en esta página",
        paragraphs: [
          "Si se añaden servicios que afecten a la privacidad, esta página se actualizará antes de activarlos.",
        ],
      },
    ],
    toolLinkLabel: "Ver herramientas de listas",
  },
  footer: {
    ariaLabel: "Pie de página",
    compareLists: "Comparar listas",
    alphabetizer: "Ordenar alfabéticamente",
    randomizer: "Mezclar lista",
    duplicateLines: "Eliminar duplicados",
    about: "Acerca de",
    privacy: "Privacidad",
  },
  metadata: {
    home: {
      title: "Comparar listas online – Diferencias y coincidencias | ListContrast",
      description:
        "Compara dos listas online para encontrar diferencias, coincidencias y elementos únicos. Gratis y procesado localmente en tu navegador.",
    },
    alphabetizeList: {
      title: "Ordenar lista alfabéticamente online | ListContrast",
      description:
        "Ordena una lista alfabéticamente de A a Z o de Z a A. Nombres, palabras y listas se procesan localmente en tu navegador.",
    },
    randomizeList: {
      title: "Mezclar una lista online – Orden aleatorio | ListContrast",
      description:
        "Mezcla una lista online para obtener un orden aleatorio. Pega un elemento por línea, mezcla y copia o descarga el resultado.",
    },
    removeDuplicateLines: {
      title: "Eliminar líneas duplicadas online | ListContrast",
      description:
        "Elimina líneas duplicadas conservando la primera aparición y el orden original. Procesa el texto localmente en tu navegador.",
    },
    tools: {
      title: "Herramientas de listas | ListContrast",
      description:
        "Herramientas web para comparar, ordenar, mezclar y limpiar listas por líneas directamente en tu navegador.",
    },
    about: {
      title: "Acerca de ListContrast",
      description:
        "Conoce ListContrast y sus herramientas web para comparar, ordenar, mezclar y limpiar listas.",
    },
    privacy: {
      title: "Privacidad | ListContrast",
      description:
        "Descubre cómo ListContrast procesa listas localmente en tu navegador y trata las solicitudes normales del sitio web.",
    },
    notFound: {
      title: "Página no encontrada | ListContrast",
      description:
        "No se encontró la página de ListContrast solicitada. Consulta las herramientas de listas disponibles.",
    },
  },
  notFoundPage: {
    heading: "Página no encontrada",
    explanation: "La página que buscas no existe o se ha movido.",
    toolLinkLabel: "Ver herramientas de listas",
  },
  toolsPage: {
    heading: "Herramientas de listas",
    intro:
      "Herramientas web específicas para comparar, ordenar, mezclar y limpiar listas por líneas.",
    ariaLabel: "Herramientas de listas disponibles",
    items: {
      home: {
        label: "Comparar listas",
        description:
          "Encontrar diferencias, coincidencias y valores únicos entre dos listas.",
      },
      alphabetizeList: {
        label: "Ordenar alfabéticamente",
        description: "Ordenar una lista de A a Z o de Z a A.",
      },
      randomizeList: {
        label: "Mezclar una lista",
        description: "Reordenar una lista de forma aleatoria.",
      },
      removeDuplicateLines: {
        label: "Eliminar líneas duplicadas",
        description:
          "Quitar líneas repetidas conservando la primera aparición.",
      },
    },
  },
  relatedTools: {
    heading: "Herramientas relacionadas",
    byPage: {
      home: [
        related("alphabetizeList", "Ordenar alfabéticamente", "Ordenar una lista de A a Z o de Z a A."),
        related("randomizeList", "Mezclar una lista", "Reordenar una lista aleatoriamente."),
        related("removeDuplicateLines", "Eliminar duplicados", "Quitar líneas repetidas."),
      ],
      alphabetizeList: [
        related("home", "Comparar listas", "Encontrar diferencias y coincidencias entre dos listas."),
        related("randomizeList", "Mezclar una lista", "Reordenar una lista aleatoriamente."),
        related("removeDuplicateLines", "Eliminar duplicados", "Quitar líneas repetidas."),
      ],
      randomizeList: [
        related("home", "Comparar listas", "Encontrar diferencias y coincidencias entre dos listas."),
        related("alphabetizeList", "Ordenar alfabéticamente", "Ordenar una lista de A a Z o de Z a A."),
        related("removeDuplicateLines", "Eliminar duplicados", "Quitar líneas repetidas."),
      ],
      removeDuplicateLines: [
        related("home", "Comparar listas", "Encontrar diferencias y coincidencias entre dos listas."),
        related("alphabetizeList", "Ordenar alfabéticamente", "Ordenar una lista de A a Z o de Z a A."),
        related("randomizeList", "Mezclar una lista", "Reordenar una lista aleatoriamente."),
      ],
    },
  },
} satisfies LocaleContent;
