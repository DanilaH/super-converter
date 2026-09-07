import type { LocaleContent, ToolPageKey } from "../../i18n/types";

const related = (pageKey: ToolPageKey, label: string, description: string) =>
  ({ pageKey, label, description }) as const;

export const brazilianPortugueseContent = {
  siteName: "ListContrast",
  home: {
    heading: "Comparar listas online",
    description:
      "Compare duas listas e encontre diferenças, correspondências e itens exclusivos na hora.",
    privacy: "O processamento acontece localmente no seu navegador.",
  },
  compare: {
    heading: "Comparar listas",
    listA: "Lista A",
    listB: "Lista B",
    pastePlaceholder: "Cole um item por linha",
    clear: "Limpar",
    swap: "Trocar",
    loadExample: "Testar exemplo",
    replaceExampleConfirmation:
      "Carregar o exemplo e substituir as duas listas atuais? O conteúdo atual será perdido.",
    comparisonOptions: "Opções",
    trimWhitespace: "Ignorar espaços ao redor",
    ignoreEmptyLines: "Ignorar linhas vazias",
    ignoreCase: "Ignorar maiúsculas e minúsculas",
    removeDuplicates: "Remover duplicados",
    results: "Resultados",
    emptyResults:
      "Cole duas listas acima para ver diferenças e correspondências.",
    noDifferences: "Nenhuma diferença encontrada.",
    sameValues:
      "As duas listas contêm os mesmos valores com as opções de comparação atuais.",
    noMatches: "Nenhum valor correspondente.",
    onlyInA: "Só em A",
    inBoth: "Nas duas",
    onlyInB: "Só em B",
    row: "linha",
    rows: "linhas",
    item: "item",
    items: "itens",
    differences: "Diferenças",
    onlyA: "Só A",
    onlyB: "Só B",
    matches: "Correspondências",
    all: "Todos",
    noscript:
      "JavaScript é necessário para comparar listas. O conteúdo é processado localmente no seu navegador e não é enviado para processamento.",
    copy: "Copiar",
    copied: "Copiado",
    download: "Baixar",
    copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
  },
  alphabetizeList: {
    page: {
      heading: "Colocar lista em ordem alfabética",
      description:
        "Organize nomes, palavras ou qualquer lista por linhas em ordem alfabética de A a Z ou de Z a A.",
      privacy: "O processamento acontece localmente no seu navegador.",
    },
    tool: {
      heading: "Ordem alfabética online",
      listLabel: "Lista",
      pastePlaceholder: "Cole um item por linha",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example: "Ação\nÁrvore\nBanana\nCafé\nItem 10\nItem 2",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir a lista atual? O conteúdo atual será perdido.",
      options: "Opções",
      trimWhitespace: "Remover espaços ao redor",
      ignoreEmptyLines: "Ignorar linhas vazias",
      order: "Ordem",
      ascending: "A → Z",
      descending: "Z → A",
      resultLabel: "Lista em ordem alfabética",
      item: "item",
      items: "itens",
      emptyResult: "Cole uma lista para ver o resultado em ordem alfabética.",
      noEffectiveItems: "Nenhum item permanece com as opções atuais.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      noscript:
        "JavaScript é necessário para colocar uma lista em ordem alfabética. O conteúdo é processado localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como colocar uma lista em ordem alfabética",
      howToSteps: [
        "Cole um item por linha no campo Lista.",
        "Mantenha A → Z ou mude para Z → A.",
        "Ajuste o tratamento de espaços e linhas vazias, se necessário.",
        "Confira o resultado e copie ou baixe a lista organizada.",
      ],
      resultsHeading: "Como funciona a ordem alfabética",
      resultsIntro:
        "A ferramenta usa a ordenação do navegador para português do Brasil, trata números no texto de forma natural e preserva itens repetidos e a escrita original.",
      resultsItems: [
        {
          term: "A → Z",
          description: "ordena os itens processados em ordem crescente.",
        },
        {
          term: "Z → A",
          description: "ordena os mesmos itens em ordem decrescente.",
        },
        {
          term: "Números no texto",
          description:
            "são ordenados naturalmente, então Item 2 aparece antes de Item 10.",
        },
      ],
      commonUsesHeading: "Usos comuns",
      commonUsesIntro: "Organizar em ordem alfabética é útil para:",
      commonUsesItems: [
        "listas de nomes e participantes",
        "palavras e vocabulário",
        "palavras-chave e tags",
        "nomes de produtos ou rótulos",
        "colunas copiadas do Excel ou Google Sheets",
      ],
      dataHeading: "Como seus dados são processados",
      dataParagraph:
        "A ordenação acontece inteiramente no seu navegador. A lista colada e o resultado não são enviados para um servidor para processamento.",
      dataItems: [
        "Espaços no começo e no fim só são removidos quando a opção correspondente está ativada.",
        "Linhas vazias só são removidas quando essa opção está ativada.",
        "Copiar acessa a área de transferência somente depois do seu clique.",
        "Baixar cria um arquivo de texto local somente depois do seu clique.",
      ],
      dataLinkLabel: "Veja todos os detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "A ordenação remove itens duplicados?",
          answer:
            "Não. Linhas repetidas permanecem no resultado e apenas mudam de posição na ordem alfabética.",
        },
        {
          question: "Como letras acentuadas são ordenadas?",
          answer:
            "A página usa as regras de ordenação do navegador para português do Brasil, incluindo caracteres acentuados usados no idioma.",
        },
        {
          question: "A ferramenta entende números dentro do texto?",
          answer:
            "Sim. A ordenação numérica faz, por exemplo, Item 2 aparecer antes de Item 10.",
        },
        {
          question: "Posso ordenar uma coluna do Excel ou Google Sheets?",
          answer:
            "Sim. Copie uma coluna e cole com um valor por linha.",
        },
        {
          question: "Minha lista é enviada para um servidor?",
          answer:
            "Não. A ordenação acontece localmente no seu navegador e o conteúdo não é enviado para processamento.",
        },
      ],
    },
  },
  randomizeList: {
    page: {
      heading: "Embaralhar lista",
      description:
        "Embaralhe nomes, palavras ou qualquer lista por linhas para criar uma nova ordem aleatória.",
      privacy: "O processamento acontece localmente no seu navegador.",
    },
    tool: {
      heading: "Embaralhar lista",
      listLabel: "Lista",
      pastePlaceholder: "Cole um item por linha",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example: "Maçã\nPera\nCereja\nAmeixa\nUva",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir a lista atual? O conteúdo atual será perdido.",
      options: "Opções",
      trimWhitespace: "Remover espaços ao redor",
      ignoreEmptyLines: "Ignorar linhas vazias",
      randomize: "Embaralhar",
      resultLabel: "Lista embaralhada",
      item: "item",
      items: "itens",
      emptyResult: "Cole uma lista para criar uma ordem aleatória.",
      readyResult: "Selecione Embaralhar para misturar a lista atual.",
      noEffectiveItems: "Nenhum item permanece com as opções atuais.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      noscript:
        "JavaScript é necessário para embaralhar uma lista. O conteúdo é processado localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como embaralhar uma lista",
      howToSteps: [
        "Cole um item por linha.",
        "Ajuste espaços ou linhas vazias, se necessário.",
        "Selecione Embaralhar para criar uma nova ordem aleatória.",
        "Embaralhe novamente ou copie e baixe o resultado que quiser manter.",
      ],
      resultsHeading: "Como funciona a ordem aleatória",
      resultsIntro:
        "A ferramenta usa um embaralhamento Fisher–Yates diretamente no navegador. Cada ocorrência processada permanece no resultado, inclusive itens duplicados.",
      resultsItems: [
        {
          term: "Embaralhar",
          description:
            "cria uma nova permutação aleatória da lista sempre que você aciona o botão.",
        },
        {
          term: "Itens repetidos",
          description: "permanecem como ocorrências separadas no resultado.",
        },
      ],
      commonUsesHeading: "Usos comuns para uma lista embaralhada",
      commonUsesIntro: "Uma ordem aleatória pode ser útil para:",
      commonUsesItems: [
        "nomes e participantes",
        "perguntas e atividades",
        "tarefas",
        "palavras e vocabulário",
        "colunas copiadas do Excel ou Google Sheets",
      ],
      dataHeading: "Como seus dados são processados",
      dataParagraph:
        "O embaralhamento acontece inteiramente no seu navegador. A lista e o resultado não são enviados para um servidor para processamento.",
      dataItems: [
        "Espaços ao redor só são removidos quando a opção correspondente está ativada.",
        "Linhas vazias só são removidas quando essa opção está ativada.",
        "Copiar acessa a área de transferência somente depois do seu clique.",
        "Baixar cria um arquivo de texto local somente depois do seu clique.",
      ],
      dataLinkLabel: "Veja todos os detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "A ferramenta remove duplicados?",
          answer:
            "Não. Cada linha permanece como uma ocorrência separada na lista embaralhada.",
        },
        {
          question: "Toda nova ordem será diferente?",
          answer:
            "Não necessariamente. O acaso pode produzir a mesma ordem, principalmente em listas curtas.",
        },
        {
          question: "A lista muda de ordem enquanto eu digito?",
          answer:
            "Não. Uma nova ordem só é criada quando você seleciona Embaralhar.",
        },
        {
          question: "Posso embaralhar nomes copiados de uma planilha?",
          answer:
            "Sim. Cole uma coluna com um valor por linha.",
        },
        {
          question: "Minha lista é enviada para um servidor?",
          answer:
            "Não. O embaralhamento acontece localmente no seu navegador e a lista não é enviada para processamento.",
        },
      ],
    },
  },
  removeDuplicateLines: {
    page: {
      heading: "Remover linhas duplicadas",
      description:
        "Remova linhas repetidas mantendo a primeira ocorrência e a ordem original.",
      privacy: "O processamento acontece localmente no seu navegador.",
    },
    tool: {
      heading: "Remover linhas duplicadas",
      listLabel: "Lista",
      pastePlaceholder: "Cole um item por linha",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example: "Maçã\nBanana\nMaçã\nCereja\nbanana",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir o texto atual? O conteúdo atual será perdido.",
      options: "Opções",
      trimWhitespace: "Remover espaços ao redor",
      ignoreEmptyLines: "Ignorar linhas vazias",
      ignoreCase: "Ignorar maiúsculas e minúsculas",
      resultLabel: "Linhas únicas",
      item: "item",
      items: "itens",
      emptyResult: "Cole um texto ou lista para remover linhas duplicadas.",
      noEffectiveItems: "Nenhuma linha permanece com as opções atuais.",
      input: "Entrada",
      unique: "Únicas",
      removed: "Removidas",
      copy: "Copiar",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      noscript:
        "JavaScript é necessário para remover linhas duplicadas. O processamento acontece localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como remover linhas duplicadas",
      howToSteps: [
        "Cole um texto ou lista com um item por linha.",
        "Ajuste espaços, linhas vazias ou maiúsculas e minúsculas, se necessário.",
        "As linhas duplicadas são removidas automaticamente e a primeira ocorrência é mantida.",
        "Confira as linhas únicas e copie ou baixe o resultado.",
      ],
      resultsHeading: "Como funciona a remoção de duplicados",
      resultsIntro:
        "As linhas são processadas de cima para baixo. A primeira ocorrência de cada valor é mantida, repetições posteriores são removidas e a ordem original é preservada.",
      resultsItems: [
        {
          term: "Entrada",
          description:
            "conta as linhas processadas antes da remoção de duplicados.",
        },
        {
          term: "Únicas",
          description: "conta as linhas mantidas no resultado.",
        },
        {
          term: "Removidas",
          description: "mostra quantas repetições foram retiradas.",
        },
      ],
      commonUsesHeading: "Usos comuns",
      commonUsesIntro: "Remover duplicados é útil para:",
      commonUsesItems: [
        "palavras-chave e termos de busca",
        "IDs e valores de referência",
        "URLs e domínios",
        "nomes e rótulos",
        "colunas copiadas do Excel ou Google Sheets",
      ],
      dataHeading: "Como seus dados são processados",
      dataParagraph:
        "A remoção de duplicados acontece inteiramente no seu navegador. As linhas coladas e o resultado não são enviados para processamento.",
      dataItems: [
        "Espaços ao redor são removidos antes da comparação somente quando a opção está ativada.",
        "Linhas vazias são ignoradas somente quando a opção está ativada.",
        "Ignorar maiúsculas e minúsculas altera apenas a identidade usada para detectar duplicados; o texto da primeira linha mantida é preservado.",
        "Copiar e Baixar exportam o resultado somente depois da sua ação.",
      ],
      dataLinkLabel: "Veja todos os detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "Qual linha duplicada é mantida?",
          answer:
            "A primeira ocorrência é mantida. Linhas posteriores com a mesma identidade de comparação são removidas.",
        },
        {
          question: "É possível ignorar maiúsculas e minúsculas?",
          answer:
            "Sim. Maçã e maçã podem ser tratadas como duplicadas, preservando a escrita da primeira ocorrência mantida.",
        },
        {
          question: "A ordem original é mantida?",
          answer:
            "Sim. A ferramenta não ordena a lista; ela mantém a ordem das primeiras ocorrências.",
        },
        {
          question: "Posso remover duplicados de uma coluna de planilha?",
          answer:
            "Sim. Cole uma coluna com um valor por linha.",
        },
        {
          question: "Meu texto é enviado para um servidor?",
          answer:
            "Não. A remoção de duplicados acontece localmente no seu navegador e o texto não é enviado para processamento.",
        },
      ],
    },
  },
  header: {
    ariaLabel: "Navegação principal",
    tools: "Ferramentas",
    about: "Sobre",
    language: "Idioma",
  },
  editorial: {
    howToHeading: "Como comparar duas listas",
    howToSteps: [
      "Cole a primeira lista em Lista A.",
      "Cole a segunda lista em Lista B.",
      "Ajuste as opções de comparação, se necessário.",
      "Confira Diferenças, Só A, Só B, Correspondências ou Todos e copie ou baixe o resultado desejado.",
    ],
    resultsHeading: "O que significam os resultados da comparação",
    resultsIntro:
      "As visualizações mostram a mesma comparação por ângulos diferentes. Os resultados mantêm a ordem das listas originais e nunca são ordenados automaticamente.",
    resultsItems: [
      {
        term: "Diferenças",
        description: "itens que aparecem em apenas uma das duas listas.",
      },
      {
        term: "Só A",
        description:
          "itens ou ocorrências da Lista A sem par correspondente na Lista B.",
      },
      {
        term: "Só B",
        description:
          "itens ou ocorrências da Lista B sem par correspondente na Lista A.",
      },
      {
        term: "Correspondências",
        description:
          "itens encontrados nas duas listas, exibidos na ordem da Lista A.",
      },
      {
        term: "Todos",
        description:
          "a Lista A seguida pelos valores da Lista B que ainda não estão representados.",
      },
    ],
    commonUsesHeading: "Usos comuns para comparar listas",
    commonUsesIntro: "A comparação pode ser usada para:",
    commonUsesItems: [
      "endereços de e-mail",
      "IDs de clientes ou pedidos",
      "URLs",
      "listas de produtos ou SKUs",
      "palavras-chave e nomes",
      "colunas copiadas do Excel ou Google Sheets",
    ],
    dataHeading: "Como seus dados são processados",
    dataParagraph:
      "A comparação acontece inteiramente no seu navegador. As listas originais e os resultados não são enviados a um servidor para processamento.",
    dataItems: [
      "As opções alteram as regras de correspondência sem reescrever o texto original exibido nos resultados.",
      "Copiar acessa a área de transferência somente depois do seu clique.",
      "Baixar cria um arquivo de texto local no seu dispositivo.",
      "O site não salva suas listas em cookies, localStorage ou sessionStorage.",
      "Entradas e resultados brutos não são incluídos em eventos de analytics nem em logs do aplicativo.",
    ],
    dataLinkLabel: "Veja todos os detalhes na página de Privacidade.",
    faqHeading: "Perguntas frequentes",
    faqItems: [
      {
        question: "Posso comparar duas listas com duplicados?",
        answer:
          "Sim. Remover duplicados fica ativado por padrão. Desative a opção se quiser comparar ocorrências repetidas separadamente.",
      },
      {
        question: "A comparação diferencia maiúsculas e minúsculas?",
        answer:
          "Sim, por padrão. Ignorar maiúsculas e minúsculas permite combinar variações sem alterar o texto original.",
      },
      {
        question: "O que faz Ignorar espaços ao redor?",
        answer:
          "A opção ignora espaços e tabulações no começo e no fim da linha ao buscar correspondências, mas preserva o texto original nos resultados.",
      },
      {
        question: "Posso comparar colunas do Excel ou Google Sheets?",
        answer:
          "Sim. Cole uma coluna em cada lista; cada linha é tratada como um item.",
      },
      {
        question: "Minhas listas são enviadas para um servidor?",
        answer:
          "Não. A comparação acontece localmente no seu navegador. O conteúdo não é enviado para processamento nem salvo pelo site.",
      },
    ],
  },
  about: {
    heading: "Sobre o ListContrast",
    paragraphs: [
      "ListContrast é uma pequena coleção de ferramentas de navegador para trabalhar com listas por linhas.",
      "Você pode comparar duas listas, organizá-las em ordem alfabética, embaralhá-las ou remover linhas duplicadas.",
      "As ferramentas não exigem conta e processam o conteúdo localmente no seu navegador. Suas listas não são enviadas para processamento nem salvas pelo site.",
    ],
    toolLinkLabel: "Ver ferramentas de listas",
  },
  privacy: {
    heading: "Privacidade",
    intro:
      "Esta página explica como o ListContrast trata dados em suas ferramentas de listas. Ela reflete a versão atual do site e será atualizada antes que qualquer serviço com impacto sobre privacidade seja ativado.",
    sections: [
      {
        heading: "Conteúdo das listas",
        paragraphs: [
          "O texto bruto das listas e os resultados são processados inteiramente no seu navegador. O conteúdo das listas não entra em requisições de rede usadas para processamento e não é armazenado em banco de dados, cookies, localStorage ou sessionStorage.",
          "Copiar coloca o resultado atual na área de transferência do sistema somente depois do seu clique. Baixar cria um arquivo de texto local no seu dispositivo somente depois do seu clique.",
        ],
      },
      {
        heading: "Requisições do site",
        paragraphs: [
          "Como qualquer site, o ListContrast é servido por uma hospedagem estática. Ao abrir uma página, o provedor pode receber metadados comuns da requisição, como endereço IP, user agent e caminho solicitado. O conteúdo colado nas ferramentas não faz parte dessas requisições.",
        ],
      },
      {
        heading: "Publicidade e analytics",
        paragraphs: [
          "A versão atual não usa scripts de publicidade, replay de sessão nem um provedor de analytics de produto em produção. Entradas e resultados brutos nunca são incluídos em eventos de analytics nem em logs do aplicativo.",
        ],
      },
      {
        heading: "Alterações nesta página",
        paragraphs: [
          "Se serviços com impacto sobre privacidade forem adicionados no futuro, esta página será atualizada antes que eles sejam ativados.",
        ],
      },
    ],
    toolLinkLabel: "Ver ferramentas de listas",
  },
  footer: {
    ariaLabel: "Rodapé",
    compareLists: "Comparar listas",
    alphabetizer: "Ordem alfabética",
    randomizer: "Embaralhar lista",
    duplicateLines: "Remover duplicados",
    about: "Sobre",
    privacy: "Privacidade",
  },
  metadata: {
    home: {
      title: "Comparar listas online – Diferenças e correspondências | ListContrast",
      description:
        "Compare duas listas online para encontrar diferenças, correspondências e itens exclusivos. Grátis e processado localmente no navegador.",
    },
    alphabetizeList: {
      title: "Ordem alfabética online – Organizar lista | ListContrast",
      description:
        "Coloque uma lista em ordem alfabética online de A a Z ou Z a A. Nomes, palavras e listas são processados localmente no navegador.",
    },
    randomizeList: {
      title: "Embaralhar lista online – Ordem aleatória | ListContrast",
      description:
        "Embaralhe uma lista online para criar uma ordem aleatória. Cole um item por linha, embaralhe e copie ou baixe o resultado.",
    },
    removeDuplicateLines: {
      title: "Remover linhas duplicadas online | ListContrast",
      description:
        "Remova linhas duplicadas mantendo a primeira ocorrência e a ordem original. Processe o texto localmente no seu navegador.",
    },
    tools: {
      title: "Ferramentas de listas | ListContrast",
      description:
        "Ferramentas online para comparar, ordenar, embaralhar e limpar listas por linhas diretamente no navegador.",
    },
    about: {
      title: "Sobre o ListContrast",
      description:
        "Conheça o ListContrast e suas ferramentas de navegador para comparar, ordenar, embaralhar e limpar listas.",
    },
    privacy: {
      title: "Privacidade | ListContrast",
      description:
        "Saiba como o ListContrast processa listas localmente no navegador e trata requisições comuns do site.",
    },
    notFound: {
      title: "Página não encontrada | ListContrast",
      description:
        "A página solicitada do ListContrast não foi encontrada. Veja as ferramentas de listas disponíveis.",
    },
  },
  notFoundPage: {
    heading: "Página não encontrada",
    explanation: "A página que você procura não existe ou foi movida.",
    toolLinkLabel: "Ver ferramentas de listas",
  },
  toolsPage: {
    heading: "Ferramentas de listas",
    intro:
      "Ferramentas focadas para comparar, ordenar, embaralhar e limpar listas por linhas diretamente no navegador.",
    ariaLabel: "Ferramentas de listas disponíveis",
    items: {
      home: {
        label: "Comparar listas",
        description:
          "Encontrar diferenças, correspondências e valores exclusivos entre duas listas.",
      },
      alphabetizeList: {
        label: "Ordem alfabética",
        description: "Organizar uma lista de A a Z ou de Z a A.",
      },
      randomizeList: {
        label: "Embaralhar lista",
        description: "Reorganizar uma lista em uma ordem aleatória.",
      },
      removeDuplicateLines: {
        label: "Remover linhas duplicadas",
        description:
          "Remover linhas repetidas mantendo a primeira ocorrência.",
      },
    },
  },
  relatedTools: {
    heading: "Ferramentas relacionadas",
    byPage: {
      home: [
        related("alphabetizeList", "Ordem alfabética", "Organizar uma lista alfabeticamente."),
        related("randomizeList", "Embaralhar lista", "Reorganizar uma lista aleatoriamente."),
        related("removeDuplicateLines", "Remover duplicados", "Retirar linhas repetidas."),
      ],
      alphabetizeList: [
        related("home", "Comparar listas", "Encontrar diferenças e correspondências entre duas listas."),
        related("randomizeList", "Embaralhar lista", "Reorganizar uma lista aleatoriamente."),
        related("removeDuplicateLines", "Remover duplicados", "Retirar linhas repetidas."),
      ],
      randomizeList: [
        related("home", "Comparar listas", "Encontrar diferenças e correspondências entre duas listas."),
        related("alphabetizeList", "Ordem alfabética", "Organizar uma lista alfabeticamente."),
        related("removeDuplicateLines", "Remover duplicados", "Retirar linhas repetidas."),
      ],
      removeDuplicateLines: [
        related("home", "Comparar listas", "Encontrar diferenças e correspondências entre duas listas."),
        related("alphabetizeList", "Ordem alfabética", "Organizar uma lista alfabeticamente."),
        related("randomizeList", "Embaralhar lista", "Reorganizar uma lista aleatoriamente."),
      ],
    },
  },
} satisfies LocaleContent;
