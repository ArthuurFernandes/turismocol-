/* Desvenda Colatina — dados, estado e regras compartilhados pelas páginas. */
(function (root) {
  const TOTAL = 3;
  const CENTRO = [-19.5355, -40.629];

  // Conteúdo provisório: textos, horários e coordenadas a validar com a Secretaria de Turismo.
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
      codigo: "CRISTO26"
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
      codigo: "CATEDRAL26"
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
      codigo: "CIENCIA26"
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

  const ponto = (id) => PONTOS.find((p) => p.id === id);
  const pontosDoCircuito = () => PONTOS.filter((p) => p.tipo === "ponto");

  /* ---------- Estado (só neste aparelho; nunca guarda coordenadas) ---------- */
  // shortcut: estado no localStorage, some ao trocar de celular; trocar por backend quando houver conta ou passaporte.
  const CHAVE = "dc_estado";
  function ler() {
    try { return Object.assign({ desbloq: {}, patch: null }, JSON.parse(localStorage.getItem(CHAVE)) || {}); }
    catch (e) { return { desbloq: {}, patch: null }; }
  }
  function gravar(s) { try { localStorage.setItem(CHAVE, JSON.stringify(s)); } catch (e) { } }
  const desbloqueado = (id) => !!ler().desbloq[id];
  const progresso = () => pontosDoCircuito().filter((p) => desbloqueado(p.id)).length;
  const completo = () => progresso() >= TOTAL;
  function desbloquear(id) { const s = ler(); if (!s.desbloq[id]) { s.desbloq[id] = new Date().toISOString(); gravar(s); } }
  function reiniciar() { try { localStorage.removeItem(CHAVE); } catch (e) { } }

  /* ---------- Patch: um QR de uso único por aparelho ---------- */
  function liberarPatch() {
    const s = ler();
    if (!s.patch) { s.patch = { token: "DC-" + Math.random().toString(36).slice(2, 10).toUpperCase(), usado: null }; gravar(s); }
    return s.patch;
  }
  function usarPatch() {
    const s = ler();
    if (!s.patch || s.patch.usado) return false;
    s.patch.usado = new Date().toISOString(); gravar(s); return true;
  }

  /* ---------- Distância e raio ---------- */
  function distM(a, b) {
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  // A imprecisão informada pelo GPS conta a favor do visitante, até 100 m.
  const dentroDoRaio = (pos, p, precisao) => distM(pos, [p.lat, p.lng]) <= p.raio + Math.min(precisao || 0, 100);
  const fmtDist = (m) => (m < 1000 ? Math.round(m / 10) * 10 + " m" : (m / 1000).toFixed(1).replace(".", ",") + " km");

  /* ---------- Pôr do sol e janela de retirada ---------- */
  function sunsetFor(date, lat, lng) {
    const rad = Math.PI / 180;
    const JD = date.getTime() / 86400000 + 2440587.5;
    const n = Math.round(JD - 2451545.0 + 0.0008);
    const Js = n - lng / 360;
    const M = (357.5291 + 0.98560028 * Js) % 360;
    const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
    const L = (M + C + 180 + 102.9372) % 360;
    const Jt = 2451545.0 + Js + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
    const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.44 * rad));
    const cosw = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec));
    return new Date((Jt + Math.acos(cosw) / rad / 360 - 2440587.5) * 86400000);
  }
  // Regra da POC: de 90 min antes a 30 min depois do pôr do sol. Na versão real, a Secretaria define a janela de cada data.
  function janelaPatch(agora) {
    const b = ponto("beirario"), sol = sunsetFor(agora, b.lat, b.lng);
    const ini = new Date(sol.getTime() - 90 * 60000), fim = new Date(sol.getTime() + 30 * 60000);
    return { sol, ini, fim, aberta: agora >= ini && agora <= fim };
  }
  const fmtHora = (d) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

  /* ---------- Modo demonstração (?demo=1 liga, ?demo=0 desliga) ---------- */
  function demo() {
    try {
      const q = new URLSearchParams(location.search).get("demo");
      if (q === "1") sessionStorage.setItem("dc_demo", "1");
      if (q === "0") sessionStorage.removeItem("dc_demo");
      return sessionStorage.getItem("dc_demo") === "1";
    } catch (e) { return false; }
  }

  /* ---------- Cabeçalho comum: marca, progresso e barra do modo demonstração ---------- */
  function cabecalho(el) {
    const n = progresso();
    const bolas = pontosDoCircuito().map((p) => `<i class="${desbloqueado(p.id) ? "on" : ""}"></i>`).join("");
    el.innerHTML = `<div class="top"><a class="brand" href="index.html">Desvenda Colatina<small>Descubra a cidade no local</small></a>
      <div class="prog" aria-label="${n} de ${TOTAL} pontos desvendados">${bolas}<span>${n} de ${TOTAL}</span></div></div>` +
      (demo() ? `<div class="demo-bar"><span>Modo demonstração</span><button type="button" id="dcReset">Recomeçar</button></div>` : "");
    const r = el.querySelector("#dcReset");
    if (r) r.onclick = () => { reiniciar(); location.href = "index.html"; };
  }

  function selfTest() {
    const ok = (c, m) => { if (!c) throw new Error("Autoteste falhou: " + m); };
    const cat = ponto("catedral"), cri = ponto("cristo");
    const d = distM([cat.lat, cat.lng], [cri.lat, cri.lng]);
    ok(d > 500 && d < 800, "distância Catedral–Cristo deveria ser ~630 m, deu " + d);
    ok(dentroDoRaio([cat.lat, cat.lng], cat), "no próprio ponto deve desbloquear");
    ok(!dentroDoRaio([cri.lat, cri.lng], cat, 5000), "a 600 m não desbloqueia, mesmo com GPS impreciso");
    const sol = sunsetFor(new Date("2026-11-05T15:00:00Z"), -19.5343, -40.63);
    const h = sol.getUTCHours() + sol.getUTCMinutes() / 60; // 17h30–18h30 em Colatina (UTC−3)
    ok(h > 20.5 && h < 21.5, "pôr do sol de 05/11 fora do esperado: " + sol.toISOString());
    const j = janelaPatch(sol);
    ok(j.aberta && !janelaPatch(new Date(sol.getTime() - 3 * 3600000)).aberta, "janela de retirada");
    ok(pontosDoCircuito().length === TOTAL, "circuito deve ter 3 pontos");
    return "ok";
  }

  const DC = { TOTAL, CENTRO, PONTOS, ponto, pontosDoCircuito, ler, desbloqueado, progresso, completo, desbloquear, reiniciar,
    liberarPatch, usarPatch, distM, dentroDoRaio, fmtDist, sunsetFor, janelaPatch, fmtHora, demo, cabecalho, selfTest };
  if (typeof module !== "undefined") module.exports = DC; else root.DC = DC;
})(this);
