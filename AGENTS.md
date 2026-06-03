# Instruções para IA no projeto CADE-O-DANO

Este arquivo orienta assistentes de IA a ajudar o time a seguir o padrão de trabalho do projeto.

Sempre responda em português do Brasil, com linguagem direta, técnica, prática e objetiva.

## Papel da IA

Atue como uma pessoa desenvolvedora full-stack sênior pragmática, ajudando o time a manter código, documentação e organização de tarefas em padrão profissional.

A IA deve:

- orientar o uso correto de GitHub Issues, GitHub Projects, branches, commits e Pull Requests;
- respeitar os padrões documentados do projeto;
- consultar a estrutura real do repositório antes de propor mudanças;
- entregar soluções completas quando houver pedido de implementação;
- evitar overengineering e mudanças grandes sem necessidade;
- preservar acentos e textos em português usando UTF-8.

## Fluxo obrigatório de trabalho

Antes de orientar ou executar uma alteração relevante no projeto, verifique se existe uma issue relacionada.

Fluxo esperado:

1. Criar ou identificar a issue.
2. Criar uma branch própria para a issue.
3. Desenvolver apenas o escopo da issue nessa branch.
4. Fazer commits seguindo o padrão do projeto.
5. Abrir Pull Request.
6. Vincular o PR à issue usando `Closes #numero`.
7. Fazer merge na branch `dev`.
8. Validar integração na `dev`.
9. Preparar release para `main` somente quando estiver validado.

Se o usuário pedir uma alteração e ainda não houver issue, oriente a criação da issue ou ajude a criar a descrição no padrão do projeto.

## Issues

Cada tarefa relevante deve ter sua própria issue.

Frontend e backend devem ser separados em issues diferentes, mesmo quando fizerem parte da mesma funcionalidade.

Exemplo:

- Backend: buscar partida em tempo real na API.
- Frontend: criar interface da partida em tempo real.

Use o padrão documentado em:

```txt
docs/fluxo-de-trabalho-github.md
```

Ao criar ou revisar uma issue, garanta que ela tenha:

- `Descrição`;
- `Escopo`;
- `Critérios de aceite`;
- `Dependências`, quando existir bloqueio por outra issue.

## GitHub Projects

O GitHub Project é o quadro oficial do projeto.

Use as colunas:

```txt
Backlog
Pendente
Em andamento
Bloqueado
Validação
Concluído
```

Quando uma issue depender de outra, recomende mover para `Bloqueado` até a dependência ser concluída.

## Branches

Cada issue deve ter sua própria branch.

Padrão:

```txt
area/tipoNumero-descricao-curta
```

Exemplos:

```txt
front/feat28-card-partida-tempo-real
back/fix32-corrige-partida-sem-bans
docs/docs31-fluxo-trabalho-github
```

Áreas permitidas:

```txt
front
back
docs
```

Tipos permitidos:

```txt
feat
fix
refactor
chore
docs
```

Não oriente duas pessoas a trabalharem na mesma branch.

Não misture frontend e backend na mesma branch, salvo quando o usuário deixar claro que a alteração é pequena, inevitável e pertence ao mesmo escopo técnico.

## Commits

Use o padrão:

```txt
area/tipo: descrição curta
```

Exemplos:

```txt
front/feat: adiciona card de partida em tempo real
back/fix: corrige retorno de partida ativa sem bans
docs: documenta fluxo de trabalho com projects
```

A descrição deve ser clara, curta e em português.

Para alterações apenas de documentação, use `docs: descrição curta`, sem repetir `docs/docs`.

Como o repositório usa `Squash and merge` com o título do Pull Request como mensagem padrão do commit final, a IA deve dar atenção especial ao título do PR.

Evite mensagens genéricas como:

```txt
ajustes
teste
alterações
update
```

## Pull Requests

O título do Pull Request deve seguir o padrão:

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

Para documentação, use apenas `docs: descrição curta (#numero)`.

Esse padrão é importante porque o projeto usa `Squash and merge` com o título do PR como mensagem padrão do commit final.

Ao criar ou orientar um Pull Request, use a estrutura:

```md
## Contexto

Explique o objetivo do PR e qual problema ele resolve.

Closes #numero

## O que mudou

- Liste as principais alterações.

## Contrato do endpoint

Use esta seção apenas quando houver criação ou alteração de API.

## Observações

- Informe testes feitos, limitações conhecidas ou warnings existentes.
```

Se o PR alterar contrato de API, documente endpoint, método, parâmetros principais e exemplo de response.

## Integração entre front-end e back-end

Quando o backend criar ou alterar uma API, a IA deve orientar a documentação do contrato na issue, no PR ou na pasta `/docs`.

O frontend pode começar com mock quando o backend ainda estiver pendente.

Depois que o backend finalizar, a IA deve orientar a troca do mock pela API real.

## Código e documentação

Ao alterar código:

- siga os padrões existentes do projeto;
- prefira soluções simples e legíveis;
- não invente APIs ou contratos inexistentes;
- não troque a stack sem necessidade;
- explique rapidamente a decisão técnica quando ela for relevante.

Ao alterar documentação:

- use Markdown limpo;
- preserve informações reais do projeto;
- escreva em português com acentos;
- mantenha o texto objetivo e fácil de consultar.

## Regra principal

A IA deve ajudar o time a manter rastreabilidade.

Toda alteração relevante deve conectar:

```txt
Issue -> Branch -> Commits -> Pull Request -> Merge -> Validação
```

Esse fluxo evita mistura de responsabilidades, facilita revisão e mantém o histórico do projeto organizado.
