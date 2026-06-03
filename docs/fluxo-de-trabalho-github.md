# Fluxo de trabalho com GitHub Issues e GitHub Projects

Este documento define o padrão de organização do projeto CADE-O-DANO usando GitHub Issues, GitHub Projects, branches, commits e Pull Requests.

O objetivo é substituir o controle manual em ferramentas externas por um fluxo rastreável dentro do GitHub, mantendo tarefas, código, revisão e histórico conectados.

## Conceito principal

- Issue: tarefa, bug, melhoria ou documentação.
- Project: quadro visual onde as issues são organizadas.
- Branch: ramificação criada para desenvolver uma issue específica.
- Pull Request: solicitação para revisar e juntar uma branch na branch principal de desenvolvimento.

## GitHub Projects

O Project deve funcionar como o quadro oficial de acompanhamento do projeto.

Colunas usadas:

```txt
Backlog
Pendente
Em andamento
Concluído
Ideias futuras
```

Uso recomendado:

- `Backlog`: tarefas mapeadas, mas ainda não priorizadas para execução imediata.
- `Pendente`: tarefas priorizadas e prontas para começar.
- `Em andamento`: tarefa sendo desenvolvida em uma branch própria.
- `Concluído`: tarefa finalizada, revisada e integrada.
- `Ideias futuras`: tarefas que podem ser implementadas no futuro.

As issues devem receber labels para deixar claro o tipo de trabalho, como:

```txt
frontend
backend
ui/ux
tooling
documentation
bug
```

## Padrão de issues

Cada tarefa relevante deve virar uma issue separada.

Para tarefas de frontend e backend, devemos criar issues separadas, mesmo que façam parte da mesma funcionalidade.

Exemplo:

- Backend: buscar partida em tempo real na API.
- Frontend: criar interface da partida em tempo real.

Isso evita que duas pessoas trabalhem na mesma branch e misturem commits, responsabilidades e alterações.

### Template de issue

Use a estrutura abaixo como padrão para descrição das issues:

```md
## Descrição

Descreva de forma objetiva o que deve ser implementado, corrigido ou documentado.

Explique o contexto da tarefa e o resultado esperado.

## Escopo

- Item principal que precisa ser feito.
- Integração, regra ou tela envolvida.
- Tratamento de erro, estado vazio ou caso especial relevante.
- Ajuste visual, técnico ou documental necessário.

## Critérios de aceite

- A aplicação deve apresentar o comportamento esperado.
- Os principais cenários da tarefa devem funcionar.
- Erros ou estados vazios devem ter tratamento claro.
- A implementação deve respeitar o padrão do projeto.

## Dependências

- Depende da issue #numero.
```

A seção `Dependências` só precisa ser usada quando a issue depender de outra tarefa.

Exemplo:

```md
## Descrição

Implementar a visualização da partida em tempo real do jogador pesquisado.

A feature deve consultar se o jogador está em uma partida ativa e exibir os dados principais da composição atual, incluindo times, campeões, feitiços, runas e bans.

## Escopo

- Criar endpoint para buscar partida ativa pelo `puuid`.
- Consumir dados da Spectator API da Riot.
- Enriquecer resposta com Data Dragon.
- Exibir a partida ativa no front-end.
- Tratar caso em que o jogador não está em partida.

## Critérios de aceite

- Ao buscar um jogador em partida, a aplicação mostra os dois times.
- Cada participante mostra campeão, spells e runas.
- Bans dos times são exibidos quando disponíveis.
- Se não houver partida ativa, exibir mensagem clara.
```

## Dependência entre issues

Quando uma issue depende de outra, isso deve ser informado na descrição.

Exemplo na issue de frontend:

```md
## Dependências

- Depende da issue #6.
```

Quando houver dependência, a issue deve ficar na coluna `Bloqueado` até que a tarefa necessária seja concluída.

## Padrão de branches

Cada issue deve ter sua própria branch.

Padrão:

```txt
area/tipoNumero-descricao-curta
```

Exemplos:

```txt
back/feat006-buscar-partida-tempo-real
front/feat007-interface-partida-tempo-real
front/feat28-card-partida-tempo-real
docs/docs031-fluxo-trabalho-github
```

Áreas:

```txt
front
back
docs
```

Tipos:

```txt
feat
fix
refactor
chore
docs
```

Regras:

- Use o número da issue na branch.
- Use descrição curta em kebab-case.
- Não use acentos, espaços ou caracteres especiais no nome da branch.
- Não trabalhe em duas issues diferentes na mesma branch.
- Não misture frontend e backend na mesma branch.

## Padrão de commits

As mensagens de commit devem seguir o formato:

```txt
area/tipo: descrição curta do que mudou
```

Exemplos:

```txt
front/feat: adiciona card de partida em tempo real
back/fix: corrige retorno de partida ativa sem bans
docs: documenta fluxo de trabalho com issues
front/refactor: separa montagem dos dados do dashboard
```

Regras:

- A área deve indicar onde a alteração principal aconteceu.
- O tipo deve indicar a natureza da mudança.
- Para alterações apenas de documentação, use `docs: descrição curta`, sem repetir `docs/docs`.
- A descrição deve ser curta, clara e em português.
- Use letras minúsculas no prefixo.
- Não use mensagens genéricas como `ajustes`, `teste` ou `mudanças`.

Como o repositório usa `Squash and merge` com o título do Pull Request como mensagem padrão do commit final, o título do PR deve seguir o padrão definido na seção de Pull Requests.

## Fluxo de desenvolvimento

1. Criar a issue.
2. Adicionar a issue ao GitHub Project.
3. Classificar com labels de área e tipo.
4. Criar branch própria a partir da issue.
5. Desenvolver a tarefa na branch.
6. Fazer commits seguindo o padrão do projeto.
7. Abrir Pull Request.
8. Vincular o PR à issue usando `Closes #numero`.
9. Mover a issue para `Validação`.
10. Revisar e testar.
11. Fazer merge na branch `dev`.
12. Testar integração na `dev`.
13. Quando tudo estiver validado, preparar release para `main`.

## Padrão de Pull Requests

O Pull Request deve explicar o que foi feito e deixar claro o impacto da alteração.

### Título do Pull Request

O título do Pull Request deve seguir o padrão abaixo, porque ele será usado como mensagem do commit final no `Squash and merge`.

```txt
tipo/area: descrição curta (#numero-da-issue)
```

Exemplos:

```txt
feat/back: trazer partida em tempo real (#17)
feat/front: criar card da partida em tempo real (#18)
fix/back: corrigir cálculo de dano (#22)
docs: atualizar fluxo de trabalho (#31)
```

Regras:

- Use `feat/front`, `feat/back`, `fix/front`, `fix/back`, `refactor/front`, `refactor/back` ou variações equivalentes quando a alteração estiver ligada a uma área específica.
- Para documentação, use apenas `docs: descrição curta (#numero)`.
- A descrição deve ser curta, objetiva e em português.
- O número da issue deve aparecer no final do título entre parênteses.
- Evite títulos genéricos como `Ajustes`, `Update docs` ou `Correções`.

### Template de Pull Request

Use a estrutura abaixo como padrão:

```md
## Contexto

Explique o objetivo do PR e qual problema ele resolve.

Informe a issue relacionada.

Closes #numero

## O que mudou

- Alteração principal feita no projeto.
- Serviço, componente, tela, endpoint ou documentação criada.
- Regra de negócio, tratamento ou integração ajustada.

## Contrato do endpoint

Use esta seção quando o PR alterar ou criar contrato de API.

Endpoint:

GET /rota/exemplo

Response:

{
  "id": "123",
  "name": "Exemplo"
}

## Observações

- Pontos importantes para revisão.
- Limitações conhecidas.
- Testes feitos.
- Warnings existentes que não foram causados pelo PR.
```

Se o PR não alterar API, a seção `Contrato do endpoint` pode ser removida.

## Integração entre front-end e back-end

O back-end deve documentar o contrato da API na própria issue, no Pull Request ou na pasta `/docs`.

Exemplo:

````md
## Endpoint

GET /match/live

## Response

```json
{
  "matchId": "123",
  "gameMode": "CLASSIC",
  "participants": []
}
```
````

O front-end pode começar usando mock enquanto o back-end ainda não terminou.

Depois que o back-end finalizar, o front-end deve trocar o mock pela API real.

## Regra mais importante

Não devemos trabalhar duas pessoas na mesma branch.

Cada issue deve ter sua própria branch.

Isso mantém o histórico limpo, facilita revisão, evita conflito desnecessário e deixa claro quem fez cada parte.

## Orientação da IA

O arquivo `AGENTS.md`, na raiz do projeto, registra as instruções para que assistentes de IA ajudem o time a seguir este fluxo.

Sempre que a IA for usada para implementar, revisar ou documentar algo no projeto, ela deve reforçar:

- criação ou identificação da issue relacionada;
- uso de branch própria para cada issue;
- separação entre tarefas de front-end, back-end e documentação;
- commits no padrão do projeto;
- Pull Requests com contexto, mudanças, observações e vínculo com a issue;
- documentação de contratos de API quando houver integração entre front-end e back-end.
