# Desvenda Colatina

Protótipo (POC) de turismo para a Maratona de Inovação de Colatina 2026. Não é um site oficial.

O visitante vê no mapa pontos misteriosos, vai até o local e desvenda a história do lugar pelo próprio app; o totem é só um atalho opcional. Cada descoberta rende XP e um colecionável, e os badges são conquistados por objetivos: visitar pontos, andar entre eles e concluir rotas. A rota principal libera a retirada de um patch de jeans no pôr do sol da Beira-Rio.

## Como abrir

Site estático, sem instalação. Na pasta do projeto, sirva os arquivos e abra no navegador:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Depois acesse `http://localhost:8765`. O GPS do navegador só funciona em `localhost` ou em HTTPS (por exemplo, GitHub Pages).

## Modo demonstração

Abra `index.html?demo=1` para mostrar os botões que simulam a chegada aos pontos e o pôr do sol. `?demo=0` desliga.

## Arquivos

- `index.html`: mapa, cards dos pontos, rota a pé e rota seguida.
- `ponto.html?id=...`: página de cada ponto e retirada do patch (`id=beirario`).
- `rotas.html`: rotas, tempo médio e botão de seguir.
- `perfil.html`: login por e-mail, apelido, avatar, nível, badges e colecionáveis.
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

- O login é simulado: guarda só o e-mail no aparelho, sem senha.
- A Área da Secretaria não tem login, e as sugestões não saem do aparelho de quem as enviou.
- O ranking, os eventos e os tempos médios usam dados fictícios, misturados aos do próprio usuário.
- Textos, horários e coordenadas são provisórios; a localização do Centro de Ciência e a da Beira-Rio são aproximadas.
- Estoque de patches e relatório de patrocinadores não foram implementados.
