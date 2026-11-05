# Desvenda Colatina

Protótipo (POC) de turismo para a Maratona de Inovação de Colatina 2026. Não é um site oficial.

O visitante vê no mapa pontos misteriosos, vai até o local e desvenda a história do lugar pelo próprio app; o totem é só um atalho opcional. Cada descoberta rende XP e um colecionável, e os badges são conquistados por objetivos: visitar pontos, andar entre eles e concluir rotas. A rota principal libera a retirada de um patch de jeans no pôr do sol da Beira-Rio.

## Como abrir

Site estático, sem instalação. Na pasta do projeto, sirva os arquivos e abra no navegador:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Depois acesse `http://localhost:8765`. O GPS do navegador só funciona em `localhost` ou em HTTPS (por exemplo, GitHub Pages).

## Como publicar no GitHub Pages

Quem administra o repositório ativa uma vez, em Settings → Pages:

1. Em "Build and deployment", escolha Source: "Deploy from a branch".
2. Em Branch, escolha `main` e a pasta `/ (root)`, e salve.
3. Depois de um ou dois minutos, o site abre em `https://arthuurfernandes.github.io/turismocol-/`.

Cada envio para a `main` atualiza o site. Gere os códigos de `totens.html` de novo pelo endereço publicado.

## Modo demonstração

Abra `index.html?demo=1` para mostrar os botões que simulam a chegada aos pontos e o pôr do sol. `?demo=0` desliga.

## Arquivos

- `index.html`: mapa, cards dos pontos, rota a pé e rota seguida.
- `ponto.html?id=...`: página de cada ponto e retirada do patch (`id=beirario`).
- `rotas.html`: rotas, tempo médio e botão de seguir.
- `perfil.html`: cadastro e login por e-mail e senha, apelido, avatar, nível, badges e colecionáveis.
- `novidades.html`: eventos, pontos e rotas novos.
- `ranking.html`: maiores exploradores.
- `sugerir.html`: sugestão de ponto, rota ou evento.
- `secretaria.html`: aprovação ou recusa das sugestões.
- `totens.html`: códigos QR dos totens para imprimir.
- `dados.js`: conteúdo de exemplo (pontos, rotas, exploradores e eventos).
- `app.js`: estado e regras. Autoteste: `node -e "console.log(require('./app.js').selfTest())"`.
- `style.css`: estilos.

## Limites da POC

Não há servidor: tudo fica no `localStorage` de cada celular.

- O cadastro é simbólico: a conta e o progresso de cada pessoa ficam só no aparelho dela, e a senha é guardada como um hash simples, sem segurança real.
- Uma conta criada em um celular não existe em outro.
- A Área da Secretaria não tem login, e as sugestões não saem do aparelho de quem as enviou.
- O ranking, os eventos e os tempos médios usam dados fictícios, misturados aos do próprio usuário.
- Textos, horários e coordenadas são provisórios; a localização do Centro de Ciência e a da Beira-Rio são aproximadas.
- Estoque de patches e relatório de patrocinadores não foram implementados.
