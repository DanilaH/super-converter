import type { LocaleContent, ToolPageKey } from "../../i18n/types";

const related = (pageKey: ToolPageKey, label: string, description: string) =>
  ({ pageKey, label, description }) as const;

export const frenchContent = {
  siteName: "ListContrast",
  home: {
    heading: "Comparer deux listes",
    description:
      "Comparez deux listes et trouvez immédiatement les différences, correspondances et éléments uniques.",
    privacy: "Le traitement s’effectue localement dans votre navigateur.",
  },
  compare: {
    heading: "Comparer des listes",
    listA: "Liste A",
    listB: "Liste B",
    pastePlaceholder: "Collez un élément par ligne",
    clear: "Effacer",
    swap: "Inverser",
    loadExample: "Essayer un exemple",
    replaceExampleConfirmation:
      "Charger l’exemple et remplacer les deux listes actuelles ? Vos saisies actuelles seront perdues.",
    comparisonOptions: "Options",
    trimWhitespace: "Ignorer les espaces autour",
    ignoreEmptyLines: "Ignorer les lignes vides",
    ignoreCase: "Ignorer la casse",
    removeDuplicates: "Supprimer les doublons",
    results: "Résultats",
    emptyResults:
      "Collez deux listes ci-dessus pour voir leurs différences et correspondances.",
    noDifferences: "Aucune différence trouvée.",
    sameValues:
      "Les deux listes contiennent les mêmes valeurs avec les options de comparaison actuelles.",
    noMatches: "Aucune valeur commune.",
    onlyInA: "Uniquement dans A",
    inBoth: "Dans les deux",
    onlyInB: "Uniquement dans B",
    row: "ligne",
    rows: "lignes",
    item: "élément",
    items: "éléments",
    differences: "Différences",
    onlyA: "Uniquement A",
    onlyB: "Uniquement B",
    matches: "Correspondances",
    all: "Tout",
    noscript:
      "JavaScript est nécessaire pour comparer les listes. Leur contenu est traité localement dans votre navigateur et n’est pas envoyé sur un serveur.",
    copy: "Copier",
    copied: "Copié",
    download: "Télécharger",
    copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
  },
  alphabetizeList: {
    page: {
      heading: "Trier une liste par ordre alphabétique",
      description:
        "Triez des noms, des mots ou toute liste ligne par ligne par ordre alphabétique, de A à Z ou de Z à A.",
      privacy: "Le traitement s’effectue localement dans votre navigateur.",
    },
    tool: {
      heading: "Trier une liste par ordre alphabétique",
      listLabel: "Liste",
      pastePlaceholder: "Collez un élément par ligne",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example: "École\nÉclair\nÉtude\nOrange\nÉlément 10\nÉlément 2",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer la liste actuelle ? Votre saisie actuelle sera perdue.",
      options: "Options",
      trimWhitespace: "Supprimer les espaces autour",
      ignoreEmptyLines: "Ignorer les lignes vides",
      order: "Ordre",
      ascending: "A → Z",
      descending: "Z → A",
      resultLabel: "Liste triée",
      item: "élément",
      items: "éléments",
      emptyResult: "Collez une liste pour afficher le résultat trié.",
      noEffectiveItems: "Aucun élément ne reste avec les options actuelles.",
      copy: "Copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      noscript:
        "JavaScript est nécessaire pour trier une liste. Le contenu est traité localement dans votre navigateur.",
    },
    editorial: {
      howToHeading: "Comment trier une liste par ordre alphabétique",
      howToSteps: [
        "Collez un élément par ligne dans le champ Liste.",
        "Conservez A → Z ou choisissez Z → A.",
        "Ajustez le traitement des espaces et des lignes vides si nécessaire.",
        "Vérifiez le résultat, puis copiez ou téléchargez la liste triée.",
      ],
      resultsHeading: "Comment fonctionne le tri alphabétique",
      resultsIntro:
        "Le tri utilise les règles de collation françaises du navigateur, gère naturellement les nombres dans le texte et conserve les doublons ainsi que la casse d’origine.",
      resultsItems: [
        {
          term: "A → Z",
          description: "trie les éléments traités dans l’ordre croissant.",
        },
        {
          term: "Z → A",
          description: "trie les mêmes éléments dans l’ordre décroissant.",
        },
        {
          term: "Nombres dans le texte",
          description:
            "sont triés naturellement, de sorte qu’Élément 2 précède Élément 10.",
        },
      ],
      commonUsesHeading: "Usages courants",
      commonUsesIntro: "Le tri alphabétique est pratique pour :",
      commonUsesItems: [
        "les listes de noms et de participants",
        "les mots et le vocabulaire",
        "les mots-clés et les tags",
        "les noms de produits ou libellés",
        "les colonnes copiées depuis Excel ou Google Sheets",
      ],
      dataHeading: "Comment vos données sont traitées",
      dataParagraph:
        "Le tri s’effectue entièrement dans votre navigateur. La liste collée et le résultat ne sont pas envoyés sur un serveur pour être traités.",
      dataItems: [
        "Les espaces autour des lignes ne sont supprimés que si l’option correspondante est activée.",
        "Les lignes vides ne sont retirées que si cette option est activée.",
        "Copier accède au presse-papiers uniquement après votre clic.",
        "Télécharger crée un fichier texte local uniquement après votre clic.",
      ],
      dataLinkLabel: "Consultez la page Confidentialité pour plus de détails.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question: "Le tri supprime-t-il les doublons ?",
          answer:
            "Non. Les lignes répétées restent dans le résultat et sont simplement replacées dans l’ordre alphabétique.",
        },
        {
          question: "Comment les accents sont-ils triés ?",
          answer:
            "La page utilise la collation française du navigateur afin de traiter les caractères accentués selon les règles adaptées au français.",
        },
        {
          question: "Le tri gère-t-il les nombres dans le texte ?",
          answer:
            "Oui. Le tri numérique place par exemple Élément 2 avant Élément 10.",
        },
        {
          question: "Puis-je trier une colonne Excel ou Google Sheets ?",
          answer:
            "Oui. Copiez une colonne et collez-la avec une valeur par ligne.",
        },
        {
          question: "Ma liste est-elle envoyée sur un serveur ?",
          answer:
            "Non. Le tri s’effectue localement dans votre navigateur et le contenu collé n’est pas envoyé pour traitement.",
        },
      ],
    },
  },
  randomizeList: {
    page: {
      heading: "Mélanger une liste",
      description:
        "Mélangez des noms, des mots ou toute liste ligne par ligne pour obtenir un ordre aléatoire.",
      privacy: "Le traitement s’effectue localement dans votre navigateur.",
    },
    tool: {
      heading: "Mélanger une liste",
      listLabel: "Liste",
      pastePlaceholder: "Collez un élément par ligne",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example: "Pomme\nPoire\nCerise\nPrune\nRaisin",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer la liste actuelle ? Votre saisie actuelle sera perdue.",
      options: "Options",
      trimWhitespace: "Supprimer les espaces autour",
      ignoreEmptyLines: "Ignorer les lignes vides",
      randomize: "Mélanger",
      resultLabel: "Liste mélangée",
      item: "élément",
      items: "éléments",
      emptyResult: "Collez une liste pour créer un ordre aléatoire.",
      readyResult: "Sélectionnez Mélanger pour réorganiser la liste actuelle.",
      noEffectiveItems: "Aucun élément ne reste avec les options actuelles.",
      copy: "Copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      noscript:
        "JavaScript est nécessaire pour mélanger une liste. Le contenu est traité localement dans votre navigateur.",
    },
    editorial: {
      howToHeading: "Comment mélanger une liste",
      howToSteps: [
        "Collez un élément par ligne.",
        "Ajustez le traitement des espaces ou des lignes vides si nécessaire.",
        "Sélectionnez Mélanger pour créer un nouvel ordre aléatoire.",
        "Mélangez à nouveau ou copiez et téléchargez le résultat souhaité.",
      ],
      resultsHeading: "Comment fonctionne le mélange aléatoire",
      resultsIntro:
        "L’outil utilise un mélange de Fisher–Yates directement dans le navigateur. Chaque occurrence traitée reste présente, y compris les doublons.",
      resultsItems: [
        {
          term: "Mélanger",
          description:
            "crée une nouvelle permutation aléatoire de la liste à chaque activation.",
        },
        {
          term: "Éléments répétés",
          description: "restent des occurrences distinctes dans le résultat.",
        },
      ],
      commonUsesHeading: "Usages courants d’une liste aléatoire",
      commonUsesIntro: "Un ordre mélangé est pratique pour :",
      commonUsesItems: [
        "les noms et participants",
        "les questions et consignes",
        "les tâches et activités",
        "les mots et le vocabulaire",
        "les colonnes copiées depuis Excel ou Google Sheets",
      ],
      dataHeading: "Comment vos données sont traitées",
      dataParagraph:
        "Le mélange s’effectue entièrement dans votre navigateur. La liste et le résultat ne sont pas envoyés sur un serveur pour être traités.",
      dataItems: [
        "Les espaces autour des lignes ne sont supprimés que si l’option correspondante est activée.",
        "Les lignes vides ne sont retirées que si cette option est activée.",
        "Copier accède au presse-papiers uniquement après votre clic.",
        "Télécharger crée un fichier texte local uniquement après votre clic.",
      ],
      dataLinkLabel: "Consultez la page Confidentialité pour plus de détails.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question: "Les doublons sont-ils supprimés ?",
          answer:
            "Non. Chaque ligne reste une occurrence distincte dans la liste mélangée.",
        },
        {
          question: "Chaque mélange est-il forcément différent ?",
          answer:
            "Non. Le hasard peut produire le même ordre, surtout avec une liste courte.",
        },
        {
          question: "La liste se mélange-t-elle pendant la saisie ?",
          answer:
            "Non. Un nouvel ordre n’est créé que lorsque vous sélectionnez Mélanger.",
        },
        {
          question: "Puis-je mélanger des noms copiés depuis un tableur ?",
          answer:
            "Oui. Collez une colonne avec une valeur par ligne.",
        },
        {
          question: "Ma liste est-elle envoyée sur un serveur ?",
          answer:
            "Non. Le mélange s’effectue localement dans votre navigateur et la liste n’est pas envoyée pour traitement.",
        },
      ],
    },
  },
  removeDuplicateLines: {
    page: {
      heading: "Supprimer les doublons d’une liste",
      description:
        "Supprimez les lignes en double tout en conservant la première occurrence et l’ordre d’origine.",
      privacy: "Le traitement s’effectue localement dans votre navigateur.",
    },
    tool: {
      heading: "Supprimer les lignes en double",
      listLabel: "Liste",
      pastePlaceholder: "Collez un élément par ligne",
      clear: "Effacer",
      loadExample: "Essayer un exemple",
      example: "Pomme\nBanane\nPomme\nCerise\nbanane",
      replaceExampleConfirmation:
        "Charger l’exemple et remplacer le texte actuel ? Votre saisie actuelle sera perdue.",
      options: "Options",
      trimWhitespace: "Supprimer les espaces autour",
      ignoreEmptyLines: "Ignorer les lignes vides",
      ignoreCase: "Ignorer la casse",
      resultLabel: "Lignes uniques",
      item: "élément",
      items: "éléments",
      emptyResult: "Collez du texte ou une liste pour supprimer les doublons.",
      noEffectiveItems: "Aucune ligne ne reste avec les options actuelles.",
      input: "Entrée",
      unique: "Uniques",
      removed: "Supprimées",
      copy: "Copier",
      copied: "Copié",
      download: "Télécharger",
      copyError: "Impossible de copier. Sélectionnez le résultat manuellement.",
      noscript:
        "JavaScript est nécessaire pour supprimer les lignes en double. Le traitement s’effectue localement dans votre navigateur.",
    },
    editorial: {
      howToHeading: "Comment supprimer les doublons d’une liste",
      howToSteps: [
        "Collez du texte ou une liste avec un élément par ligne.",
        "Ajustez les espaces, les lignes vides ou la casse si nécessaire.",
        "Les doublons sont supprimés automatiquement et la première occurrence est conservée.",
        "Vérifiez les lignes uniques, puis copiez ou téléchargez le résultat.",
      ],
      resultsHeading: "Comment fonctionne la suppression des doublons",
      resultsIntro:
        "Les lignes sont traitées de haut en bas. La première occurrence est conservée, les répétitions suivantes sont retirées et l’ordre d’origine reste inchangé.",
      resultsItems: [
        {
          term: "Entrée",
          description:
            "compte les lignes traitées avant la suppression des doublons.",
        },
        {
          term: "Uniques",
          description: "compte les lignes conservées dans le résultat.",
        },
        {
          term: "Supprimées",
          description: "indique le nombre de répétitions retirées.",
        },
      ],
      commonUsesHeading: "Usages courants",
      commonUsesIntro: "La suppression des doublons est utile pour :",
      commonUsesItems: [
        "les mots-clés et termes de recherche",
        "les identifiants et références",
        "les URL et domaines",
        "les noms et libellés",
        "les colonnes copiées depuis Excel ou Google Sheets",
      ],
      dataHeading: "Comment vos données sont traitées",
      dataParagraph:
        "La suppression des doublons s’effectue entièrement dans votre navigateur. Les lignes collées et le résultat ne sont pas envoyés pour traitement.",
      dataItems: [
        "Les espaces autour sont retirés avant la comparaison uniquement si l’option est activée.",
        "Les lignes vides sont ignorées uniquement si l’option est activée.",
        "Ignorer la casse modifie seulement l’identité utilisée pour repérer les doublons ; le texte de la première ligne conservée reste intact.",
        "Copier et Télécharger exportent le résultat uniquement après votre action.",
      ],
      dataLinkLabel: "Consultez la page Confidentialité pour plus de détails.",
      faqHeading: "Questions fréquentes",
      faqItems: [
        {
          question: "Quelle occurrence d’un doublon est conservée ?",
          answer:
            "La première occurrence est conservée. Les lignes suivantes ayant la même identité de comparaison sont supprimées.",
        },
        {
          question: "Peut-on ignorer les majuscules et minuscules ?",
          answer:
            "Oui. Pomme et pomme peuvent alors être considérés comme des doublons tout en conservant l’écriture de la première occurrence.",
        },
        {
          question: "L’ordre des lignes est-il conservé ?",
          answer:
            "Oui. L’outil ne trie pas les lignes ; il conserve l’ordre de leur première occurrence.",
        },
        {
          question: "Puis-je dédupliquer une colonne de tableur ?",
          answer:
            "Oui. Collez une colonne avec une valeur par ligne.",
        },
        {
          question: "Mon texte est-il envoyé sur un serveur ?",
          answer:
            "Non. La déduplication s’effectue localement dans votre navigateur et le texte n’est pas envoyé pour traitement.",
        },
      ],
    },
  },
  header: {
    ariaLabel: "Navigation principale",
    tools: "Outils",
    about: "À propos",
    language: "Langue",
  },
  editorial: {
    howToHeading: "Comment comparer deux listes",
    howToSteps: [
      "Collez la première liste dans Liste A.",
      "Collez la seconde liste dans Liste B.",
      "Ajustez les options de comparaison si nécessaire.",
      "Consultez Différences, Uniquement A, Uniquement B, Correspondances ou Tout, puis copiez ou téléchargez le résultat utile.",
    ],
    resultsHeading: "Que signifient les résultats de comparaison ?",
    resultsIntro:
      "Les vues présentent la même comparaison sous différents angles. Les résultats conservent l’ordre des listes d’origine et ne sont jamais triés automatiquement.",
    resultsItems: [
      {
        term: "Différences",
        description: "éléments présents dans une seule des deux listes.",
      },
      {
        term: "Uniquement A",
        description:
          "éléments ou occurrences de la Liste A sans équivalent dans la Liste B.",
      },
      {
        term: "Uniquement B",
        description:
          "éléments ou occurrences de la Liste B sans équivalent dans la Liste A.",
      },
      {
        term: "Correspondances",
        description:
          "éléments présents dans les deux listes, selon l’ordre de la Liste A.",
      },
      {
        term: "Tout",
        description:
          "la Liste A, suivie des valeurs de la Liste B qui ne sont pas encore représentées.",
      },
    ],
    commonUsesHeading: "Usages courants pour comparer des listes",
    commonUsesIntro: "La comparaison est utile notamment pour :",
    commonUsesItems: [
      "les adresses e-mail",
      "les identifiants clients ou commandes",
      "les URL",
      "les listes de produits ou SKU",
      "les mots-clés et les noms",
      "les colonnes copiées depuis Excel ou Google Sheets",
    ],
    dataHeading: "Comment vos données sont traitées",
    dataParagraph:
      "La comparaison s’effectue entièrement dans votre navigateur. Les listes brutes et le contenu des résultats ne sont pas envoyés sur un serveur pour traitement.",
    dataItems: [
      "Les options modifient les règles de correspondance sans réécrire le texte original affiché dans les résultats.",
      "Copier accède au presse-papiers uniquement après votre clic.",
      "Télécharger crée un fichier texte local sur votre appareil.",
      "Le site n’enregistre pas vos listes dans les cookies, localStorage ou sessionStorage.",
      "Les entrées et résultats bruts ne sont pas inclus dans les analytics ni les journaux de l’application.",
    ],
    dataLinkLabel: "Consultez la page Confidentialité pour plus de détails.",
    faqHeading: "Questions fréquentes",
    faqItems: [
      {
        question: "Puis-je comparer deux listes contenant des doublons ?",
        answer:
          "Oui. Supprimer les doublons est activé par défaut. Désactivez cette option pour comparer séparément les occurrences répétées.",
      },
      {
        question: "La comparaison tient-elle compte de la casse ?",
        answer:
          "Oui, par défaut. Ignorer la casse permet de faire correspondre différentes capitalisations sans modifier le texte original.",
      },
      {
        question: "À quoi sert l’option Ignorer les espaces autour ?",
        answer:
          "Elle ignore les espaces et tabulations au début et à la fin d’une ligne lors de la comparaison, tout en conservant le texte original dans les résultats.",
      },
      {
        question: "Puis-je comparer des colonnes Excel ou Google Sheets ?",
        answer:
          "Oui. Copiez une colonne dans chaque liste ; chaque ligne est traitée comme un élément.",
      },
      {
        question: "Mes listes sont-elles envoyées sur un serveur ?",
        answer:
          "Non. La comparaison s’effectue localement dans votre navigateur. Le contenu n’est ni envoyé pour traitement ni enregistré par le site.",
      },
    ],
  },
  about: {
    heading: "À propos de ListContrast",
    paragraphs: [
      "ListContrast est une petite collection d’outils web pour travailler avec des listes ligne par ligne.",
      "Vous pouvez comparer deux listes, trier une liste par ordre alphabétique, la mélanger ou supprimer ses lignes en double.",
      "Aucun compte n’est nécessaire et le contenu des listes est traité localement dans votre navigateur. Les listes ne sont pas envoyées pour traitement ni enregistrées par le site.",
    ],
    toolLinkLabel: "Voir les outils de listes",
  },
  privacy: {
    heading: "Confidentialité",
    intro:
      "Cette page décrit la manière dont ListContrast traite les données dans ses outils de listes. Elle correspond à la version actuelle du site et sera mise à jour avant l’activation de tout service ayant un impact sur la confidentialité.",
    sections: [
      {
        heading: "Contenu des listes",
        paragraphs: [
          "Le texte brut des listes et les résultats sont traités entièrement dans votre navigateur. Le contenu des listes n’entre pas dans les requêtes réseau de traitement et n’est stocké ni dans une base de données, ni dans les cookies, ni dans localStorage ou sessionStorage.",
          "Copier place le résultat dans le presse-papiers système uniquement après votre clic. Télécharger crée un fichier texte local sur votre appareil uniquement après votre clic.",
        ],
      },
      {
        heading: "Requêtes du site web",
        paragraphs: [
          "Comme tout site web, ListContrast est servi par un hébergeur statique. Lorsque vous ouvrez une page, celui-ci peut recevoir des métadonnées ordinaires telles que votre adresse IP, votre user-agent et le chemin demandé. Le contenu collé dans les outils ne fait pas partie de ces requêtes.",
        ],
      },
      {
        heading: "Publicité et analytics",
        paragraphs: [
          "La version actuelle n’utilise aucun script publicitaire, aucun replay de session et aucun fournisseur d’analytics produit en production. Les entrées et résultats bruts ne sont jamais inclus dans les événements analytics ni les journaux applicatifs.",
        ],
      },
      {
        heading: "Modifications de cette page",
        paragraphs: [
          "Si des services ayant un impact sur la confidentialité sont ajoutés, cette page sera mise à jour avant leur activation.",
        ],
      },
    ],
    toolLinkLabel: "Voir les outils de listes",
  },
  footer: {
    ariaLabel: "Pied de page",
    compareLists: "Comparer des listes",
    alphabetizer: "Tri alphabétique",
    randomizer: "Mélanger une liste",
    duplicateLines: "Supprimer les doublons",
    about: "À propos",
    privacy: "Confidentialité",
  },
  metadata: {
    home: {
      title: "Comparer deux listes en ligne – Différences | ListContrast",
      description:
        "Comparez deux listes en ligne pour trouver les différences, correspondances et éléments uniques. Gratuit et traité localement dans le navigateur.",
    },
    alphabetizeList: {
      title: "Trier une liste par ordre alphabétique en ligne | ListContrast",
      description:
        "Triez une liste par ordre alphabétique de A à Z ou de Z à A. Noms et mots sont traités localement dans votre navigateur.",
    },
    randomizeList: {
      title: "Mélanger une liste en ligne – Ordre aléatoire | ListContrast",
      description:
        "Mélangez une liste en ligne pour obtenir un ordre aléatoire. Collez un élément par ligne, mélangez, puis copiez ou téléchargez le résultat.",
    },
    removeDuplicateLines: {
      title: "Supprimer les doublons d’une liste en ligne | ListContrast",
      description:
        "Supprimez les lignes en double d’une liste tout en conservant la première occurrence et l’ordre d’origine, directement dans votre navigateur.",
    },
    tools: {
      title: "Outils de listes | ListContrast",
      description:
        "Outils web pour comparer, trier, mélanger et nettoyer des listes ligne par ligne directement dans votre navigateur.",
    },
    about: {
      title: "À propos de ListContrast",
      description:
        "Découvrez ListContrast et ses outils web pour comparer, trier, mélanger et nettoyer des listes.",
    },
    privacy: {
      title: "Confidentialité | ListContrast",
      description:
        "Découvrez comment ListContrast traite le contenu des listes localement dans votre navigateur et gère les requêtes ordinaires du site.",
    },
    notFound: {
      title: "Page introuvable | ListContrast",
      description:
        "La page ListContrast demandée est introuvable. Consultez les outils de listes disponibles.",
    },
  },
  notFoundPage: {
    heading: "Page introuvable",
    explanation: "La page recherchée n’existe pas ou a été déplacée.",
    toolLinkLabel: "Voir les outils de listes",
  },
  toolsPage: {
    heading: "Outils de listes",
    intro:
      "Des outils web ciblés pour comparer, trier, mélanger et nettoyer des listes ligne par ligne.",
    ariaLabel: "Outils de listes disponibles",
    items: {
      home: {
        label: "Comparer des listes",
        description:
          "Trouver les différences, correspondances et valeurs uniques entre deux listes.",
      },
      alphabetizeList: {
        label: "Tri alphabétique",
        description: "Trier une liste de A à Z ou de Z à A.",
      },
      randomizeList: {
        label: "Mélanger une liste",
        description: "Réorganiser une liste dans un ordre aléatoire.",
      },
      removeDuplicateLines: {
        label: "Supprimer les doublons",
        description:
          "Supprimer les lignes répétées en conservant la première occurrence.",
      },
    },
  },
  relatedTools: {
    heading: "Outils associés",
    byPage: {
      home: [
        related("alphabetizeList", "Tri alphabétique", "Trier une liste par ordre alphabétique."),
        related("randomizeList", "Mélanger une liste", "Réorganiser une liste aléatoirement."),
        related("removeDuplicateLines", "Supprimer les doublons", "Retirer les lignes répétées."),
      ],
      alphabetizeList: [
        related("home", "Comparer des listes", "Trouver différences et correspondances entre deux listes."),
        related("randomizeList", "Mélanger une liste", "Réorganiser une liste aléatoirement."),
        related("removeDuplicateLines", "Supprimer les doublons", "Retirer les lignes répétées."),
      ],
      randomizeList: [
        related("home", "Comparer des listes", "Trouver différences et correspondances entre deux listes."),
        related("alphabetizeList", "Tri alphabétique", "Trier une liste par ordre alphabétique."),
        related("removeDuplicateLines", "Supprimer les doublons", "Retirer les lignes répétées."),
      ],
      removeDuplicateLines: [
        related("home", "Comparer des listes", "Trouver différences et correspondances entre deux listes."),
        related("alphabetizeList", "Tri alphabétique", "Trier une liste par ordre alphabétique."),
        related("randomizeList", "Mélanger une liste", "Réorganiser une liste aléatoirement."),
      ],
    },
  },
} satisfies LocaleContent;
