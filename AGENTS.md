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

Antes de alterar arquivos, também valide se a branch atual, o tipo da mudança e o fluxo solicitado estão compatíveis com os padrões documentados. Se houver desvio relevante, avise o usuário e peça confirmação explícita antes de prosseguir.

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
13. Fazer merge na `main`, preferencialmente com squash merge quando o objetivo for manter um único commit de release.
14. Criar a tag da versão a partir da `main`.
15. Sincronizar a `dev` com a `main` publicada, quando necessário, para manter o histórico de desenvolvimento alinhado com a versão entregue.

Se o usuário pedir uma alteração e ainda não houver issue, oriente a criação da issue ou ajude a criar a descrição no padrão do projeto.

## Validação obrigatória antes de alterações com IA

Antes de realizar qualquer alteração relevante, a IA deve validar:

1. Branch atual.
2. Tipo da alteração solicitada: `feat`, `fix`, `docs`, `chore` ou `refactor`.
3. Área afetada: `front`, `back` ou `docs`.
4. Existência de issue relacionada, quando aplicável.
5. Compatibilidade com o fluxo documentado.
6. Risco de alteração em branch protegida, branch de release ou branch incompatível com a mudança.

Se a branch atual não estiver compatível com a alteração, a IA deve avisar antes de editar arquivos.

Se o usuário quiser prosseguir mesmo fora do fluxo documentado, a IA deve pedir confirmação explícita e registrar na resposta que a alteração foi feita como exceção.

Exceções aceitáveis:

- correções finais pequenas diretamente na branch de release;
- ajustes de documentação da própria release;
- correções emergenciais autorizadas pelo usuário.

Mesmo nas exceções, a IA deve informar o impacto no fluxo de trabalho.

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

Para documentação, não repita `docs/docs`. Use:

```txt
docsNumero-descricao-curta
```

Exemplos:

```txt
front/feat28-card-partida-tempo-real
back/fix32-corrige-partida-sem-bans
docs31-fluxo-trabalho-github
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
10. Sincronizar a `dev` com a `main`, se a publicação da release tiver criado um commit próprio na `main`.

Não crie tag diretamente na `dev`. A tag deve apontar para o commit que realmente foi integrado na `main`.

### Commit de release na main

Quando o objetivo for manter a `main` com um único commit por versão, use squash merge no PR `release/x.y.z` -> `main`.

Nesse caso, edite manualmente a mensagem do squash antes de concluir o merge.

Título recomendado:

```txt
Release: publica versão x.y.z
```

Descrição recomendada:

```md
Publica a versão x.y.z da aplicação.

PRs e commits incluídos nesta versão:

- #numero área/tipo: descrição curta
- área/tipo: descrição curta

Validações:

- Front-end lint executado
- Front-end build executado
- Back-end build executado

Tag da versão:

- vx.y.z
```

O commit de release deve registrar o fluxo técnico da versão. A descrição detalhada de produto, com novidades e correções em linguagem mais amigável, deve ficar na GitHub Release associada à tag.

Se a release for publicada com squash merge, os commits originais da `dev` não entram como ancestrais diretos da `main`. Isso é esperado. Para evitar confusão no compare do GitHub, sincronize a `dev` com a `main` depois da publicação.

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
