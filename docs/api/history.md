# Histórico de partidas

## Endpoint

```http
GET /search/{Nickname}/{Hashtag}?count={count}
```

## Descrição

Busca os dados principais de um jogador pelo Riot ID e retorna o perfil, informações ranqueadas, histórico recente de partidas e resumos de performance.

No front-end, este endpoint é consumido pela função `buscarHistorico` em `Front-end/src/services/api/riotApi.ts`.

## Parâmetros

| Nome     | Tipo   | Obrigatório | Descrição                                                                              |
| -------- | ------ | ----------- | -------------------------------------------------------------------------------------- |
| Nickname | string | Sim         | Nome do jogador usado na rota.                                                         |
| Hashtag  | string | Sim         | Tag do jogador usada na rota, sem `#`.                                                 |
| count    | string | Sim         | Quantidade de partidas solicitada à Riot API. No front-end atual é enviado como `100`. |

## Exemplo de request

```http
GET /search/Faker/BR1?count=100
```

## Exemplo de response

### Sucesso

```json
{
  "result": true,
  "message": null,
  "data": {
    "profile": {
      "puuid": "player-puuid",
      "summonerName": "Faker#BR1",
      "summonerLevel": "123",
      "profileIconUrl": "https://ddragon.leagueoflegends.com/cdn/{version}/img/profileicon/{profileIconId}.png",
      "favoriteChampionSplashArtUrl": "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/{championName}_0.jpg"
    },
    "rankedStats": {
      "elos": [
        {
          "queueType": "Ranqueada Solo/Duo",
          "leagueIconUrl": "/ranked-emblems/Emblem_Challenger.png",
          "tier": "Desafiante",
          "rank": "I",
          "leaguePoints": 100,
          "wins": 10,
          "losses": 5,
          "winRate": "66.67%"
        }
      ]
    },
    "matches": {
      "recentMatches": [
        {
          "matchId": "BR1_1234567890",
          "championName": "Aatrox",
          "championIconUrl": "https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/Aatrox.png",
          "championSplashArtUrl": "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg",
          "gameStartTimestamp": "01/01/2026 12:00",
          "kills": 10,
          "deaths": 2,
          "assists": 8,
          "totalDamage": 25000,
          "cs": 210,
          "itemIconUrls": [
            "https://ddragon.leagueoflegends.com/cdn/{version}/img/item/3078.png"
          ],
          "result": 0,
          "champLevel": 16
        }
      ]
    },
     "masteries": [
      {
        "masteryIconUrl": "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/item-element/crest-and-banner-mastery-10.png",
        "championName": "Riven",
        "championIconUrl": "https://ddragon.leagueoflegends.com/cdn/16.9.1/img/champion/Riven.png",
        "championLevel": 23,
        "lastPlayTime": 0
      },
      ]
    "performanceSummary": {
      "mostPlayedChampions": [
        {
          "championName": "Aatrox",
          "championIconUrl": "https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/Aatrox.png",
          "gamesPlayed": 3
        }
      ],
      "highestDamageChampions": [
        {
          "championName": "Aatrox",
          "championIconUrl": "https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/Aatrox.png",
          "highestDamage": 25000
        }
      ]
    }
  }
}
```

### Erro

```json
{
  "result": false,
  "message": "Erro ao buscar jogador pelo nome de usuário! Jogador não encontrado na Riot API",
  "data": null
}
```

## Regras de negócio / observações

- A resposta é envelopada por `ServiceResult<PlayerStatsDto>`.
- Em caso de sucesso, `result` retorna `true`, `data` contém o DTO e `message` tende a ser `null`.
- Em caso de erro, o controller retorna `400 Bad Request` com `result: false`, `message` preenchida e `data: null`.
- `Nickname` e `Hashtag` são recebidos por rota via `PlayerSearchRequestDto`.
- O back-end busca o `puuid`, dados de conta, elos, ids de partidas recentes, detalhes das partidas e resumos calculados.
- Se a Riot API não retornar ids de partidas, o serviço falha com mensagem de "Nenhuma partida encontrada para este jogador.".
- Se alguma partida individual falhar ao buscar detalhes, ela pode ser ignorada no array `recentMatches`.
- `rankedStats.elos` pode retornar lista vazia quando a Riot API retornar uma lista vazia de elos.
- `MatchResult` é serializado como número: `0` para `Victory`, `1` para `Defeat` e `2` para `Remake`.
- Campos marcados como nullable nos DTOs podem retornar `null`, principalmente dados vindos diretamente da Riot API como nomes, champion info e elos.
- > TODO: validar comportamento real do parâmetro `count` quando enviado vazio, inválido ou omitido.
