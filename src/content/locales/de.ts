import type { LocaleContent, ToolPageKey } from "../../i18n/types";

const related = (pageKey: ToolPageKey, label: string, description: string) =>
  ({ pageKey, label, description }) as const;

export const germanContent = {
  siteName: "ListContrast",
  home: {
    heading: "Listen vergleichen",
    description:
      "Vergleiche zwei Listen und finde Unterschiede, Übereinstimmungen und eindeutige Einträge sofort.",
    privacy: "Die Verarbeitung erfolgt lokal in deinem Browser.",
  },
  compare: {
    heading: "Listen vergleichen",
    listA: "Liste A",
    listB: "Liste B",
    pastePlaceholder: "Einen Eintrag pro Zeile einfügen",
    clear: "Leeren",
    swap: "Tauschen",
    loadExample: "Beispiel testen",
    replaceExampleConfirmation:
      "Beispiel laden und beide aktuellen Listen ersetzen? Deine aktuellen Eingaben gehen verloren.",
    comparisonOptions: "Optionen",
    trimWhitespace: "Leerraum am Rand ignorieren",
    ignoreEmptyLines: "Leere Zeilen ignorieren",
    ignoreCase: "Groß-/Kleinschreibung ignorieren",
    removeDuplicates: "Duplikate entfernen",
    results: "Ergebnisse",
    emptyResults:
      "Füge oben zwei Listen ein, um Unterschiede und Übereinstimmungen zu sehen.",
    noDifferences: "Keine Unterschiede gefunden.",
    sameValues:
      "Beide Listen enthalten mit den aktuellen Vergleichseinstellungen dieselben Werte.",
    noMatches: "Keine übereinstimmenden Werte.",
    onlyInA: "Nur in A",
    inBoth: "In beiden",
    onlyInB: "Nur in B",
    row: "Zeile",
    rows: "Zeilen",
    item: "Eintrag",
    items: "Einträge",
    differences: "Unterschiede",
    onlyA: "Nur A",
    onlyB: "Nur B",
    matches: "Übereinstimmungen",
    all: "Alle",
    noscript:
      "JavaScript ist erforderlich, um Listen zu vergleichen. Deine Listen werden lokal im Browser verarbeitet und nicht hochgeladen.",
    copy: "Kopieren",
    copied: "Kopiert",
    download: "Herunterladen",
    copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
  },
  alphabetizeList: {
    page: {
      heading: "Liste alphabetisch sortieren",
      description:
        "Sortiere Namen, Wörter oder andere zeilenbasierte Listen alphabetisch von A bis Z oder Z bis A.",
      privacy: "Die Verarbeitung erfolgt lokal in deinem Browser.",
    },
    tool: {
      heading: "Liste alphabetisch sortieren",
      listLabel: "Liste",
      pastePlaceholder: "Einen Eintrag pro Zeile einfügen",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example: "Apfel\nÄrger\nÖl\nÜber\nEintrag 10\nEintrag 2",
      replaceExampleConfirmation:
        "Beispiel laden und die aktuelle Liste ersetzen? Deine aktuelle Eingabe geht verloren.",
      options: "Optionen",
      trimWhitespace: "Leerraum am Rand entfernen",
      ignoreEmptyLines: "Leere Zeilen ignorieren",
      order: "Reihenfolge",
      ascending: "A → Z",
      descending: "Z → A",
      resultLabel: "Sortierte Liste",
      item: "Eintrag",
      items: "Einträge",
      emptyResult: "Füge eine Liste ein, um das sortierte Ergebnis zu sehen.",
      noEffectiveItems: "Mit den aktuellen Optionen bleiben keine Einträge übrig.",
      copy: "Kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      noscript:
        "JavaScript ist erforderlich, um eine Liste alphabetisch zu sortieren. Die Liste wird lokal in deinem Browser verarbeitet.",
    },
    editorial: {
      howToHeading: "So sortierst du eine Liste alphabetisch",
      howToSteps: [
        "Füge einen Eintrag pro Zeile in das Feld Liste ein.",
        "Lass A → Z ausgewählt oder wechsle zu Z → A.",
        "Passe bei Bedarf die Behandlung von Leerraum und leeren Zeilen an.",
        "Prüfe das Ergebnis und kopiere oder lade die sortierte Liste herunter.",
      ],
      resultsHeading: "So funktioniert die alphabetische Sortierung",
      resultsIntro:
        "Die Sortierung verwendet die deutsche Browser-Kollation, berücksichtigt Zahlen in Text natürlich und behält doppelte Einträge sowie ihre ursprüngliche Schreibweise bei.",
      resultsItems: [
        {
          term: "A → Z",
          description: "sortiert die verarbeiteten Einträge aufsteigend.",
        },
        {
          term: "Z → A",
          description: "sortiert dieselben Einträge absteigend.",
        },
        {
          term: "Zahlen im Text",
          description:
            "werden natürlich sortiert, sodass Eintrag 2 vor Eintrag 10 steht.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen",
      commonUsesIntro: "Alphabetisches Sortieren eignet sich zum Beispiel für:",
      commonUsesItems: [
        "Namens- und Teilnehmerlisten",
        "Wort- und Vokabellisten",
        "Keywords und Tags",
        "Produktnamen oder Bezeichnungen",
        "Spalten aus Excel oder Google Sheets",
      ],
      dataHeading: "So werden deine Daten verarbeitet",
      dataParagraph:
        "Die Sortierung läuft vollständig in deinem Browser. Eingefügte Listen und Ergebnisse werden nicht zur Verarbeitung hochgeladen.",
      dataItems: [
        "Leerraum am Rand wird nur entfernt, wenn die entsprechende Option aktiviert ist.",
        "Leere Zeilen werden nur bei aktivierter Option entfernt.",
        "Kopieren greift erst nach einem Klick auf die Zwischenablage zu.",
        "Herunterladen erstellt erst nach einem Klick eine lokale Textdatei.",
      ],
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Werden Duplikate beim Sortieren entfernt?",
          answer:
            "Nein. Wiederholte Zeilen bleiben erhalten und werden lediglich alphabetisch einsortiert.",
        },
        {
          question: "Wie werden Umlaute sortiert?",
          answer:
            "Die deutsche Browser-Kollation wird verwendet, sodass Zeichen wie ä, ö und ü nach deutschen Sortierregeln behandelt werden.",
        },
        {
          question: "Kann die Liste Zahlen im Text enthalten?",
          answer:
            "Ja. Die Sortierung ist zahlenbewusst, daher steht beispielsweise Eintrag 2 vor Eintrag 10.",
        },
        {
          question: "Kann ich eine Spalte aus Excel oder Google Sheets sortieren?",
          answer:
            "Ja. Kopiere eine Spalte und füge sie mit einem Wert pro Zeile ein.",
        },
        {
          question: "Wird meine Liste hochgeladen?",
          answer:
            "Nein. Die Sortierung läuft lokal in deinem Browser; die eingefügten Daten werden nicht zur Verarbeitung an einen Server gesendet.",
        },
      ],
    },
  },
  randomizeList: {
    page: {
      heading: "Liste zufällig mischen",
      description:
        "Bringe Namen, Wörter oder andere zeilenbasierte Listen per Zufall in eine neue Reihenfolge.",
      privacy: "Die Verarbeitung erfolgt lokal in deinem Browser.",
    },
    tool: {
      heading: "Liste zufällig mischen",
      listLabel: "Liste",
      pastePlaceholder: "Einen Eintrag pro Zeile einfügen",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example: "Apfel\nBirne\nKirsche\nPflaume\nTraube",
      replaceExampleConfirmation:
        "Beispiel laden und die aktuelle Liste ersetzen? Deine aktuelle Eingabe geht verloren.",
      options: "Optionen",
      trimWhitespace: "Leerraum am Rand entfernen",
      ignoreEmptyLines: "Leere Zeilen ignorieren",
      randomize: "Mischen",
      resultLabel: "Zufällige Reihenfolge",
      item: "Eintrag",
      items: "Einträge",
      emptyResult: "Füge eine Liste ein, um eine zufällige Reihenfolge zu erzeugen.",
      readyResult: "Wähle Mischen, um die aktuelle Liste neu anzuordnen.",
      noEffectiveItems: "Mit den aktuellen Optionen bleiben keine Einträge übrig.",
      copy: "Kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      noscript:
        "JavaScript ist erforderlich, um eine Liste zufällig zu mischen. Die Liste wird lokal in deinem Browser verarbeitet.",
    },
    editorial: {
      howToHeading: "So mischst du eine Liste zufällig",
      howToSteps: [
        "Füge einen Eintrag pro Zeile ein.",
        "Passe bei Bedarf Leerraum und leere Zeilen an.",
        "Wähle Mischen, um eine neue Zufallsreihenfolge zu erzeugen.",
        "Mische erneut oder kopiere beziehungsweise lade das gewünschte Ergebnis herunter.",
      ],
      resultsHeading: "So funktioniert die Zufallsreihenfolge",
      resultsIntro:
        "Das Tool verwendet einen Fisher–Yates-Shuffle direkt im Browser. Jeder verarbeitete Eintrag bleibt erhalten, auch wenn er mehrfach vorkommt.",
      resultsItems: [
        {
          term: "Mischen",
          description:
            "erzeugt bei jedem Klick eine neue zufällige Anordnung der aktuellen Liste.",
        },
        {
          term: "Doppelte Einträge",
          description: "bleiben als getrennte Vorkommen in der Ausgabe erhalten.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen für eine Zufallsreihenfolge",
      commonUsesIntro: "Eine gemischte Liste ist praktisch für:",
      commonUsesItems: [
        "Namen und Teilnehmer",
        "Fragen und Aufgaben",
        "Aktivitäten",
        "Wörter und Vokabeln",
        "Spalten aus Excel oder Google Sheets",
      ],
      dataHeading: "So werden deine Daten verarbeitet",
      dataParagraph:
        "Das Mischen läuft vollständig im Browser. Deine Liste und das gemischte Ergebnis werden nicht zur Verarbeitung hochgeladen.",
      dataItems: [
        "Leerraum am Rand wird nur bei aktivierter Option entfernt.",
        "Leere Zeilen werden nur bei aktivierter Option ignoriert.",
        "Kopieren greift erst nach einem Klick auf die Zwischenablage zu.",
        "Herunterladen erstellt erst nach einem Klick eine lokale Textdatei.",
      ],
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Werden doppelte Einträge entfernt?",
          answer:
            "Nein. Jede Zeile bleibt als eigenes Vorkommen in der gemischten Liste erhalten.",
        },
        {
          question: "Ist jede neue Reihenfolge garantiert anders?",
          answer:
            "Nein. Zufall kann besonders bei kurzen Listen auch dieselbe Reihenfolge erneut erzeugen.",
        },
        {
          question: "Mischt sich die Liste während der Eingabe automatisch?",
          answer:
            "Nein. Eine neue Reihenfolge entsteht erst, wenn du Mischen auswählst.",
        },
        {
          question: "Kann ich Namen aus einer Tabellenkalkulation mischen?",
          answer:
            "Ja. Füge eine Spalte mit einem Wert pro Zeile ein.",
        },
        {
          question: "Wird meine Liste hochgeladen?",
          answer:
            "Nein. Das Mischen findet lokal in deinem Browser statt; die Liste wird nicht zur Verarbeitung an einen Server gesendet.",
        },
      ],
    },
  },
  removeDuplicateLines: {
    page: {
      heading: "Duplikate aus Liste entfernen",
      description:
        "Entferne doppelte Zeilen und behalte jeweils das erste Vorkommen in der ursprünglichen Reihenfolge.",
      privacy: "Die Verarbeitung erfolgt lokal in deinem Browser.",
    },
    tool: {
      heading: "Duplikate aus Liste entfernen",
      listLabel: "Liste",
      pastePlaceholder: "Einen Eintrag pro Zeile einfügen",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example: "Apfel\nBanane\nApfel\nKirsche\nbanane",
      replaceExampleConfirmation:
        "Beispiel laden und den aktuellen Text ersetzen? Deine aktuelle Eingabe geht verloren.",
      options: "Optionen",
      trimWhitespace: "Leerraum am Rand entfernen",
      ignoreEmptyLines: "Leere Zeilen ignorieren",
      ignoreCase: "Groß-/Kleinschreibung ignorieren",
      resultLabel: "Eindeutige Zeilen",
      item: "Eintrag",
      items: "Einträge",
      emptyResult: "Füge Text oder eine Liste ein, um Duplikate zu entfernen.",
      noEffectiveItems: "Mit den aktuellen Optionen bleiben keine Zeilen übrig.",
      input: "Eingabe",
      unique: "Eindeutig",
      removed: "Entfernt",
      copy: "Kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      noscript:
        "JavaScript ist erforderlich, um doppelte Zeilen zu entfernen. Die Verarbeitung erfolgt lokal in deinem Browser.",
    },
    editorial: {
      howToHeading: "So entfernst du Duplikate aus einer Liste",
      howToSteps: [
        "Füge Text oder eine Liste mit einem Eintrag pro Zeile ein.",
        "Passe bei Bedarf Leerraum, leere Zeilen oder Groß-/Kleinschreibung an.",
        "Doppelte Zeilen werden automatisch entfernt; das erste Vorkommen bleibt erhalten.",
        "Prüfe die eindeutigen Zeilen und kopiere oder lade das Ergebnis herunter.",
      ],
      resultsHeading: "So funktioniert das Entfernen von Duplikaten",
      resultsIntro:
        "Die Zeilen werden von oben nach unten verarbeitet. Das erste Vorkommen eines Werts bleibt erhalten, spätere Duplikate werden entfernt und die ursprüngliche Reihenfolge bleibt bestehen.",
      resultsItems: [
        {
          term: "Eingabe",
          description:
            "zählt die verarbeiteten Zeilen vor dem Entfernen von Duplikaten.",
        },
        {
          term: "Eindeutig",
          description: "zählt die Zeilen, die im Ergebnis erhalten bleiben.",
        },
        {
          term: "Entfernt",
          description: "zeigt die Anzahl der entfernten Wiederholungen.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen",
      commonUsesIntro: "Duplikate lassen sich zum Beispiel entfernen aus:",
      commonUsesItems: [
        "Keywords und Suchbegriffen",
        "IDs und Referenzwerten",
        "URLs und Domains",
        "Namen und Bezeichnungen",
        "Spalten aus Excel oder Google Sheets",
      ],
      dataHeading: "So werden deine Daten verarbeitet",
      dataParagraph:
        "Das Entfernen von Duplikaten läuft vollständig im Browser. Eingefügte Zeilen und das Ergebnis werden nicht zur Verarbeitung hochgeladen.",
      dataItems: [
        "Leerraum am Rand wird vor dem Vergleich nur bei aktivierter Option entfernt.",
        "Leere Zeilen werden nur bei aktivierter Option ignoriert.",
        "Groß-/Kleinschreibung ignorieren ändert nur die Duplikat-Erkennung; die erste Originalzeile bleibt unverändert.",
        "Kopieren und Herunterladen exportieren das Ergebnis erst nach deiner Aktion.",
      ],
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Welches Duplikat bleibt erhalten?",
          answer:
            "Das erste Vorkommen bleibt erhalten. Spätere Zeilen mit demselben Vergleichswert werden entfernt.",
        },
        {
          question: "Kann die Groß-/Kleinschreibung ignoriert werden?",
          answer:
            "Ja. Dann gelten zum Beispiel Apfel und apfel als Duplikate, während die Schreibweise der zuerst behaltenen Zeile erhalten bleibt.",
        },
        {
          question: "Bleibt die Reihenfolge erhalten?",
          answer:
            "Ja. Das Tool sortiert nicht, sondern behält die Reihenfolge der jeweils ersten Vorkommen bei.",
        },
        {
          question: "Kann ich Duplikate aus einer Tabellen-Spalte entfernen?",
          answer:
            "Ja. Füge eine Spalte mit einem Wert pro Zeile ein.",
        },
        {
          question: "Wird mein Text hochgeladen?",
          answer:
            "Nein. Die Bereinigung läuft lokal in deinem Browser; deine Zeilen werden nicht zur Verarbeitung an einen Server gesendet.",
        },
      ],
    },
  },
  header: {
    ariaLabel: "Hauptnavigation",
    tools: "Tools",
    about: "Über",
    language: "Sprache",
  },
  editorial: {
    howToHeading: "So vergleichst du zwei Listen",
    howToSteps: [
      "Füge die erste Liste in Liste A ein.",
      "Füge die zweite Liste in Liste B ein.",
      "Passe bei Bedarf die Vergleichsoptionen an.",
      "Prüfe Unterschiede, Nur A, Nur B, Übereinstimmungen oder Alle und kopiere oder lade das gewünschte Ergebnis herunter.",
    ],
    resultsHeading: "Was die Vergleichsergebnisse bedeuten",
    resultsIntro:
      "Die Ansichten zeigen denselben Vergleich aus verschiedenen Perspektiven. Die Reihenfolge der ursprünglichen Listen bleibt erhalten; Ergebnisse werden nicht automatisch sortiert.",
    resultsItems: [
      {
        term: "Unterschiede",
        description: "Einträge, die nur in einer der beiden Listen vorkommen.",
      },
      {
        term: "Nur A",
        description: "Einträge oder Vorkommen aus Liste A ohne Paar in Liste B.",
      },
      {
        term: "Nur B",
        description: "Einträge oder Vorkommen aus Liste B ohne Paar in Liste A.",
      },
      {
        term: "Übereinstimmungen",
        description: "Einträge in beiden Listen, in der Reihenfolge von Liste A.",
      },
      {
        term: "Alle",
        description:
          "Liste A, gefolgt von Werten aus Liste B, die noch nicht vertreten sind.",
      },
    ],
    commonUsesHeading: "Typische Anwendungen für den Listenvergleich",
    commonUsesIntro: "Zwei Listen lassen sich zum Beispiel vergleichen für:",
    commonUsesItems: [
      "E-Mail-Adressen",
      "Kunden- oder Bestell-IDs",
      "URLs",
      "Produkt- oder SKU-Listen",
      "Keywords und Namen",
      "Spalten aus Excel oder Google Sheets",
    ],
    dataHeading: "So werden deine Daten verarbeitet",
    dataParagraph:
      "Der Vergleich läuft vollständig in deinem Browser. Rohdaten und Ergebnisinhalte werden nicht zur Verarbeitung an einen Server hochgeladen.",
    dataItems: [
      "Vergleichsoptionen ändern die Zuordnungsregeln, ohne den ursprünglichen Zeilentext in den Ergebnissen umzuschreiben.",
      "Kopieren greift erst nach einem Klick auf die Zwischenablage zu.",
      "Herunterladen erstellt eine lokale Textdatei auf deinem Gerät.",
      "Die Website speichert deine Listen nicht in Cookies, localStorage oder sessionStorage.",
      "Rohe Eingaben und Ergebnisse werden nicht in Analytics oder Anwendungslogs aufgenommen.",
    ],
    dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
    faqHeading: "Häufig gestellte Fragen",
    faqItems: [
      {
        question: "Kann ich Listen mit Duplikaten vergleichen?",
        answer:
          "Ja. Duplikate entfernen ist standardmäßig aktiviert. Schalte die Option aus, wenn wiederholte Vorkommen einzeln verglichen werden sollen.",
      },
      {
        question: "Ist der Vergleich abhängig von Groß- und Kleinschreibung?",
        answer:
          "Standardmäßig ja. Mit Groß-/Kleinschreibung ignorieren können unterschiedliche Schreibweisen übereinstimmen, während der Originaltext erhalten bleibt.",
      },
      {
        question: "Was bedeutet Leerraum am Rand ignorieren?",
        answer:
          "Leerzeichen und Tabs am Anfang und Ende einer Zeile werden beim Abgleich ignoriert; der ursprüngliche Zeilentext bleibt in der Ausgabe erhalten.",
      },
      {
        question: "Kann ich Spalten aus Excel oder Google Sheets vergleichen?",
        answer:
          "Ja. Kopiere jeweils eine Spalte nach Liste A und Liste B. Jede Zeile wird als ein Eintrag behandelt.",
      },
      {
        question: "Werden meine Listen auf einen Server hochgeladen?",
        answer:
          "Nein. Der Vergleich läuft lokal im Browser. Listeninhalte werden nicht für die Verarbeitung übertragen oder von der Website gespeichert.",
      },
    ],
  },
  about: {
    heading: "Über ListContrast",
    paragraphs: [
      "ListContrast ist eine kleine Sammlung browserbasierter Tools für zeilenbasierte Listen.",
      "Du kannst zwei Listen vergleichen, eine Liste alphabetisch sortieren, zufällig mischen oder doppelte Zeilen entfernen.",
      "Die Tools benötigen kein Konto und verarbeiten Listeninhalte lokal in deinem Browser. Deine Listen werden nicht zur Verarbeitung hochgeladen oder von der Website gespeichert.",
    ],
    toolLinkLabel: "Listentools ansehen",
  },
  privacy: {
    heading: "Datenschutz",
    intro:
      "Diese Seite beschreibt, wie ListContrast Daten in seinen browserbasierten Listentools verarbeitet. Sie entspricht der aktuellen Website und wird aktualisiert, bevor ein datenschutzrelevanter Dienst aktiviert wird.",
    sections: [
      {
        heading: "Listeninhalte",
        paragraphs: [
          "Rohe Listentexte und daraus erzeugte Ergebnisse werden vollständig in deinem Browser verarbeitet. Listeninhalte gelangen nicht in Netzwerk-Anfragen zur Tool-Verarbeitung und werden nicht in einer Datenbank, Cookies, localStorage oder sessionStorage gespeichert.",
          "Kopieren schreibt das aktuelle Ergebnis erst nach deinem Klick in die System-Zwischenablage. Herunterladen erstellt erst nach deinem Klick eine lokale Textdatei auf deinem Gerät.",
        ],
      },
      {
        heading: "Website-Anfragen",
        paragraphs: [
          "ListContrast wird wie jede Website von einem statischen Host ausgeliefert. Beim Öffnen einer Seite kann der Host übliche Anfrage-Metadaten wie IP-Adresse, User-Agent und angeforderten Pfad erhalten. Deine eingefügten Listen sind nicht Teil dieser Anfragen.",
        ],
      },
      {
        heading: "Werbung und Analytics",
        paragraphs: [
          "Die aktuelle Version verwendet keine Werbeskripte, keine Session-Replays und keinen produktiven Produkt-Analytics-Anbieter. Rohe Listeneingaben und Ergebnisse werden niemals in Analytics-Ereignisse oder Anwendungslogs aufgenommen.",
        ],
      },
      {
        heading: "Änderungen dieser Seite",
        paragraphs: [
          "Wenn später datenschutzrelevante Dienste hinzukommen, wird diese Seite vor ihrer Aktivierung aktualisiert.",
        ],
      },
    ],
    toolLinkLabel: "Listentools ansehen",
  },
  footer: {
    ariaLabel: "Fußzeile",
    compareLists: "Listen vergleichen",
    alphabetizer: "Alphabetisch sortieren",
    randomizer: "Liste mischen",
    duplicateLines: "Duplikate entfernen",
    about: "Über",
    privacy: "Datenschutz",
  },
  metadata: {
    home: {
      title: "Listen vergleichen online – Unterschiede finden | ListContrast",
      description:
        "Vergleiche zwei Listen online und finde Unterschiede, Übereinstimmungen und eindeutige Einträge. Kostenlos und lokal im Browser verarbeitet.",
    },
    alphabetizeList: {
      title: "Liste alphabetisch sortieren online | ListContrast",
      description:
        "Sortiere eine Liste online alphabetisch von A bis Z oder Z bis A. Namen, Wörter und andere Zeilen werden lokal im Browser verarbeitet.",
    },
    randomizeList: {
      title: "Liste zufällig mischen online | ListContrast",
      description:
        "Mische eine Liste online in eine zufällige Reihenfolge. Einen Eintrag pro Zeile einfügen, mischen und Ergebnis kopieren oder herunterladen.",
    },
    removeDuplicateLines: {
      title: "Duplikate aus Liste entfernen online | ListContrast",
      description:
        "Entferne doppelte Zeilen aus einer Liste und behalte das erste Vorkommen in ursprünglicher Reihenfolge. Lokal im Browser verarbeitet.",
    },
    tools: {
      title: "Listentools | ListContrast",
      description:
        "Tools zum Vergleichen, alphabetischen Sortieren, zufälligen Mischen und Bereinigen zeilenbasierter Listen direkt im Browser.",
    },
    about: {
      title: "Über ListContrast",
      description:
        "Mehr über ListContrast und die browserbasierten Tools zum Vergleichen, Sortieren, Mischen und Bereinigen von Listen.",
    },
    privacy: {
      title: "Datenschutz | ListContrast",
      description:
        "Erfahre, wie ListContrast Listeninhalte lokal im Browser verarbeitet und mit gewöhnlichen Website-Anfragen umgeht.",
    },
    notFound: {
      title: "Seite nicht gefunden | ListContrast",
      description:
        "Die angeforderte ListContrast-Seite wurde nicht gefunden. Öffne die verfügbaren Listentools.",
    },
  },
  notFoundPage: {
    heading: "Seite nicht gefunden",
    explanation: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    toolLinkLabel: "Listentools ansehen",
  },
  toolsPage: {
    heading: "Listentools",
    intro:
      "Browserbasierte Tools zum Vergleichen, Sortieren, Mischen und Bereinigen zeilenbasierter Listen.",
    ariaLabel: "Verfügbare Listentools",
    items: {
      home: {
        label: "Listen vergleichen",
        description:
          "Unterschiede, Übereinstimmungen und eindeutige Werte zwischen zwei Listen finden.",
      },
      alphabetizeList: {
        label: "Liste alphabetisch sortieren",
        description: "Eine Liste von A bis Z oder Z bis A sortieren.",
      },
      randomizeList: {
        label: "Liste zufällig mischen",
        description: "Eine Liste auf Wunsch in eine zufällige Reihenfolge bringen.",
      },
      removeDuplicateLines: {
        label: "Duplikate entfernen",
        description:
          "Doppelte Zeilen entfernen und das erste Vorkommen behalten.",
      },
    },
  },
  relatedTools: {
    heading: "Ähnliche Tools",
    byPage: {
      home: [
        related("alphabetizeList", "Alphabetisch sortieren", "Eine Liste alphabetisch sortieren."),
        related("randomizeList", "Liste mischen", "Eine Liste zufällig neu anordnen."),
        related("removeDuplicateLines", "Duplikate entfernen", "Doppelte Zeilen entfernen."),
      ],
      alphabetizeList: [
        related("home", "Listen vergleichen", "Unterschiede und Übereinstimmungen zwischen zwei Listen finden."),
        related("randomizeList", "Liste mischen", "Eine Liste zufällig neu anordnen."),
        related("removeDuplicateLines", "Duplikate entfernen", "Doppelte Zeilen entfernen."),
      ],
      randomizeList: [
        related("home", "Listen vergleichen", "Unterschiede und Übereinstimmungen zwischen zwei Listen finden."),
        related("alphabetizeList", "Alphabetisch sortieren", "Eine Liste alphabetisch sortieren."),
        related("removeDuplicateLines", "Duplikate entfernen", "Doppelte Zeilen entfernen."),
      ],
      removeDuplicateLines: [
        related("home", "Listen vergleichen", "Unterschiede und Übereinstimmungen zwischen zwei Listen finden."),
        related("alphabetizeList", "Alphabetisch sortieren", "Eine Liste alphabetisch sortieren."),
        related("randomizeList", "Liste mischen", "Eine Liste zufällig neu anordnen."),
      ],
    },
  },
} satisfies LocaleContent;
