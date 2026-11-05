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
      historia: ["O Cristo Redentor fica no alto do bairro Bela Vista e é um dos mirantes mais conhecidos de Colatina, com vista para o Centro e para o Rio Doce.",
        "Em 2025, foi eleito pela população uma das Maravilhas de Colatina."],
      linha: [],
      perto: [["Mirante", "Vista do Centro e do Rio Doce"]],
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
      perto: [["Praça Frei José", "Em frente à Catedral"], ["Comércio do Centro", "Lojas e lanchonetes a poucos passos"]],
      codigo: "CATEDRAL26", colecionavel: { nome: "Sino da Catedral", icone: "🔔" }
    },
    {
      id: "ciencia", tipo: "ponto", nome: "Centro de Ciência", bairro: "Esplanada",
      // shortcut: endereço noticiado é Av. Senador Moacyr Dalla, 85, Esplanada, mas a rua não está no OpenStreetMap;
      // coordenada provisória no bairro, trocar pela medida no local.
      lat: -19.5372, lng: -40.6368, raio: 150, aprox: true,
      pista: "Debaixo de uma cúpula branca, dá para ver as estrelas em pleno dia.",
      horario: "Horário a confirmar com a Prefeitura",
      aviso: "Algumas atividades exigem inscrição prévia.",
      fotos: [{ src: "centro-tecnologia-Colatina.jpeg", cap: "Fachada do Centro de Ciência" }],
      historia: ["O Centro de Ciência de Colatina reúne planetário, observatório astronômico e laboratórios, com atividades abertas ao público.",
        "É um espaço para aproximar moradores e visitantes da ciência e da inovação."],
      linha: [],
      perto: [["Planetário", "Sessões em dias de programação"]],
      codigo: "CIENCIA26", colecionavel: { nome: "Luneta do Planetário", icone: "🔭" }
    },
    {
      id: "ponte", tipo: "ponto", nome: "Ponte Florentino Avidos", bairro: "Centro",
      lat: -19.5338967, lng: -40.629598, raio: 200,
      pista: "Desde 1928, ela costura as duas margens do Rio Doce.",
      horario: "Aberta o dia todo",
      aviso: "Atenção ao trânsito. Fique na calçada.",
      fotos: [{ src: "pordosol.jpg", cap: "A ponte no pôr do sol" }],
      historia: ["A Ponte Florentino Avidos, de 1928, liga o Centro à outra margem do Rio Doce e é um dos melhores lugares para ver o pôr do sol de Colatina."],
      linha: [],
      perto: [["Avenida Beira-Rio", "Calçadão à beira do Rio Doce"]],
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
