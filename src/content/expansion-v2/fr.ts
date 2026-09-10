import type { ExpansionLocaleContent } from "./types";

const privacy = "Le traitement s’effectue localement dans votre navigateur.";
const dataItems = [
  "Le contenu collé n’est pas envoyé pour être traité.",
  "Le presse-papiers n’est utilisé qu’après un clic sur Copier.",
  "Le téléchargement crée un fichier texte local uniquement après un clic.",
] as const;

export const frenchExpansionContent = {
  homePatch: {
    description:
      "Comparez deux listes pour trouver les différences, les éléments communs, les éléments uniques, l’intersection et l’union directement dans votre navigateur.",
    metadata: {
      title:
        "Comparer des listes en ligne – différences et correspondances | ListContrast",
      description:
        "Comparez deux listes en ligne pour trouver différences, éléments communs, éléments uniques, intersection et union. Gratuit et traité localement.",
    },
    editorial: {
      resultsHeading: "Comprendre les résultats de la comparaison",
      resultsIntro:
        "Les vues présentent la même comparaison sous plusieurs angles en conservant l’ordre d’origine. Avec la suppression des doublons, les résultats correspondent aux opérations d’ensembles classiques ; si les doublons sont conservés, chaque occurrence est comparée séparément.",
      resultsItems: [
        {
          term: "Différences",
          description:
            "éléments présents dans une seule liste ; sans doublons, il s’agit de la différence symétrique.",
        },
        {
          term: "Seulement A",
          description:
            "éléments ou occurrences de la liste A sans équivalent dans B ; sans doublons, cela correspond à A − B.",
        },
        {
          term: "Seulement B",
          description:
            "éléments ou occurrences de la liste B sans équivalent dans A ; sans doublons, cela correspond à B − A.",
        },
        {
          term: "Correspondances",
          description:
            "éléments présents dans les deux listes ; sans doublons, il s’agit de l’intersection.",
        },
        {
          term: "Tous",
          description:
            "la liste A suivie des valeurs de B qui ne sont pas déjà représentées ; sans doublons, il s’agit de l’union.",
        },
      ],
      commonUsesItems: [
        "adresses e-mail, noms et listes de participants",
        "identifiants, SKU et listes de produits",
        "URL, mots-clés et tags",
        "colonnes copiées depuis Excel ou Google Sheets",
        "exports de deux systèmes pour repérer les enregistrements manquants",
        "anciens et nouveaux exports d’inventaire, d’URL ou de mots-clés à rapprocher",
      ],
    },
  },
  randomTeamGenerator: {
    page: {
      heading: "Générateur d’équipes aléatoires",
      description:
        "Collez des noms, choisissez le nombre d’équipes ou le nombre de personnes par équipe et créez des groupes aléatoires équilibrés.",
      privacy,
    },
    tool: {
      heading: "Créer des équipes aléatoires",
      listLabel: "Participants ou éléments",
      pastePlaceholder: "Un participant ou élément par ligne",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example: "Alice\nBenoît\nChloé\nDavid\nEmma\nFélix\nGabriel\nHugo",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer la liste actuelle ? Votre saisie actuelle sera perdue.",
      participant: "participant",
      participants: "participants",
      modeLabel: "Répartition",
      numberOfTeams: "Nombre d’équipes",
      peoplePerTeam: "Personnes par équipe",
      valueLabel: "Valeur",
      generate: "Créer les équipes",
      reroll: "Recréer",
      resultLabel: "Équipes aléatoires",
      team: "Équipe",
      copy: "Tout copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      emptyResult: "Ajoutez au moins deux éléments pour créer des équipes.",
      invalidValue: "Saisissez un entier positif.",
      tooManyTeams:
        "Le nombre d’équipes ne peut pas dépasser le nombre d’éléments.",
      noscript:
        "JavaScript est nécessaire pour créer les équipes. La liste est traitée localement dans votre navigateur.",
    },
    editorial: {
      howToHeading: "Comment créer des équipes aléatoires",
      howToSteps: [
        "Collez un nom ou un élément par ligne.",
        "Choisissez Nombre d’équipes ou Personnes par équipe.",
        "Saisissez un entier positif puis sélectionnez Créer les équipes.",
        "Copiez les groupes ou recréez-les pour obtenir une nouvelle répartition.",
      ],
      resultsHeading: "Comment sont équilibrés les groupes aléatoires",
      resultsIntro:
        "La liste est mélangée dans votre navigateur puis répartie aussi équitablement que possible. Chaque occurrence valide est affectée exactement une fois.",
      resultsItems: [
        {
          term: "Nombre d’équipes",
          description:
            "crée exactement ce nombre de groupes, dont les tailles diffèrent au maximum d’une personne.",
        },
        {
          term: "Personnes par équipe",
          description:
            "utilise la valeur comme taille cible maximale, calcule le nombre de groupes nécessaire puis les équilibre.",
        },
        {
          term: "Noms identiques",
          description:
            "restent des occurrences distinctes, car plusieurs personnes peuvent porter le même nom.",
        },
      ],
      commonUsesHeading: "Usages courants",
      commonUsesIntro: "Les groupes aléatoires sont utiles pour :",
      commonUsesItems: [
        "les équipes en classe et les groupes d’étude",
        "les ateliers et groupes de discussion",
        "les jeux et sports de loisir",
        "les exercices d’équipe au travail ou en événement",
      ],
      dataHeading: "Création d’équipes privée dans le navigateur",
      dataParagraph:
        "Le mélange et la répartition sont effectués entièrement dans votre navigateur.",
      dataItems,
      dataLinkLabel: "Plus de détails sur la page Confidentialité.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question: "Les équipes ont-elles la même taille ?",
          answer:
            "Elles sont réparties aussi équitablement que possible. Si la division n’est pas exacte, leur taille diffère au maximum d’une personne.",
        },
        {
          question:
            "Puis-je choisir la taille des groupes plutôt que leur nombre ?",
          answer:
            "Oui. Choisissez Personnes par équipe et l’outil créera assez de groupes pour ne pas dépasser cette taille cible.",
        },
        {
          question: "Deux personnes peuvent-elles avoir le même nom ?",
          answer:
            "Oui. Les lignes répétées restent des occurrences distinctes.",
        },
        {
          question: "Les noms sont-ils envoyés sur un serveur ?",
          answer:
            "Non. La répartition est effectuée localement dans votre navigateur.",
        },
      ],
    },
  },
  randomPairGenerator: {
    page: {
      heading: "Générateur de paires aléatoires",
      description:
        "Collez des noms ou des éléments et créez des paires aléatoires ; une liste impaire laisse clairement un élément sans paire.",
      privacy,
    },
    tool: {
      heading: "Créer des paires aléatoires",
      listLabel: "Participants ou éléments",
      pastePlaceholder: "Un participant ou élément par ligne",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example: "Alice\nBenoît\nChloé\nDavid\nEmma\nFélix\nGabriel",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer la liste actuelle ? Votre saisie actuelle sera perdue.",
      item: "élément",
      items: "éléments",
      generate: "Créer les paires",
      reroll: "Recréer",
      resultLabel: "Paires aléatoires",
      pair: "Paire",
      unpaired: "Sans paire",
      copy: "Tout copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      emptyResult: "Ajoutez au moins un élément pour créer des paires.",
      noscript:
        "JavaScript est nécessaire pour créer les paires. La liste est traitée localement dans votre navigateur.",
    },
    editorial: {
      howToHeading: "Comment créer des paires aléatoires",
      howToSteps: [
        "Collez un nom ou un élément par ligne.",
        "Sélectionnez Créer les paires.",
        "Vérifiez les paires et, si nécessaire, l’élément Sans paire.",
        "Copiez le résultat ou recréez les paires.",
      ],
      resultsHeading: "Comment fonctionne la création de paires",
      resultsIntro:
        "L’outil mélange toutes les occurrences valides puis prend la liste mélangée deux éléments à la fois.",
      resultsItems: [
        {
          term: "Nombre pair",
          description: "chaque élément appartient à une paire.",
        },
        {
          term: "Nombre impair",
          description:
            "l’outil crée le maximum de paires et affiche un élément Sans paire.",
        },
        {
          term: "Noms identiques",
          description:
            "restent des occurrences séparées et ne sont pas supprimés.",
        },
      ],
      commonUsesHeading: "Usages courants",
      commonUsesIntro: "Les paires aléatoires conviennent notamment pour :",
      commonUsesItems: [
        "les binômes d’étude",
        "les exercices d’atelier",
        "les binômes d’entretien ou de relecture",
        "les jeux et exercices pratiques",
      ],
      dataHeading: "Création de paires privée dans le navigateur",
      dataParagraph:
        "La création des paires s’effectue entièrement dans votre navigateur.",
      dataItems,
      dataLinkLabel: "Plus de détails sur la page Confidentialité.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question: "Que se passe-t-il avec un nombre impair de noms ?",
          answer:
            "L’outil crée autant de paires que possible et marque l’élément restant comme Sans paire.",
        },
        {
          question:
            "Une nouvelle génération évite-t-elle les anciennes paires ?",
          answer:
            "Non. Chaque génération est indépendante et aucun historique des paires n’est conservé.",
        },
        {
          question: "Les noms en double sont-ils supprimés ?",
          answer: "Non. Chaque occurrence valide est conservée.",
        },
        {
          question: "Mes noms sont-ils envoyés ?",
          answer: "Non. La création des paires reste locale au navigateur.",
        },
      ],
    },
  },
  removeLineBreaks: {
    page: {
      heading: "Supprimer les sauts de ligne",
      description:
        "Supprimez les sauts de ligne indésirables, conservez les paragraphes ou remplacez les retours à la ligne par un séparateur.",
      privacy,
    },
    tool: {
      heading: "Supprimer ou remplacer les sauts de ligne",
      textLabel: "Texte",
      pastePlaceholder:
        "Collez un texte contenant des sauts de ligne indésirables",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example:
        "Ce paragraphe a été copié\navec des retours à la ligne\nqui doivent devenir des espaces.\n\nCe deuxième paragraphe\ndoit rester séparé.",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer le texte actuel ? Votre saisie actuelle sera perdue.",
      options: "Options",
      replaceWith: "Remplacer les sauts de ligne par",
      separatorSpace: "Espace",
      separatorNothing: "Rien",
      separatorComma: "Virgule",
      separatorCommaSpace: "Virgule + espace",
      separatorSemicolon: "Point-virgule",
      separatorCustom: "Personnalisé",
      customSeparator: "Séparateur personnalisé",
      keepParagraphs: "Conserver les paragraphes",
      trimEachLine: "Supprimer les espaces autour de chaque ligne",
      collapseSpaces: "Réduire les espaces répétés",
      resultLabel: "Texte nettoyé",
      emptyResult: "Collez du texte pour voir le résultat nettoyé.",
      copy: "Copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      noscript:
        "JavaScript est nécessaire pour supprimer les sauts de ligne. Le texte est traité localement dans votre navigateur.",
    },
    editorial: {
      howToHeading: "Comment supprimer les sauts de ligne",
      howToSteps: [
        "Collez le texte contenant des retours à la ligne indésirables.",
        "Choisissez par quoi remplacer chaque saut de ligne.",
        "Conservez les paragraphes si les lignes vides doivent rester des séparations.",
        "Copiez ou téléchargez le texte nettoyé.",
      ],
      resultsHeading: "Sauts de ligne, retours et paragraphes",
      resultsIntro:
        "L’outil normalise d’abord les fins de ligne Windows, Unix et les anciens retours chariot, puis applique le remplacement choisi.",
      resultsItems: [
        {
          term: "Espace",
          description:
            "est le réglage par défaut pour remettre en forme du texte sans coller les mots voisins.",
        },
        {
          term: "Conserver les paragraphes",
          description:
            "fusionne les retours simples à l’intérieur d’un paragraphe tout en gardant les blocs séparés par des lignes vides.",
        },
        {
          term: "Personnalisé",
          description:
            "permet de remplacer les retours par le séparateur de votre choix.",
        },
      ],
      commonUsesHeading: "Usages courants",
      commonUsesIntro: "Ce nettoyage est utile pour du texte copié depuis :",
      commonUsesItems: [
        "des documents PDF",
        "des e-mails et pages web",
        "des documents Word et commentaires",
        "des résultats OCR ou d’extraction de texte",
      ],
      dataHeading: "Nettoyage privé dans le navigateur",
      dataParagraph:
        "La transformation du texte s’effectue entièrement dans votre navigateur.",
      dataItems,
      dataLinkLabel: "Plus de détails sur la page Confidentialité.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question:
            "Puis-je supprimer les retours sans supprimer les paragraphes ?",
          answer:
            "Oui. Activez Conserver les paragraphes pour garder les blocs séparés par des lignes vides.",
        },
        {
          question:
            "Puis-je remplacer les retours à la ligne par des virgules ?",
          answer:
            "Oui. Choisissez Virgule, Virgule + espace ou saisissez un séparateur personnalisé.",
        },
        {
          question:
            "Les fins de ligne Windows et Unix sont-elles prises en charge ?",
          answer:
            "Oui. LF, CRLF et CR sont normalisés avant la transformation.",
        },
        {
          question: "Mon texte est-il envoyé ?",
          answer:
            "Non. La transformation s’effectue localement dans le navigateur.",
        },
      ],
    },
  },
  columnToCommaSeparatedList: {
    page: {
      heading: "Convertir une colonne en liste séparée par des virgules",
      description:
        "Transformez une colonne avec une valeur par ligne en liste séparée par des virgules ou choisissez un autre séparateur.",
      privacy,
    },
    tool: {
      heading: "Convertir une colonne en liste",
      listLabel: "Colonne",
      pastePlaceholder: "Un élément par ligne",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example: "pomme\nbanane\ncerise",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer la colonne actuelle ? Votre saisie actuelle sera perdue.",
      options: "Options",
      trimWhitespace: "Supprimer les espaces autour des valeurs",
      ignoreEmptyLines: "Ignorer les lignes vides",
      separator: "Séparateur",
      separatorCommaSpace: "Virgule + espace",
      separatorComma: "Virgule",
      separatorSemicolon: "Point-virgule",
      separatorPipe: "Barre verticale",
      separatorTab: "Tabulation",
      separatorCustom: "Personnalisé",
      customSeparator: "Séparateur personnalisé",
      resultLabel: "Liste convertie",
      item: "élément",
      items: "éléments",
      emptyResult: "Collez une colonne pour voir la liste convertie.",
      copy: "Copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      noscript:
        "JavaScript est nécessaire pour convertir la colonne. La liste est traitée localement dans votre navigateur.",
    },
    editorial: {
      howToHeading:
        "Comment convertir une colonne en liste séparée par des virgules",
      howToSteps: [
        "Collez une valeur par ligne.",
        "Gardez Virgule + espace ou choisissez un autre séparateur.",
        "Ajustez la gestion des espaces et lignes vides si nécessaire.",
        "Copiez ou téléchargez le résultat sur une seule ligne.",
      ],
      resultsHeading: "Comment la colonne est convertie",
      resultsIntro:
        "Chaque ligne traitée reste une valeur distincte dans le même ordre, et le séparateur choisi est inséré entre les valeurs.",
      resultsItems: [
        {
          term: "Virgule + espace",
          description:
            "produit par défaut une liste séparée par des virgules lisible.",
        },
        {
          term: "Autres séparateurs",
          description:
            "incluent virgule, point-virgule, barre verticale, tabulation et valeur personnalisée.",
        },
        {
          term: "Doublons",
          description:
            "sont conservés, car cet outil formate les valeurs sans les dédupliquer.",
        },
      ],
      commonUsesHeading: "Usages courants",
      commonUsesIntro: "La conversion de colonne est utile pour :",
      commonUsesItems: [
        "les colonnes copiées depuis Excel ou Google Sheets",
        "les identifiants, noms, URL et mots-clés",
        "des valeurs séparées par des virgules pour formulaires ou filtres",
        "du texte séparé par point-virgule, barre verticale ou tabulation",
      ],
      dataHeading: "Formatage privé dans le navigateur",
      dataParagraph:
        "La conversion s’effectue entièrement dans votre navigateur.",
      dataItems,
      dataLinkLabel: "Plus de détails sur la page Confidentialité.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question: "Puis-je utiliser un séparateur autre qu’une virgule ?",
          answer:
            "Oui. Choisissez point-virgule, barre verticale, tabulation ou un séparateur personnalisé.",
        },
        {
          question: "Les valeurs en double sont-elles supprimées ?",
          answer:
            "Non. Les lignes en double sont conservées dans leur ordre d’origine.",
        },
        {
          question: "Puis-je conserver les espaces autour de mes valeurs ?",
          answer:
            "Oui. Désactivez la suppression des espaces autour des valeurs pour les garder tels quels.",
        },
        {
          question: "Ma colonne est-elle envoyée ?",
          answer:
            "Non. La conversion s’effectue localement dans votre navigateur.",
        },
      ],
    },
  },
  metadata: {
    randomTeamGenerator: {
      title:
        "Générateur d’équipes aléatoires – créer des groupes | ListContrast",
      description:
        "Collez des noms, choisissez le nombre d’équipes ou leur taille et créez des groupes aléatoires équilibrés. Traitement local dans le navigateur.",
    },
    randomPairGenerator: {
      title: "Générateur de paires aléatoires en ligne | ListContrast",
      description:
        "Créez instantanément des paires aléatoires à partir de noms ou d’éléments. Les listes impaires sont gérées clairement et localement.",
    },
    removeLineBreaks: {
      title:
        "Supprimer les sauts de ligne en ligne – garder les paragraphes | ListContrast",
      description:
        "Supprimez les sauts de ligne, conservez les paragraphes ou remplacez les retours par un séparateur. Traitement local dans le navigateur.",
    },
    columnToCommaSeparatedList: {
      title: "Colonne en liste séparée par des virgules | ListContrast",
      description:
        "Convertissez une colonne en liste séparée par virgules, point-virgule, barre verticale, tabulation ou séparateur personnalisé.",
    },
  },
  toolsPageItems: {
    randomTeamGenerator: {
      label: "Générateur d’équipes aléatoires",
      description:
        "Répartissez des noms ou éléments en groupes aléatoires équilibrés.",
    },
    randomPairGenerator: {
      label: "Générateur de paires aléatoires",
      description:
        "Créez des paires aléatoires et gérez clairement un élément restant.",
    },
    removeLineBreaks: {
      label: "Supprimer les sauts de ligne",
      description:
        "Recomposez du texte tout en conservant les paragraphes si besoin.",
    },
    columnToCommaSeparatedList: {
      label: "Colonne en liste séparée par des virgules",
      description:
        "Transformez une colonne de lignes en liste avec séparateur.",
    },
  },
  aboutParagraphs: [
    "ListContrast est une collection ciblée d’outils dans le navigateur pour comparer, organiser, mélanger, nettoyer et formater des listes ligne par ligne.",
    "Elle comprend la comparaison de listes, le tri alphabétique, le mélange aléatoire, la suppression des doublons, la création d’équipes et de paires, le nettoyage des sauts de ligne et la conversion de colonnes en listes séparées.",
    "Les outils sont conçus pour des tâches ponctuelles rapides, sans compte et sans traitement serveur du contenu que vous collez.",
  ],
} satisfies ExpansionLocaleContent;
