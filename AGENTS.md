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
9. Criar uma branch `release/x.y.z` a partir da `main`.
10. Fazer merge da `dev` na branch de release.
11. Validar a branch de release.
12. Abrir Pull Request de `release/x.y.z` para `main`.
13. Fazer merge na `main`.
14. Criar a tag da versão a partir da `main`.

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

## Releases

Quando a `dev` estiver validada, prepare a versão em uma branch própria criada a partir da `main`.

Padrão:

```txt
release/x.y.z
```

Exemplo:

```txt
release/1.0.0
```

Fluxo esperado:

1. Atualizar a `main`.
2. Criar `release/x.y.z` a partir da `main`.
3. Fazer merge da `dev` na branch de release.
4. Resolver conflitos, se existirem.
5. Rodar as validações do projeto.
6. Abrir PR de `release/x.y.z` para `main`.
7. Fazer merge na `main`.
8. Criar a tag `vx.y.z` a partir da `main`.
9. Publicar a tag no GitHub.

Não crie tag diretamente na `dev`. A tag deve apontar para o commit que realmente foi integrado na `main`.

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

Evite mensagens genéricas como:

```txt
ajustes
teste
alterações
update
```

## Pull Requests

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
