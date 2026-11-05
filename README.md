# Desvenda Colatina

Protótipo (POC) de turismo para a Maratona de Inovação de Colatina 2026. Não é um site oficial.

O visitante vê no mapa pontos misteriosos, vai até o local, escaneia o código do totem e desvenda a história do lugar. Com os 3 pontos, libera a retirada de um patch de jeans no pôr do sol da Beira-Rio.

## Como abrir

Site estático, sem instalação. Sirva a pasta e abra no navegador:

```bash
python -m http.server 8765
```

Depois acesse `http://localhost:8765`. O GPS do navegador só funciona em `localhost` ou em HTTPS (por exemplo, GitHub Pages).

## Modo demonstração

Abra `index.html?demo=1` para mostrar os botões que simulam a chegada aos pontos e o pôr do sol. `?demo=0` desliga.

## Arquivos

- `index.html`: mapa, cards dos pontos, rota e progresso.
- `ponto.html?id=...`: página de cada ponto e retirada do patch (`id=beirario`).
- `totens.html`: códigos QR dos totens para imprimir.
- `app.js`: pontos, estado e regras. Autoteste: `node -e "console.log(require('./app.js').selfTest())"`.
- `style.css`: estilos.

## Limites da POC

- O progresso fica só no celular (sem servidor).
- Textos, horários e coordenadas são provisórios; a localização do Centro de Ciência e a da Beira-Rio são aproximadas.
- Painel da Secretaria, estoque e relatório de patrocinadores não foram implementados.
