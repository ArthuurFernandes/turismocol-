/* Desvenda Colatina — conteúdo de exemplo. Textos, horários e coordenadas a validar com a Secretaria de Turismo. */
(function (root) {
  const PONTOS = [
    {
      id: "cristo", tipo: "ponto", nome: "Cristo Redentor", bairro: "Bela Vista",
      lat: -19.5364644, lng: -40.6245728, raio: 150,
      pista: "Do alto, ele abraça a cidade inteira e vê o Rio Doce de ponta a ponta.",
      horario: "Seg a sex, 8h às 16h · sáb, dom e feriados, 14h às 17h (a confirmar)",
      aviso: "Subida íngreme. Leve água e evite o sol do meio-dia.",
      fotos: [],
      historia: ["Inaugurado em 1975, o Cristo Redentor de Colatina tem cerca de 35,5 metros de altura e é a mais alta das três imagens do Cristo no Espírito Santo. A obra é do artista capixaba Antônio Francisco Moreira, de Guaçuí.",
        "Fica no alto do bairro Bela Vista e virou um dos cartões-postais da cidade, ao lado do pôr do sol e do Rio Doce. Do mirante, vê-se o Centro inteiro.",
        "Em 2025, foi eleito pela população uma das Maravilhas de Colatina."],
      linha: [["1975", "Inauguração do monumento"], ["2025", "Eleito uma das Maravilhas de Colatina"]],
      perto: [["Colatina Shopping", "Shopping", 330], ["Bob's", "Lanchonete", 330], ["Liverpub Music Place", "Bar", 320]],
      fontes: [["A Gazeta, 2021", "https://www.agazeta.com.br/capixapedia/artista-capixaba-fez-as-tres-imagens-do-cristo-redentor-no-es-0521"]],
      codigo: "CRISTO26", colecionavel: { nome: "Vista do Mirante", icone: "⛰️" }
    },
    {
      id: "catedral", tipo: "ponto", nome: "Catedral Sagrado Coração de Jesus", bairro: "Centro",
      lat: -19.5374953, lng: -40.6305215, raio: 150,
      pista: "Sua torre marca as horas no coração do Centro desde os anos 1950.",
      horario: "Todos os dias, 6h às 21h (a confirmar com a Diocese)",
      aviso: "Silêncio durante as missas.",
      fotos: [{ src: "catedralfora.jpg", cap: "Fachada da Catedral" }],
      historia: ["A pedra fundamental da igreja foi lançada em 1952, pelo Padre Geraldo Meyers. Ela nasceu como igreja do Sagrado Coração de Jesus, padroeiro do município, e virou catedral quando o Papa João Paulo II criou a Diocese de Colatina, em 1990.",
        "Desde 2006 é patrimônio histórico municipal. Em 2025, os próprios colatinenses a elegeram uma das Maravilhas de Colatina."],
      linha: [["1952", "Lançamento da pedra fundamental"], ["1990", "Criação da Diocese; a igreja passa a ser catedral"],
        ["2006", "Torna-se patrimônio histórico municipal"], ["2025", "Eleita uma das Maravilhas de Colatina"]],
      perto: [["Praça Frei José", "Praça", 30], ["Mercado Municipal", "Mercado", 270], ["Banana Food", "Restaurante", 280], ["Plaza Hotel", "Hotel", 310],
        ["Praça do Sol Poente", "Praça", 350]],
      codigo: "CATEDRAL26", colecionavel: { nome: "Sino da Catedral", icone: "🔔" }
    },
    {
      id: "ciencia", tipo: "ponto", nome: "Centro de Ciência", bairro: "Esplanada",
      // shortcut: endereço noticiado é Av. Senador Moacyr Dalla, 85, Esplanada, mas a rua não está no OpenStreetMap;
      // coordenada provisória no bairro, trocar pela medida no local.
      lat: -19.5372, lng: -40.6368, raio: 150, aprox: true,
      pista: "Debaixo de uma cúpula branca, dá para ver as estrelas em pleno dia.",
      horario: "Ter a sex, 8h às 17h · sábados em datas do projeto Sábado com Ciência (a confirmar)",
      aviso: "As atividades de sábado são gratuitas, mas exigem inscrição prévia pelo Sympla.",
      fotos: [{ src: "centro-tecnologia-Colatina.jpeg", cap: "Fachada do Centro de Ciência" }],
      historia: ["O Centro de Ciência de Colatina fica na Avenida Senador Moacyr Dalla, 85, no bairro Esplanada, e reúne planetário, observatório astronômico e equipamentos de tecnologia.",
        "No projeto Sábado com Ciência, da Prefeitura, há sessões no planetário, visitas ao observatório e experiências com óculos de realidade virtual, para crianças, jovens e famílias.",
        "O bairro Esplanada nasceu de um aterro feito com a terra retirada dos morros do Centro, que aumentou a área plana da cidade."],
      linha: [],
      // Sem metros: a coordenada do Centro de Ciência é provisória, então só indicamos o que há no bairro.
      perto: [["Biblioteca Municipal", "Biblioteca, no bairro Esplanada"], ["Praça do Sol Poente", "Praça, no bairro Esplanada"],
        ["Estádio Municipal Justiniano de Mello e Silva", "Estádio, no bairro Esplanada"], ["Comic Burguer", "Lanchonete, no bairro Esplanada"]],
      fontes: [["ES Hoje, 2026", "https://eshoje.com.br/?p=869891"], ["A Gazeta, 2021", "https://www.agazeta.com.br/especialcolatina/colatina-100-anos-de-uma-vila-a-maior-cidade-do-noroeste-capixaba-0721"]],
      codigo: "CIENCIA26", colecionavel: { nome: "Luneta do Planetário", icone: "🔭" }
    },
    {
      id: "ponte", tipo: "ponto", nome: "Ponte Florentino Avidos", bairro: "Centro",
      lat: -19.5338967, lng: -40.629598, raio: 200,
      pista: "Desde 1928, ela costura as duas margens do Rio Doce.",
      horario: "Aberta o dia todo",
      aviso: "Atenção ao trânsito. Fique na calçada.",
      fotos: [{ src: "pordosol.jpg", cap: "A ponte no pôr do sol" }],
      historia: ["A Ponte Florentino Avidos começou a ser construída em 1926, pela margem sul do Rio Doce, e ficou pronta em 1928. Ela fazia parte dos planos de levar a ferrovia ao norte do Estado, que não avançaram por falta de dinheiro.",
        "Mesmo sem os trilhos, a ponte abriu caminho para a ocupação da região e impulsionou o crescimento de Colatina, então movido pela madeira e pelo café. Hoje é um dos melhores lugares para ver o pôr do sol."],
      linha: [["1926", "Início da obra, pela margem sul"], ["1928", "Conclusão da ponte"]],
      perto: [["Praça do Camelódromo", "Praça", 70], ["Praça Altemar Dutra", "Praça", 90], ["Plaza Hotel", "Hotel", 110], ["Banana Food", "Restaurante", 140],
        ["Mercado Municipal", "Mercado", 150], ["Colatina Hotel", "Hotel", 200], ["Cine Gama", "Cinema", 230], ["Colatina Shopping", "Shopping", 270]],
      fontes: [["A Gazeta, 2021", "https://www.agazeta.com.br/especialcolatina/colatina-100-anos-de-uma-vila-a-maior-cidade-do-noroeste-capixaba-0721"]],
      codigo: "PONTE26", colecionavel: { nome: "Arco da Ponte", icone: "🌉" }
    },
    {
      id: "beirario", tipo: "retirada", nome: "Pôr do sol na Beira-Rio", bairro: "Centro",
      // Coordenada aproximada: cabeceira da Ponte Florentino Avidos.
      lat: -19.5343, lng: -40.63, raio: 300, aprox: true,
      pista: "Quando o sol encosta no Rio Doce, sua recompensa aparece.",
      horario: "Fins de semana, feriados e eventos, perto do pôr do sol",
      aviso: "Em caso de chuva forte ou cheia, a retirada é cancelada.",
      fotos: [{ src: "pordosol.jpg", cap: "Pôr do sol sobre o Rio Doce" }],
      perto: [["Plaza Hotel", "Hotel", 50], ["Banana Food", "Restaurante", 90], ["Mercado Municipal", "Mercado", 90], ["Cine Gama", "Cinema", 260],
        ["Colatina Shopping", "Shopping", 300]],
      codigo: "SOL26"
    }
  ];

  // A primeira rota é a principal: concluí-la libera o patch de jeans.
  const ROTAS = [
    {
      id: "principal", nome: "Uma tarde em Colatina", descricao: "O circuito clássico: mirante, fé e ciência. Termina com o patch no pôr do sol.",
      pontos: ["cristo", "catedral", "ciencia"], temposExemplo: [95, 120, 140],
      badge: { nome: "Desbravador de Colatina", icone: "🏅" }
    },
    {
      id: "riodoce", nome: "Centro e Rio Doce", descricao: "Um passeio curto a pé pelo coração da cidade, até a ponte.",
      pontos: ["catedral", "ponte"], temposExemplo: [35, 40, 50],
      badge: { nome: "Guardião do Rio Doce", icone: "🌊" }
    }
  ];

  // Exploradores fictícios, só para demonstrar o ranking. avatar = [cor, rosto, acessório] (índices).
  const EXPLORADORES = [
    { apelido: "Capivara_Doce", avatar: [0, 5, 2], xp: 780 },
    { apelido: "TrilheiraES", avatar: [3, 1, 4], xp: 610 },
    { apelido: "ZeDoMirante", avatar: [1, 2, 1], xp: 430 },
    { apelido: "LuaDoRio", avatar: [4, 7, 0], xp: 290 },
    { apelido: "PedalNoroeste", avatar: [2, 0, 3], xp: 150 },
    { apelido: "Sol_Poente", avatar: [5, 4, 5], xp: 60 }
  ];

  // Eventos fictícios, só para demonstrar a aba Novidades.
  const EVENTOS = [
    { id: "e1", titulo: "Sábado com Ciência", texto: "Atividades abertas no Centro de Ciência. Evento de exemplo.", quando: "2026-11-14", data: "2026-11-03T12:00:00Z" },
    { id: "e2", titulo: "Feira de artesanato na Beira-Rio", texto: "Artesãos locais ao pôr do sol. Evento de exemplo.", quando: "2026-11-21", data: "2026-11-01T12:00:00Z" }
  ];

  const D = { PONTOS, ROTAS, EXPLORADORES, EVENTOS };
  if (typeof module !== "undefined") module.exports = D; else root.DC_DADOS = D;
})(this);
