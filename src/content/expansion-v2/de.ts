import type { ExpansionLocaleContent } from "./types";

const privacy = "Die Verarbeitung erfolgt lokal in deinem Browser.";
const dataItems = [
  "Eingefügte Inhalte werden nicht zur Verarbeitung hochgeladen.",
  "Die Zwischenablage wird erst nach einem Klick auf Kopieren verwendet.",
  "Beim Herunterladen wird erst nach einem Klick eine lokale Textdatei erstellt.",
] as const;

export const germanExpansionContent = {
  homePatch: {
    description:
      "Vergleiche zwei Listen und finde Unterschiede, Übereinstimmungen, eindeutige Einträge sowie Schnittmenge und Vereinigung direkt im Browser.",
    metadata: {
      title: "Listen online vergleichen – Unterschiede & Übereinstimmungen | ListContrast",
      description:
        "Vergleiche zwei Listen online und finde Unterschiede, Übereinstimmungen, eindeutige Einträge, Schnittmenge und Vereinigung. Kostenlos und lokal im Browser.",
    },
    editorial: {
      resultsHeading: "Ergebnisse des Listenvergleichs erklärt",
      resultsIntro:
        "Die Ansichten zeigen denselben Listenvergleich aus verschiedenen Perspektiven und behalten die ursprüngliche Reihenfolge bei. Wenn Duplikate entfernt werden, entsprechen die Ergebnisse bekannten Mengenoperationen; bleiben Duplikate erhalten, werden wiederholte Vorkommen einzeln abgeglichen.",
      resultsItems: [
        {
          term: "Unterschiede",
          description:
            "Einträge, die nur in einer der beiden Listen übrig bleiben; ohne Duplikate entspricht das der symmetrischen Differenz.",
        },
        {
          term: "Nur A",
          description:
            "Einträge oder Vorkommen aus Liste A ohne Gegenstück in Liste B; ohne Duplikate entspricht das A − B.",
        },
        {
          term: "Nur B",
          description:
            "Einträge oder Vorkommen aus Liste B ohne Gegenstück in Liste A; ohne Duplikate entspricht das B − A.",
        },
        {
          term: "Übereinstimmungen",
          description:
            "Einträge in beiden Listen; ohne Duplikate entspricht das der Schnittmenge.",
        },
        {
          term: "Alle",
          description:
            "Liste A gefolgt von noch nicht vertretenen Werten aus Liste B; ohne Duplikate entspricht das der Vereinigung.",
        },
      ],
      commonUsesItems: [
        "E-Mail-Adressen, Namen und Teilnehmerlisten",
        "IDs, SKUs und Produktlisten",
        "URLs, Keywords und Tags",
        "Spalten aus Excel oder Google Sheets",
        "Exporte aus zwei Systemen, um fehlende Datensätze zu finden",
        "alte und neue Bestands-, URL- oder Keyword-Exporte zur Abstimmung",
      ],
    },
  },
  randomTeamGenerator: {
    page: {
      heading: "Zufälliger Teamgenerator",
      description:
        "Füge Namen ein und teile sie nach Teamanzahl oder Personen pro Team in möglichst gleich große zufällige Gruppen ein.",
      privacy,
    },
    tool: {
      heading: "Teams zufällig einteilen",
      listLabel: "Teilnehmer oder Einträge",
      pastePlaceholder: "Ein Teilnehmer oder Eintrag pro Zeile",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example: "Anna\nBen\nClara\nDavid\nEmma\nFelix\nGreta\nHannes",
      replaceExampleConfirmation:
        "Beispiel laden und die aktuelle Liste ersetzen? Deine aktuelle Eingabe geht verloren.",
      participant: "Teilnehmer",
      participants: "Teilnehmer",
      modeLabel: "Gruppeneinteilung",
      numberOfTeams: "Anzahl der Teams",
      peoplePerTeam: "Personen pro Team",
      valueLabel: "Wert",
      generate: "Teams erstellen",
      reroll: "Neu auslosen",
      resultLabel: "Zufällige Teams",
      team: "Team",
      copy: "Alle kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      emptyResult: "Füge mindestens zwei Einträge ein, um Teams zu erstellen.",
      invalidValue: "Gib eine positive ganze Zahl ein.",
      tooManyTeams:
        "Die Anzahl der Teams darf nicht größer als die Anzahl der Einträge sein.",
      noscript:
        "JavaScript ist erforderlich, um Teams zu erstellen. Die Liste wird lokal in deinem Browser verarbeitet.",
    },
    editorial: {
      howToHeading: "So erstellst du zufällige Teams",
      howToSteps: [
        "Füge einen Namen oder Eintrag pro Zeile ein.",
        "Wähle Anzahl der Teams oder Personen pro Team.",
        "Gib eine positive ganze Zahl ein und wähle Teams erstellen.",
        "Kopiere die Gruppen oder lose sie für eine neue Einteilung erneut aus.",
      ],
      resultsHeading: "So entstehen ausgeglichene Zufallsgruppen",
      resultsIntro:
        "Die Liste wird im Browser gemischt und danach so gleichmäßig wie möglich verteilt. Jedes gültige Vorkommen wird genau einmal zugeordnet.",
      resultsItems: [
        {
          term: "Anzahl der Teams",
          description:
            "erstellt genau so viele Gruppen; ihre Größen unterscheiden sich höchstens um eine Person.",
        },
        {
          term: "Personen pro Team",
          description:
            "verwendet den Wert als Ziel-Maximum, bestimmt die nötige Gruppenzahl und verteilt anschließend möglichst gleichmäßig.",
        },
        {
          term: "Gleiche Namen",
          description:
            "bleiben getrennte Vorkommen, weil verschiedene Personen denselben Namen haben können.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen",
      commonUsesIntro: "Zufällige Teams eignen sich zum Beispiel für:",
      commonUsesItems: [
        "Unterricht und Lerngruppen",
        "Workshops und Breakout-Gruppen",
        "Spiele und Freizeitsport",
        "Teamübungen im Büro oder bei Veranstaltungen",
      ],
      dataHeading: "Private Teameinteilung im Browser",
      dataParagraph:
        "Mischen und Gruppeneinteilung laufen vollständig in deinem Browser.",
      dataItems,
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Sind die Teams gleich groß?",
          answer:
            "Sie werden so gleichmäßig wie möglich verteilt. Wenn die Anzahl nicht aufgeht, unterscheiden sich die Teamgrößen höchstens um eins.",
        },
        {
          question: "Kann ich die Gruppengröße statt der Teamanzahl wählen?",
          answer:
            "Ja. Mit Personen pro Team berechnet das Tool genügend Gruppen, damit die Zielgröße nicht überschritten wird.",
        },
        {
          question: "Dürfen zwei Personen gleich heißen?",
          answer: "Ja. Wiederholte Zeilen bleiben als getrennte Vorkommen erhalten.",
        },
        {
          question: "Werden Namen hochgeladen?",
          answer: "Nein. Die Teameinteilung läuft lokal in deinem Browser.",
        },
      ],
    },
  },
  randomPairGenerator: {
    page: {
      heading: "Zufällige Paare bilden",
      description:
        "Füge Namen oder Einträge ein und bilde sofort zufällige Paare; bei einer ungeraden Anzahl wird ein Eintrag klar als ohne Partner angezeigt.",
      privacy,
    },
    tool: {
      heading: "Paare zufällig auslosen",
      listLabel: "Teilnehmer oder Einträge",
      pastePlaceholder: "Ein Teilnehmer oder Eintrag pro Zeile",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example: "Anna\nBen\nClara\nDavid\nEmma\nFelix\nGreta",
      replaceExampleConfirmation:
        "Beispiel laden und die aktuelle Liste ersetzen? Deine aktuelle Eingabe geht verloren.",
      item: "Eintrag",
      items: "Einträge",
      generate: "Paare bilden",
      reroll: "Neu auslosen",
      resultLabel: "Zufällige Paare",
      pair: "Paar",
      unpaired: "Ohne Partner",
      copy: "Alle kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      emptyResult: "Füge mindestens einen Eintrag ein, um Paare zu bilden.",
      noscript:
        "JavaScript ist erforderlich, um Paare zu bilden. Die Liste wird lokal in deinem Browser verarbeitet.",
    },
    editorial: {
      howToHeading: "So bildest du zufällige Paare",
      howToSteps: [
        "Füge einen Namen oder Eintrag pro Zeile ein.",
        "Wähle Paare bilden.",
        "Prüfe die Paare und gegebenenfalls den Eintrag Ohne Partner.",
        "Kopiere das Ergebnis oder lose erneut aus.",
      ],
      resultsHeading: "So funktioniert die zufällige Paarbildung",
      resultsIntro:
        "Das Tool mischt jedes gültige Vorkommen und nimmt die gemischte Liste anschließend jeweils zu zweit.",
      resultsItems: [
        {
          term: "Gerade Anzahl",
          description: "jeder Eintrag landet in einem Paar.",
        },
        {
          term: "Ungerade Anzahl",
          description:
            "es werden möglichst viele Paare gebildet und ein Eintrag wird als Ohne Partner angezeigt.",
        },
        {
          term: "Gleiche Namen",
          description: "bleiben getrennte Vorkommen und werden nicht entfernt.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen",
      commonUsesIntro: "Zufällige Paare sind praktisch für:",
      commonUsesItems: [
        "Lernpartner",
        "Workshop-Übungen",
        "Interview- oder Feedback-Paare",
        "Spiele und Trainingsaufgaben",
      ],
      dataHeading: "Private Paarbildung im Browser",
      dataParagraph: "Die Paarbildung läuft vollständig in deinem Browser.",
      dataItems,
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Was passiert bei einer ungeraden Anzahl?",
          answer:
            "Das Tool bildet möglichst viele Paare und kennzeichnet den übrigen Eintrag als Ohne Partner.",
        },
        {
          question: "Verhindert erneutes Auslosen frühere Paare?",
          answer:
            "Nein. Jede Auslosung ist unabhängig; frühere Paarungen werden nicht gespeichert.",
        },
        {
          question: "Werden doppelte Namen entfernt?",
          answer: "Nein. Jedes gültige Vorkommen bleibt erhalten.",
        },
        {
          question: "Werden meine Namen hochgeladen?",
          answer: "Nein. Die Paarbildung läuft lokal in deinem Browser.",
        },
      ],
    },
  },
  removeLineBreaks: {
    page: {
      heading: "Zeilenumbrüche entfernen",
      description:
        "Entferne unerwünschte Zeilenumbrüche, behalte Absatzumbrüche bei oder ersetze neue Zeilen durch ein eigenes Trennzeichen.",
      privacy,
    },
    tool: {
      heading: "Zeilenumbrüche entfernen oder ersetzen",
      textLabel: "Text",
      pastePlaceholder: "Text mit unerwünschten Zeilenumbrüchen einfügen",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example:
        "Dieser Absatz wurde\nmit harten Umbrüchen kopiert,\ndie zu Leerzeichen werden sollen.\n\nDieser zweite Absatz\nsoll getrennt bleiben.",
      replaceExampleConfirmation:
        "Beispiel laden und den aktuellen Text ersetzen? Deine aktuelle Eingabe geht verloren.",
      options: "Optionen",
      replaceWith: "Zeilenumbrüche ersetzen durch",
      separatorSpace: "Leerzeichen",
      separatorNothing: "Nichts",
      separatorComma: "Komma",
      separatorCommaSpace: "Komma + Leerzeichen",
      separatorSemicolon: "Semikolon",
      separatorCustom: "Benutzerdefiniert",
      customSeparator: "Eigenes Trennzeichen",
      keepParagraphs: "Absatzumbrüche beibehalten",
      trimEachLine: "Jede Zeile trimmen",
      collapseSpaces: "Mehrfache Leerzeichen zusammenfassen",
      resultLabel: "Bereinigter Text",
      emptyResult: "Füge Text ein, um das bereinigte Ergebnis zu sehen.",
      copy: "Kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      noscript:
        "JavaScript ist erforderlich, um Zeilenumbrüche zu entfernen. Der Text wird lokal in deinem Browser verarbeitet.",
    },
    editorial: {
      howToHeading: "So entfernst du Zeilenumbrüche",
      howToSteps: [
        "Füge Text mit unerwünschten harten Zeilenumbrüchen ein.",
        "Wähle, wodurch jeder Zeilenumbruch ersetzt werden soll.",
        "Aktiviere Absatzumbrüche beibehalten, wenn Leerzeilen Absätze trennen sollen.",
        "Kopiere oder lade den bereinigten Text herunter.",
      ],
      resultsHeading: "Zeilenumbrüche, neue Zeilen und Absätze",
      resultsIntro:
        "Das Tool vereinheitlicht zuerst Windows-, Unix- und ältere CR-Zeilenenden und wendet danach das gewählte Trennzeichen an.",
      resultsItems: [
        {
          term: "Leerzeichen",
          description:
            "ist der sichere Standard für umgebrochenen Fließtext, damit benachbarte Wörter nicht zusammenkleben.",
        },
        {
          term: "Absatzumbrüche beibehalten",
          description:
            "verbindet einzelne harte Umbrüche innerhalb eines Absatzes und erhält durch Leerzeilen getrennte Absätze.",
        },
        {
          term: "Benutzerdefiniert",
          description: "ersetzt neue Zeilen durch ein eigenes kurzes Trennzeichen.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen",
      commonUsesIntro: "Das Entfernen von Zeilenumbrüchen hilft bei Text aus:",
      commonUsesItems: [
        "PDF-Dokumenten",
        "E-Mails und Webseiten",
        "Word-Dokumenten und Kommentaren",
        "OCR- oder Textexporten",
      ],
      dataHeading: "Private Textbereinigung im Browser",
      dataParagraph: "Die Textumwandlung läuft vollständig in deinem Browser.",
      dataItems,
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Kann ich neue Zeilen entfernen und Absätze behalten?",
          answer:
            "Ja. Aktiviere Absatzumbrüche beibehalten, um durch Leerzeilen getrennte Absätze zu erhalten.",
        },
        {
          question: "Kann ich Zeilenumbrüche durch Kommas ersetzen?",
          answer:
            "Ja. Wähle Komma oder Komma + Leerzeichen oder gib ein eigenes Trennzeichen ein.",
        },
        {
          question: "Werden Windows- und Unix-Zeilenenden unterstützt?",
          answer: "Ja. LF, CRLF und einzelne CR-Zeilenenden werden vereinheitlicht.",
        },
        {
          question: "Wird mein Text hochgeladen?",
          answer: "Nein. Die Umwandlung läuft lokal in deinem Browser.",
        },
      ],
    },
  },
  columnToCommaSeparatedList: {
    page: {
      heading: "Spalte in kommagetrennte Liste",
      description:
        "Wandle eine Spalte mit einem Eintrag pro Zeile in eine kommagetrennte Liste oder ein anderes Trennzeichenformat um.",
      privacy,
    },
    tool: {
      heading: "Spalte in getrennte Liste umwandeln",
      listLabel: "Spalte",
      pastePlaceholder: "Ein Eintrag pro Zeile",
      clear: "Leeren",
      loadExample: "Beispiel testen",
      example: "Apfel\nBirne\nKirsche",
      replaceExampleConfirmation:
        "Beispiel laden und die aktuelle Spalte ersetzen? Deine aktuelle Eingabe geht verloren.",
      options: "Optionen",
      trimWhitespace: "Leerraum am Rand entfernen",
      ignoreEmptyLines: "Leere Zeilen ignorieren",
      separator: "Trennzeichen",
      separatorCommaSpace: "Komma + Leerzeichen",
      separatorComma: "Komma",
      separatorSemicolon: "Semikolon",
      separatorPipe: "Pipe",
      separatorTab: "Tabulator",
      separatorCustom: "Benutzerdefiniert",
      customSeparator: "Eigenes Trennzeichen",
      resultLabel: "Umgewandelte Liste",
      item: "Eintrag",
      items: "Einträge",
      emptyResult: "Füge eine Spalte ein, um die umgewandelte Liste zu sehen.",
      copy: "Kopieren",
      copied: "Kopiert",
      download: "Herunterladen",
      copyError: "Kopieren nicht möglich. Markiere das Ergebnis manuell.",
      noscript:
        "JavaScript ist erforderlich, um die Spalte umzuwandeln. Die Liste wird lokal in deinem Browser verarbeitet.",
    },
    editorial: {
      howToHeading: "So wandelst du eine Spalte in eine kommagetrennte Liste um",
      howToSteps: [
        "Füge einen Wert pro Zeile ein.",
        "Lass Komma + Leerzeichen ausgewählt oder wähle ein anderes Trennzeichen.",
        "Passe Leerraum und leere Zeilen bei Bedarf an.",
        "Kopiere oder lade das einzeilige Ergebnis herunter.",
      ],
      resultsHeading: "So funktioniert die Spaltenumwandlung",
      resultsIntro:
        "Jede verarbeitete Zeile bleibt in derselben Reihenfolge ein eigener Listenwert; das gewählte Trennzeichen wird zwischen die Werte gesetzt.",
      resultsItems: [
        {
          term: "Komma + Leerzeichen",
          description: "erzeugt standardmäßig eine gut lesbare kommagetrennte Liste.",
        },
        {
          term: "Andere Trennzeichen",
          description:
            "umfassen Komma, Semikolon, Pipe, Tabulator und einen eigenen Wert.",
        },
        {
          term: "Duplikate",
          description:
            "bleiben erhalten, weil dieses Tool formatiert und nicht dedupliziert.",
        },
      ],
      commonUsesHeading: "Typische Anwendungen",
      commonUsesIntro: "Die Umwandlung ist praktisch für:",
      commonUsesItems: [
        "Spalten aus Excel oder Google Sheets",
        "IDs, Namen, URLs und Keywords",
        "kommagetrennte Werte für Formulare oder Filter",
        "Semikolon-, Pipe- oder Tabulator-getrennten Text",
      ],
      dataHeading: "Private Formatierung im Browser",
      dataParagraph: "Die Spaltenumwandlung läuft vollständig in deinem Browser.",
      dataItems,
      dataLinkLabel: "Weitere Details findest du auf der Datenschutzseite.",
      faqHeading: "Häufig gestellte Fragen",
      faqItems: [
        {
          question: "Kann ich ein anderes Trennzeichen als ein Komma verwenden?",
          answer:
            "Ja. Wähle Semikolon, Pipe, Tabulator oder gib ein eigenes Trennzeichen ein.",
        },
        {
          question: "Werden doppelte Werte entfernt?",
          answer: "Nein. Doppelte Zeilen bleiben in ihrer ursprünglichen Reihenfolge erhalten.",
        },
        {
          question: "Kann ich Leerzeichen an den Werten behalten?",
          answer:
            "Ja. Deaktiviere Leerraum am Rand entfernen, um sie wie eingegeben zu behalten.",
        },
        {
          question: "Wird meine Spalte hochgeladen?",
          answer: "Nein. Die Umwandlung läuft lokal in deinem Browser.",
        },
      ],
    },
  },
  metadata: {
    randomTeamGenerator: {
      title: "Zufälliger Teamgenerator – Teams & Gruppen auslosen | ListContrast",
      description:
        "Füge Namen ein, wähle Teamanzahl oder Personen pro Team und teile alle in ausgeglichene zufällige Teams ein. Lokal im Browser.",
    },
    randomPairGenerator: {
      title: "Zufällige Paare bilden – Online Paar-Generator | ListContrast",
      description:
        "Bilde aus Namen oder Listeneinträgen zufällige Paare. Ungerade Listen werden klar behandelt und lokal im Browser verarbeitet.",
    },
    removeLineBreaks: {
      title: "Zeilenumbrüche online entfernen – Absätze behalten | ListContrast",
      description:
        "Entferne Zeilenumbrüche und neue Zeilen, behalte Absätze oder ersetze Umbrüche durch ein Trennzeichen. Lokal im Browser.",
    },
    columnToCommaSeparatedList: {
      title: "Spalte in kommagetrennte Liste umwandeln | ListContrast",
      description:
        "Wandle eine Spalte mit einem Wert pro Zeile in eine kommagetrennte Liste um. Komma, Semikolon, Pipe, Tab oder eigenes Trennzeichen.",
    },
  },
  toolsPageItems: {
    randomTeamGenerator: {
      label: "Zufälliger Teamgenerator",
      description: "Teile Namen oder Einträge in ausgeglichene zufällige Teams ein.",
    },
    randomPairGenerator: {
      label: "Zufällige Paare",
      description: "Lose zufällige Paare aus und zeige einen übrigen Eintrag klar an.",
    },
    removeLineBreaks: {
      label: "Zeilenumbrüche entfernen",
      description: "Verbinde umgebrochenen Text und behalte auf Wunsch Absätze.",
    },
    columnToCommaSeparatedList: {
      label: "Spalte in kommagetrennte Liste",
      description: "Wandle eine Zeilenspalte in eine getrennte Liste um.",
    },
  },
  aboutParagraphs: [
    "ListContrast ist eine fokussierte Sammlung browserbasierter Werkzeuge zum Vergleichen, Ordnen, Mischen, Bereinigen und Formatieren zeilenbasierter Listen.",
    "Dazu gehören Listenvergleich, alphabetisches Sortieren, zufälliges Mischen, Duplikatentfernung, zufällige Teams und Paare, das Entfernen von Zeilenumbrüchen sowie die Umwandlung von Spalten in getrennte Listen.",
    "Die Werkzeuge sind für schnelle Einzelaufgaben ohne Konto und ohne serverseitige Verarbeitung deiner eingefügten Listen gedacht.",
  ],
} satisfies ExpansionLocaleContent;
