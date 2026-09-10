import type { ExpansionLocaleContent } from "./types";

const privacy = "O processamento é feito localmente no seu navegador.";
const dataItems = [
  "O conteúdo colado não é enviado para processamento.",
  "A área de transferência só é usada depois que você clica em Copiar.",
  "O download cria um arquivo de texto local somente quando você solicita.",
] as const;

export const brazilianPortugueseExpansionContent = {
  homePatch: {
    description:
      "Compare duas listas para encontrar diferenças, itens em comum, itens exclusivos, interseção e união diretamente no navegador.",
    metadata: {
      title: "Comparar listas online – diferenças e itens em comum | ListContrast",
      description:
        "Compare duas listas online e encontre diferenças, itens em comum, itens exclusivos, interseção e união. Grátis e processado localmente.",
    },
    editorial: {
      resultsHeading: "Entenda os resultados da comparação de listas",
      resultsIntro:
        "As visualizações mostram a mesma comparação por ângulos diferentes e mantêm a ordem original. Com a remoção de duplicados ativada, os resultados correspondem a operações de conjuntos conhecidas; mantendo duplicados, cada ocorrência repetida é comparada separadamente.",
      resultsItems: [
        {
          term: "Diferenças",
          description:
            "itens que aparecem em apenas uma lista; sem duplicados, corresponde à diferença simétrica.",
        },
        {
          term: "Somente A",
          description:
            "itens ou ocorrências da Lista A sem par na Lista B; sem duplicados, corresponde a A − B.",
        },
        {
          term: "Somente B",
          description:
            "itens ou ocorrências da Lista B sem par na Lista A; sem duplicados, corresponde a B − A.",
        },
        {
          term: "Em ambas",
          description:
            "itens encontrados nas duas listas; sem duplicados, corresponde à interseção.",
        },
        {
          term: "Todos",
          description:
            "Lista A seguida dos valores de B ainda não representados; sem duplicados, corresponde à união.",
        },
      ],
      commonUsesItems: [
        "e-mails, nomes e listas de participantes",
        "IDs, SKUs e listas de produtos",
        "URLs, palavras-chave e tags",
        "colunas copiadas do Excel ou Google Sheets",
        "exportações de dois sistemas para encontrar registros ausentes",
        "inventários ou exportações antigos e novos para reconciliação",
      ],
    },
  },
  randomTeamGenerator: {
    page: {
      heading: "Sorteador de Times e Equipes",
      description:
        "Cole nomes, escolha o número de times ou pessoas por time e divida a lista em equipes aleatórias e equilibradas.",
      privacy,
    },
    tool: {
      heading: "Sortear times",
      listLabel: "Participantes ou itens",
      pastePlaceholder: "Um participante ou item por linha",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example: "Ana\nBruno\nCarla\nDiego\nElisa\nFelipe\nGabriela\nHugo",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir a lista atual? O conteúdo atual será perdido.",
      participant: "participante",
      participants: "participantes",
      modeLabel: "Configuração dos grupos",
      numberOfTeams: "Número de times",
      peoplePerTeam: "Pessoas por time",
      valueLabel: "Valor",
      generate: "Sortear times",
      reroll: "Sortear novamente",
      resultLabel: "Times sorteados",
      team: "Time",
      copy: "Copiar tudo",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      emptyResult: "Adicione pelo menos dois itens para sortear os times.",
      invalidValue: "Digite um número inteiro positivo.",
      tooManyTeams: "O número de times não pode ser maior que o número de itens.",
      noscript:
        "JavaScript é necessário para sortear os times. A lista é processada localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como sortear times aleatórios",
      howToSteps: [
        "Cole um nome ou item por linha.",
        "Escolha Número de times ou Pessoas por time.",
        "Digite um inteiro positivo e selecione Sortear times.",
        "Copie os grupos ou sorteie novamente para obter outra divisão.",
      ],
      resultsHeading: "Como os times são equilibrados",
      resultsIntro:
        "A lista é embaralhada no navegador e distribuída da forma mais equilibrada possível. Cada ocorrência válida é usada exatamente uma vez.",
      resultsItems: [
        {
          term: "Número de times",
          description:
            "cria exatamente essa quantidade de grupos, com diferença de no máximo uma pessoa entre os tamanhos.",
        },
        {
          term: "Pessoas por time",
          description:
            "usa o valor como tamanho máximo desejado, calcula quantos grupos são necessários e os equilibra.",
        },
        {
          term: "Nomes repetidos",
          description:
            "continuam como ocorrências separadas, pois duas pessoas podem ter o mesmo nome.",
        },
      ],
      commonUsesHeading: "Usos comuns",
      commonUsesIntro: "Times aleatórios são úteis para:",
      commonUsesItems: [
        "turmas e grupos de estudo",
        "workshops e grupos de discussão",
        "jogos e esportes recreativos",
        "dinâmicas de escritório e eventos",
      ],
      dataHeading: "Sorteio privado no navegador",
      dataParagraph: "O embaralhamento e a divisão acontecem inteiramente no navegador.",
      dataItems,
      dataLinkLabel: "Veja mais detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "Os times ficam com o mesmo tamanho?",
          answer:
            "Eles ficam o mais equilibrados possível. Quando a divisão não é exata, os tamanhos diferem em no máximo uma pessoa.",
        },
        {
          question: "Posso escolher o tamanho do grupo em vez da quantidade de times?",
          answer:
            "Sim. Use Pessoas por time e a ferramenta criará grupos suficientes para não ultrapassar esse tamanho desejado.",
        },
        {
          question: "Duas pessoas podem ter o mesmo nome?",
          answer: "Sim. Linhas repetidas são mantidas como ocorrências diferentes.",
        },
        {
          question: "Os nomes são enviados para algum servidor?",
          answer: "Não. O sorteio acontece localmente no seu navegador.",
        },
      ],
    },
  },
  randomPairGenerator: {
    page: {
      heading: "Sorteador de Duplas",
      description:
        "Cole nomes ou itens e forme duplas aleatórias; se a quantidade for ímpar, o item restante aparece claramente.",
      privacy,
    },
    tool: {
      heading: "Sortear duplas",
      listLabel: "Participantes ou itens",
      pastePlaceholder: "Um participante ou item por linha",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example: "Ana\nBruno\nCarla\nDiego\nElisa\nFelipe\nGabriela",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir a lista atual? O conteúdo atual será perdido.",
      item: "item",
      items: "itens",
      generate: "Sortear duplas",
      reroll: "Sortear novamente",
      resultLabel: "Duplas sorteadas",
      pair: "Dupla",
      unpaired: "Sem dupla",
      copy: "Copiar tudo",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      emptyResult: "Adicione pelo menos um item para sortear as duplas.",
      noscript:
        "JavaScript é necessário para sortear as duplas. A lista é processada localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como formar duplas aleatórias",
      howToSteps: [
        "Cole um nome ou item por linha.",
        "Selecione Sortear duplas.",
        "Confira as duplas e, se houver, o item Sem dupla.",
        "Copie o resultado ou faça um novo sorteio.",
      ],
      resultsHeading: "Como funciona o sorteio de duplas",
      resultsIntro:
        "A ferramenta embaralha todas as ocorrências válidas e percorre a lista sorteada de dois em dois.",
      resultsItems: [
        { term: "Quantidade par", description: "cada item entra em uma dupla." },
        {
          term: "Quantidade ímpar",
          description: "são formadas todas as duplas possíveis e um item fica Sem dupla.",
        },
        {
          term: "Nomes repetidos",
          description: "são preservados como ocorrências separadas e não são removidos.",
        },
      ],
      commonUsesHeading: "Usos comuns",
      commonUsesIntro: "Duplas aleatórias funcionam bem para:",
      commonUsesItems: [
        "duplas de estudo",
        "exercícios em workshops",
        "entrevistas ou revisões em dupla",
        "jogos e atividades práticas",
      ],
      dataHeading: "Sorteio de duplas privado no navegador",
      dataParagraph: "A formação das duplas acontece inteiramente no seu navegador.",
      dataItems,
      dataLinkLabel: "Veja mais detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "O que acontece com uma quantidade ímpar de nomes?",
          answer:
            "A ferramenta cria todas as duplas possíveis e marca o item restante como Sem dupla.",
        },
        {
          question: "Sortear novamente evita duplas anteriores?",
          answer:
            "Não. Cada sorteio é independente e nenhum histórico de duplas é salvo.",
        },
        {
          question: "Nomes repetidos são removidos?",
          answer: "Não. Cada ocorrência válida é mantida.",
        },
        {
          question: "Meus nomes são enviados?",
          answer: "Não. O sorteio acontece localmente no navegador.",
        },
      ],
    },
  },
  removeLineBreaks: {
    page: {
      heading: "Remover Quebras de Linha",
      description:
        "Remova quebras de linha indesejadas, mantenha parágrafos ou substitua cada quebra por outro separador.",
      privacy,
    },
    tool: {
      heading: "Remover ou substituir quebras de linha",
      textLabel: "Texto",
      pastePlaceholder: "Cole um texto com quebras de linha indesejadas",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example:
        "Este parágrafo foi copiado\ncom quebras de linha duras\nque devem virar espaços.\n\nEste segundo parágrafo\ndeve continuar separado.",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir o texto atual? O conteúdo atual será perdido.",
      options: "Opções",
      replaceWith: "Substituir quebras de linha por",
      separatorSpace: "Espaço",
      separatorNothing: "Nada",
      separatorComma: "Vírgula",
      separatorCommaSpace: "Vírgula + espaço",
      separatorSemicolon: "Ponto e vírgula",
      separatorCustom: "Personalizado",
      customSeparator: "Separador personalizado",
      keepParagraphs: "Manter quebras de parágrafo",
      trimEachLine: "Remover espaços nas bordas de cada linha",
      collapseSpaces: "Reduzir espaços repetidos",
      resultLabel: "Texto limpo",
      emptyResult: "Cole um texto para ver o resultado limpo.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      noscript:
        "JavaScript é necessário para remover quebras de linha. O texto é processado localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como remover quebras de linha",
      howToSteps: [
        "Cole o texto com quebras de linha indesejadas.",
        "Escolha o que deve substituir cada quebra.",
        "Mantenha os parágrafos se linhas vazias precisarem continuar separando blocos.",
        "Copie ou baixe o texto limpo.",
      ],
      resultsHeading: "Quebras de linha, novas linhas e parágrafos",
      resultsIntro:
        "A ferramenta normaliza primeiro finais de linha do Windows, Unix e retornos de carro antigos, depois aplica a substituição escolhida.",
      resultsItems: [
        {
          term: "Espaço",
          description: "é o padrão seguro para recompor texto sem colar palavras vizinhas.",
        },
        {
          term: "Manter quebras de parágrafo",
          description:
            "une quebras simples dentro de cada parágrafo e preserva blocos separados por linhas vazias.",
        },
        {
          term: "Personalizado",
          description: "permite substituir novas linhas por qualquer separador curto.",
        },
      ],
      commonUsesHeading: "Usos comuns",
      commonUsesIntro: "Remover quebras de linha ajuda com texto copiado de:",
      commonUsesItems: [
        "documentos PDF",
        "e-mails e páginas da web",
        "documentos do Word e comentários",
        "OCR ou extração de texto",
      ],
      dataHeading: "Limpeza privada no navegador",
      dataParagraph: "A transformação do texto acontece inteiramente no seu navegador.",
      dataItems,
      dataLinkLabel: "Veja mais detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "Posso remover novas linhas e manter os parágrafos?",
          answer:
            "Sim. Ative Manter quebras de parágrafo para preservar blocos separados por linhas vazias.",
        },
        {
          question: "Posso substituir quebras de linha por vírgulas?",
          answer:
            "Sim. Escolha Vírgula, Vírgula + espaço ou informe um separador personalizado.",
        },
        {
          question: "Funciona com finais de linha do Windows e Unix?",
          answer: "Sim. LF, CRLF e CR são normalizados antes da transformação.",
        },
        {
          question: "Meu texto é enviado?",
          answer: "Não. A transformação é feita localmente no navegador.",
        },
      ],
    },
  },
  columnToCommaSeparatedList: {
    page: {
      heading: "Coluna para Lista Separada por Vírgulas",
      description:
        "Converta uma coluna com um item por linha em uma lista separada por vírgulas ou escolha outro delimitador.",
      privacy,
    },
    tool: {
      heading: "Converter coluna em lista delimitada",
      listLabel: "Coluna",
      pastePlaceholder: "Um item por linha",
      clear: "Limpar",
      loadExample: "Testar exemplo",
      example: "maçã\nbanana\ncereja",
      replaceExampleConfirmation:
        "Carregar o exemplo e substituir a coluna atual? O conteúdo atual será perdido.",
      options: "Opções",
      trimWhitespace: "Remover espaços ao redor",
      ignoreEmptyLines: "Ignorar linhas vazias",
      separator: "Separador",
      separatorCommaSpace: "Vírgula + espaço",
      separatorComma: "Vírgula",
      separatorSemicolon: "Ponto e vírgula",
      separatorPipe: "Barra vertical",
      separatorTab: "Tabulação",
      separatorCustom: "Personalizado",
      customSeparator: "Separador personalizado",
      resultLabel: "Lista convertida",
      item: "item",
      items: "itens",
      emptyResult: "Cole uma coluna para ver a lista convertida.",
      copy: "Copiar",
      copied: "Copiado",
      download: "Baixar",
      copyError: "Não foi possível copiar. Selecione o resultado manualmente.",
      noscript:
        "JavaScript é necessário para converter a coluna. A lista é processada localmente no seu navegador.",
    },
    editorial: {
      howToHeading: "Como converter uma coluna em lista separada por vírgulas",
      howToSteps: [
        "Cole um valor por linha.",
        "Mantenha Vírgula + espaço ou escolha outro separador.",
        "Ajuste espaços e linhas vazias se necessário.",
        "Copie ou baixe o resultado em uma única linha.",
      ],
      resultsHeading: "Como a coluna é convertida",
      resultsIntro:
        "Cada linha processada continua sendo um valor separado, na mesma ordem, e o delimitador escolhido é inserido entre os valores.",
      resultsItems: [
        {
          term: "Vírgula + espaço",
          description: "gera por padrão uma lista separada por vírgulas fácil de ler.",
        },
        {
          term: "Outros separadores",
          description:
            "incluem vírgula, ponto e vírgula, barra vertical, tabulação e um valor personalizado.",
        },
        {
          term: "Duplicados",
          description:
            "são preservados porque esta ferramenta formata a lista em vez de remover repetições.",
        },
      ],
      commonUsesHeading: "Usos comuns",
      commonUsesIntro: "A conversão de coluna é útil para:",
      commonUsesItems: [
        "colunas copiadas do Excel ou Google Sheets",
        "IDs, nomes, URLs e palavras-chave",
        "valores separados por vírgulas para formulários ou filtros",
        "texto delimitado por ponto e vírgula, barra vertical ou tabulação",
      ],
      dataHeading: "Formatação privada no navegador",
      dataParagraph: "A conversão da coluna acontece inteiramente no seu navegador.",
      dataItems,
      dataLinkLabel: "Veja mais detalhes na página de Privacidade.",
      faqHeading: "Perguntas frequentes",
      faqItems: [
        {
          question: "Posso usar um separador diferente de vírgula?",
          answer:
            "Sim. Escolha ponto e vírgula, barra vertical, tabulação ou informe um separador personalizado.",
        },
        {
          question: "Os valores duplicados são removidos?",
          answer: "Não. Linhas repetidas permanecem na ordem original.",
        },
        {
          question: "Posso manter os espaços ao redor dos valores?",
          answer:
            "Sim. Desative Remover espaços ao redor para mantê-los exatamente como foram colados.",
        },
        {
          question: "Minha coluna é enviada?",
          answer: "Não. A conversão é feita localmente no navegador.",
        },
      ],
    },
  },
  metadata: {
    randomTeamGenerator: {
      title: "Sorteador de Times e Equipes Online | ListContrast",
      description:
        "Cole nomes, escolha número de times ou pessoas por time e sorteie equipes aleatórias equilibradas. Tudo localmente no navegador.",
    },
    randomPairGenerator: {
      title: "Sorteador de Duplas Online – Duplas Aleatórias | ListContrast",
      description:
        "Forme duplas aleatórias a partir de nomes ou itens. Listas ímpares são tratadas claramente e tudo roda localmente no navegador.",
    },
    removeLineBreaks: {
      title: "Remover Quebras de Linha Online – Manter Parágrafos | ListContrast",
      description:
        "Remova quebras de linha, mantenha parágrafos ou substitua novas linhas por um separador. Processamento local no navegador.",
    },
    columnToCommaSeparatedList: {
      title: "Coluna para Lista Separada por Vírgulas | ListContrast",
      description:
        "Converta uma coluna em lista separada por vírgulas, ponto e vírgula, barra vertical, tabulação ou delimitador personalizado.",
    },
  },
  toolsPageItems: {
    randomTeamGenerator: {
      label: "Sorteador de Times",
      description: "Divida nomes ou itens em times aleatórios equilibrados.",
    },
    randomPairGenerator: {
      label: "Sorteador de Duplas",
      description: "Forme duplas aleatórias e trate claramente um item restante.",
    },
    removeLineBreaks: {
      label: "Remover Quebras de Linha",
      description: "Una texto quebrado e mantenha parágrafos quando necessário.",
    },
    columnToCommaSeparatedList: {
      label: "Coluna para Lista por Vírgulas",
      description: "Transforme uma coluna de linhas em uma lista delimitada.",
    },
  },
  aboutParagraphs: [
    "ListContrast é uma coleção focada de ferramentas no navegador para comparar, organizar, embaralhar, limpar e formatar listas baseadas em linhas.",
    "O conjunto inclui comparação de listas, ordem alfabética, embaralhamento, remoção de duplicados, sorteio de times e duplas, limpeza de quebras de linha e conversão de colunas em listas delimitadas.",
    "As ferramentas foram feitas para tarefas rápidas, sem conta e sem processamento em servidor do conteúdo que você cola.",
  ],
} satisfies ExpansionLocaleContent;
