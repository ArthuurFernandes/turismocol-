/* Desvenda Colatina — estado e regras compartilhados pelas páginas. O conteúdo fica em dados.js. */
(function (root) {
  const D = typeof module !== "undefined" ? require("./dados.js") : root.DC_DADOS;
  const CENTRO = [-19.5355, -40.629];
  const XP = { ponto: 50, rota: 150, sugestao: 30 };
  const NIVEIS = [[0, "Curioso"], [100, "Explorador"], [300, "Desbravador"], [600, "Guia da cidade"], [1000, "Lenda de Colatina"]];
  const AVATAR = {
    cores: ["#f28c28", "#e8524a", "#1f4e79", "#1f9d63", "#8c3b6b", "#2f7fb5"],
    rostos: ["😀", "😎", "🤠", "🧐", "🥳", "🦊", "🐸", "🐱"],
    acess: ["", "🎩", "👑", "🧢", "🎒", "🌻"]
  };

  // Todo texto digitado por usuários passa por aqui antes de entrar no HTML.
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Estado (só neste aparelho; nunca guarda coordenadas do visitante) ---------- */
  // shortcut: estado no localStorage, some ao trocar de celular e não é compartilhado; trocar por backend na versão real.
  let CHAVE = "dc_estado";
  const memoria = {};
  const disco = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return memoria[k] || null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { memoria[k] = v; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { delete memoria[k]; } }
  };
  const VAZIO = () => ({ desbloq: {}, patch: null, conta: null, rotaAtiva: null, tempos: {}, sugestoes: [] });
  function ler() {
    try { return Object.assign(VAZIO(), JSON.parse(disco.get(CHAVE)) || {}); } catch (e) { return VAZIO(); }
  }
  const gravar = (s) => disco.set(CHAVE, JSON.stringify(s));
  const reiniciar = () => disco.del(CHAVE);

  /* ---------- Pontos e rotas: os de exemplo mais as sugestões aprovadas pela Secretaria ---------- */
  const aprovadas = (tipo) => ler().sugestoes.filter((s) => s.tipo === tipo && s.status === "aprovada");
  function pontos() {
    return D.PONTOS.concat(aprovadas("ponto").map((s) => ({
      id: "c" + s.id, tipo: "ponto", comunidade: true, nome: esc(s.dados.nome), bairro: "Sugestão da comunidade",
      lat: s.dados.lat, lng: s.dados.lng, raio: 150,
      pista: esc(s.dados.pista || "Um lugar indicado por quem conhece a cidade."),
      horario: "A confirmar", aviso: "Ponto sugerido por um explorador.",
      fotos: [], historia: [esc(s.dados.descricao)], linha: [], perto: [],
      codigo: ("COM" + s.id).toUpperCase(), colecionavel: { nome: "Achado da comunidade", icone: "🧭" }
    })));
  }
  const ponto = (id) => pontos().find((p) => p.id === id);
  function rotas() {
    const existe = (id) => !!ponto(id);
    return D.ROTAS.concat(aprovadas("rota").map((s) => ({
      id: "c" + s.id, comunidade: true, nome: esc(s.dados.nome), descricao: esc(s.dados.descricao),
      pontos: s.dados.pontos.filter(existe), temposExemplo: [], badge: { nome: "Rota da comunidade", icone: "🧭" }
    }))).filter((r) => r.pontos.length);
  }
  const rota = (id) => rotas().find((r) => r.id === id);

  /* ---------- Progresso: tudo derivado dos pontos desvendados ---------- */
  const desbloqueado = (id) => !!ler().desbloq[id];
  const feitos = (r) => r.pontos.filter(desbloqueado).length;
  const rotaFeita = (r) => feitos(r) === r.pontos.length;
  const completo = () => rotaFeita(D.ROTAS[0]); // a rota principal libera o patch
  // Desvenda um ponto e devolve o que foi ganho: XP, colecionável e rotas concluídas.
  function desbloquear(id) {
    const p = ponto(id);
    if (!p || p.tipo !== "ponto" || desbloqueado(id)) return { xp: 0, rotas: [] };
    const antes = rotas().filter(rotaFeita).map((r) => r.id);
    const s = ler(); s.desbloq[id] = new Date().toISOString();
    gravar(s);
    const novas = rotas().filter((r) => rotaFeita(r) && !antes.includes(r.id));
    if (s.rotaAtiva && novas.some((r) => r.id === s.rotaAtiva.id)) {
      s.tempos[s.rotaAtiva.id] = Math.max(1, Math.round((Date.now() - new Date(s.rotaAtiva.inicio)) / 60000));
      s.rotaAtiva = null; gravar(s);
    }
    return { xp: XP.ponto + XP.rota * novas.length, colecionavel: p.colecionavel, rotas: novas.map((r) => ({ nome: r.nome, badge: r.badge })) };
  }

  /* ---------- Seguir rota e tempo médio ---------- */
  function seguirRota(id) { if (!rota(id)) return false; const s = ler(); s.rotaAtiva = { id, inicio: new Date().toISOString() }; gravar(s); return true; }
  function pararRota() { const s = ler(); s.rotaAtiva = null; gravar(s); }
  const rotaAtiva = () => { const a = ler().rotaAtiva; return a && rota(a.id) ? rota(a.id) : null; };
  // Média entre os tempos de exemplo e o tempo deste explorador, em minutos. null quando não há nenhum tempo.
  function tempoMedio(r) {
    const meu = ler().tempos[r.id], t = r.temposExemplo.concat(meu ? [meu] : []);
    return t.length ? Math.round(t.reduce((a, b) => a + b, 0) / t.length) : null;
  }
  const fmtMin = (m) => (m < 60 ? m + " min" : Math.floor(m / 60) + "h" + String(m % 60).padStart(2, "0"));

  /* ---------- XP, níveis, badges e colecionáveis ---------- */
  function xp() {
    const s = ler();
    return XP.ponto * pontos().filter((p) => s.desbloq[p.id]).length + XP.rota * rotas().filter(rotaFeita).length +
      XP.sugestao * s.sugestoes.filter((x) => x.status === "aprovada").length;
  }
  function nivel(x) {
    let i = 0; while (i + 1 < NIVEIS.length && x >= NIVEIS[i + 1][0]) i++;
    const prox = NIVEIS[i + 1];
    return { n: i + 1, nome: NIVEIS[i][1], min: NIVEIS[i][0], prox: prox ? prox[0] : null, pct: prox ? Math.round(((x - NIVEIS[i][0]) / (prox[0] - NIVEIS[i][0])) * 100) : 100 };
  }
  const colecionaveis = () => pontos().filter((p) => p.tipo === "ponto").map((p) => ({ icone: p.colecionavel.icone, nome: p.colecionavel.nome, de: p.nome, on: desbloqueado(p.id) }));
  function badges() {
    const n = pontos().filter((p) => desbloqueado(p.id)).length;
    return [{ icone: "👣", nome: "Primeiro passo", desc: "Desvende seu primeiro ponto", on: n >= 1 }]
      .concat(rotas().map((r) => ({ icone: r.badge.icone, nome: r.badge.nome, desc: "Conclua a rota " + r.nome, on: rotaFeita(r) })));
  }

  /* ---------- Conta, apelido e avatar ---------- */
  // shortcut: login simulado, só guarda o e-mail neste aparelho, sem senha; trocar por autenticação real com servidor.
  function entrar(email) {
    email = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return false;
    const s = ler(); s.conta = Object.assign({ apelido: "", avatar: [0, 0, 0] }, s.conta, { email }); gravar(s); return true;
  }
  function sair() { const s = ler(); s.conta = null; gravar(s); }
  function definirPerfil(apelido, avatar) {
    apelido = String(apelido || "").trim();
    const s = ler();
    if (!s.conta || apelido.length < 2 || apelido.length > 20) return false;
    s.conta.apelido = apelido;
    s.conta.avatar = [0, 1, 2].map((i) => Math.max(0, Math.min([AVATAR.cores, AVATAR.rostos, AVATAR.acess][i].length - 1, parseInt(avatar && avatar[i], 10) || 0)));
    gravar(s); return true;
  }
  const conta = () => ler().conta;
  function avatarHtml(av, classe) {
    av = av || [2, 0, 0];
    return `<span class="avatar ${classe || ""}" style="background:${AVATAR.cores[av[0]] || AVATAR.cores[0]}" aria-hidden="true">${AVATAR.rostos[av[1]] || AVATAR.rostos[0]}<i>${AVATAR.acess[av[2]] || ""}</i></span>`;
  }

  /* ---------- Sugestões da comunidade e decisão da Secretaria ---------- */
  // Devolve uma mensagem de erro, ou "" quando a sugestão foi registrada como pendente.
  function sugerir(tipo, d) {
    const nome = String(d.nome || "").trim(), descricao = String(d.descricao || "").trim();
    if (!["ponto", "rota", "evento"].includes(tipo)) return "Tipo de sugestão inválido.";
    if (nome.length < 3 || nome.length > 60) return "O nome deve ter de 3 a 60 caracteres.";
    if (descricao.length < 10 || descricao.length > 300) return "A descrição deve ter de 10 a 300 caracteres.";
    const dados = { nome, descricao };
    if (tipo === "ponto") {
      const lat = Number(d.lat), lng = Number(d.lng);
      if (!isFinite(lat) || !isFinite(lng) || d.lat == null || distM([lat, lng], CENTRO) > 30000) return "Marque no mapa um local em Colatina ou região.";
      Object.assign(dados, { lat, lng, pista: String(d.pista || "").trim().slice(0, 120) });
    }
    if (tipo === "rota") {
      const ids = (d.pontos || []).filter((id, i, a) => ponto(id) && ponto(id).tipo === "ponto" && a.indexOf(id) === i);
      if (ids.length < 2) return "Escolha pelo menos 2 pontos para a rota.";
      dados.pontos = ids;
    }
    if (tipo === "evento") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d.quando || "")) return "Informe a data do evento.";
      Object.assign(dados, { quando: d.quando, local: String(d.local || "").trim().slice(0, 80) });
    }
    const s = ler();
    s.sugestoes.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), tipo, dados, status: "pendente", data: new Date().toISOString() });
    gravar(s); return "";
  }
  // shortcut: a Secretaria decide neste mesmo aparelho, sem autenticação; exigir login de servidor na versão real.
  function decidir(id, aprovar) {
    const s = ler(), x = s.sugestoes.find((y) => y.id === id);
    if (!x || x.status !== "pendente") return false;
    x.status = aprovar ? "aprovada" : "recusada"; x.decididaEm = new Date().toISOString();
    gravar(s); return true;
  }
  const fmtData = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${m[3]}/${m[2]}/${m[1]}` : ""; };
  const TIPOS = { ponto: "Ponto turístico", rota: "Rota", evento: "Evento" };
  // Sugestões já com o texto escapado, prontas para exibir.
  function sugestoes() {
    return ler().sugestoes.map((s) => ({
      id: s.id, tipo: s.tipo, tipoNome: TIPOS[s.tipo], status: s.status, data: s.data, nome: esc(s.dados.nome), descricao: esc(s.dados.descricao),
      extra: s.tipo === "evento" ? `Data: ${fmtData(s.dados.quando)}${s.dados.local ? " · " + esc(s.dados.local) : ""}`
        : s.tipo === "rota" ? `${s.dados.pontos.length} pontos` : s.dados.pista ? "Pista: " + esc(s.dados.pista) : ""
    })).reverse();
  }

  /* ---------- Novidades e ranking ---------- */
  function novidades() {
    const itens = D.EVENTOS.map((e) => ({ tipo: "evento", titulo: e.titulo, texto: e.texto, quando: e.quando, data: e.data }));
    ler().sugestoes.filter((s) => s.status === "aprovada").forEach((s) => itens.push({
      tipo: s.tipo, comunidade: true, titulo: esc(s.dados.nome), texto: esc(s.dados.descricao), data: s.decididaEm || s.data,
      quando: s.dados.quando, local: esc(s.dados.local || ""), link: s.tipo === "ponto" ? "index.html" : s.tipo === "rota" ? "rotas.html" : ""
    }));
    return itens.sort((a, b) => (a.data < b.data ? 1 : -1));
  }
  function ranking() {
    const c = conta();
    return D.EXPLORADORES.concat([{ apelido: esc(c && c.apelido ? c.apelido : "Você"), avatar: c ? c.avatar : null, xp: xp(), eu: true }])
      .sort((a, b) => b.xp - a.xp || (a.eu ? -1 : 1));
  }

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

  /* ---------- Cabeçalho e abas comuns a todas as páginas ---------- */
  const ABAS = [["mapa", "index.html", "🗺️", "Mapa"], ["rotas", "rotas.html", "🧭", "Rotas"], ["novidades", "novidades.html", "📣", "Novidades"],
    ["ranking", "ranking.html", "🏆", "Ranking"], ["perfil", "perfil.html", "🙂", "Perfil"]];
  function cabecalho(el, aba) {
    const c = conta(), x = xp(), nv = nivel(x);
    el.innerHTML = `<div class="top"><a class="brand" href="index.html">Desvenda Colatina<small>Descubra a cidade no local</small></a>
      <a class="eu-top" href="perfil.html" aria-label="Seu perfil: nível ${nv.n}, ${x} XP">${avatarHtml(c && c.avatar, "p")}<span>Nv ${nv.n}<small>${x} XP</small></span></a></div>` +
      (demo() ? `<div class="demo-bar"><span>Modo demonstração</span><button type="button" id="dcReset">Recomeçar</button></div>` : "");
    const r = el.querySelector("#dcReset");
    if (r) r.onclick = () => { reiniciar(); location.href = "index.html"; };
    const nav = document.createElement("nav");
    nav.className = "tabs"; nav.setAttribute("aria-label", "Seções");
    nav.innerHTML = ABAS.map((a) => `<a href="${a[1]}" ${a[0] === aba ? 'class="on" aria-current="page"' : ""}><span aria-hidden="true">${a[2]}</span>${a[3]}</a>`).join("");
    document.body.appendChild(nav);
  }

  // Roda em uma chave separada, para nunca mexer no progresso real do visitante.
  function selfTest() {
    const ok = (c, m) => { if (!c) throw new Error("Autoteste falhou: " + m); };
    const real = CHAVE; CHAVE = "dc_teste"; reiniciar();
    try {
      const cat = ponto("catedral"), cri = ponto("cristo");
      const d = distM([cat.lat, cat.lng], [cri.lat, cri.lng]);
      ok(d > 500 && d < 800, "distância Catedral–Cristo deveria ser ~630 m, deu " + d);
      ok(dentroDoRaio([cat.lat, cat.lng], cat), "no próprio ponto deve desbloquear");
      ok(!dentroDoRaio([cri.lat, cri.lng], cat, 5000), "a 600 m não desbloqueia, mesmo com GPS impreciso");
      const sol = sunsetFor(new Date("2026-11-05T15:00:00Z"), -19.5343, -40.63);
      const h = sol.getUTCHours() + sol.getUTCMinutes() / 60; // 17h30–18h30 em Colatina (UTC−3)
      ok(h > 20.5 && h < 21.5, "pôr do sol de 05/11 fora do esperado: " + sol.toISOString());
      ok(janelaPatch(sol).aberta && !janelaPatch(new Date(sol.getTime() - 3 * 3600000)).aberta, "janela de retirada");

      ok(xp() === 0 && nivel(0).n === 1 && nivel(100).n === 2 && nivel(99).pct === 99 && nivel(5000).prox === null, "níveis");
      ok(seguirRota("riodoce") && rotaAtiva().id === "riodoce" && !seguirRota("nao-existe"), "seguir rota");
      let g = desbloquear("catedral");
      ok(g.xp === 50 && g.rotas.length === 0 && xp() === 50, "ponto vale 50 XP");
      ok(desbloquear("catedral").xp === 0 && desbloquear("beirario").xp === 0 && xp() === 50, "repetir ponto ou retirada não dá XP");
      g = desbloquear("ponte");
      ok(g.xp === 200 && g.rotas[0].badge.icone === "🌊" && xp() === 250, "fechar a rota soma 150 XP");
      ok(!rotaAtiva() && ler().tempos.riodoce >= 1 && tempoMedio(rota("riodoce")) === Math.round((35 + 40 + 50 + ler().tempos.riodoce) / 4), "tempo da rota");
      ok(fmtMin(45) === "45 min" && fmtMin(125) === "2h05", "formato de tempo");
      ok(!completo() && colecionaveis().filter((c) => c.on).length === 2 && badges().filter((b) => b.on).length === 2, "colecionáveis e badges derivados");
      desbloquear("cristo"); desbloquear("ciencia");
      ok(completo() && xp() === 500, "rota principal libera o patch");

      ok(!entrar("sem-arroba") && entrar("Teste@Exemplo.com") && conta().email === "teste@exemplo.com", "login por e-mail");
      ok(!definirPerfil("a", [0, 0, 0]) && definirPerfil("Zé", [99, -3, "x"]) && conta().avatar.join() === "5,0,0", "apelido e avatar limitados às opções");
      ok(esc("<script>\"&'") === "&lt;script&gt;&quot;&amp;&#39;", "esc");
      ok(sugerir("ponto", { nome: "ab", descricao: "curta" }) !== "" && sugerir("ponto", { nome: "Longe", descricao: "Um lugar bem distante daqui.", lat: 0, lng: 0 }) !== "", "validação de sugestão");
      ok(sugerir("rota", { nome: "Rota X", descricao: "Uma rota com um ponto só.", pontos: ["catedral", "catedral", "beirario"] }) !== "", "rota precisa de 2 pontos válidos");
      ok(sugerir("ponto", { nome: "<b>Praça</b>", descricao: "<img src=x onerror=alert(1)> praça boa", lat: -19.535, lng: -40.63 }) === "", "sugestão válida");
      ok(sugerir("evento", { nome: "Festa da cidade", descricao: "Shows na praça principal.", quando: "2026-12-01" }) === "", "evento válido");
      const [ev, pt] = sugestoes();
      ok(pt.status === "pendente" && pontos().length === D.PONTOS.length && novidades().length === D.EVENTOS.length, "pendente não aparece");
      ok(decidir(pt.id, true) && !decidir(pt.id, false) && decidir(ev.id, false), "decisão única da Secretaria");
      const novo = pontos()[pontos().length - 1];
      ok(novo.comunidade && novo.nome === "&lt;b&gt;Praça&lt;/b&gt;" && !novo.historia[0].includes("<"), "ponto aprovado entra escapado");
      ok(novidades().length === D.EVENTOS.length + 1 && novidades()[0].titulo === novo.nome && xp() === 530, "aprovada vira novidade e dá 30 XP");
      ok(desbloquear(novo.id).xp === 50, "ponto da comunidade pode ser desvendado");
      ok(sugerir("rota", { nome: "Rota nova", descricao: "Catedral e ponte de novo.", pontos: ["catedral", "ponte"] }) === "" &&
        decidir(sugestoes()[0].id, true) && rotas().length === D.ROTAS.length + 1 && rotas().pop().comunidade, "rota aprovada entra em Rotas");
      const rk = ranking(); // 580 + 30 da sugestão + 150 da rota nova, cujos pontos já estavam desvendados
      ok(rk.every((e, i) => !i || rk[i - 1].xp >= e.xp) && rk.find((e) => e.eu).xp === 760, "ranking em ordem de XP");
      return "ok";
    } finally { reiniciar(); CHAVE = real; }
  }

  const DC = { CENTRO, XP, AVATAR, esc, ler, reiniciar, pontos, ponto, rotas, rota, desbloqueado, feitos, rotaFeita, completo, desbloquear,
    seguirRota, pararRota, rotaAtiva, tempoMedio, fmtMin, xp, nivel, colecionaveis, badges, entrar, sair, definirPerfil, conta, avatarHtml,
    sugerir, decidir, sugestoes, fmtData, novidades, ranking, liberarPatch, usarPatch, distM, dentroDoRaio, fmtDist, sunsetFor, janelaPatch,
    fmtHora, demo, cabecalho, selfTest };
  if (typeof module !== "undefined") module.exports = DC; else root.DC = DC;
})(this);
