# Roadmap — Vespera Aeternum Blog

## Base da aplicação
- [x] Biblioteca com filtros por gênero, personagem, lugar, tema, coleção e data.
- [x] Bestiário com fichas individuais e ligações com os manuscritos; dossiês canônicos exibem imagem principal, galeria, cronologia, biografia, aptidões, limites e citações.
- [x] Atlas navegável com cosmologia, mapas, painel de lugar e trilha.
- [x] Leitor em papel envelhecido, capitular, assinatura e variações visuais por gênero.
- [x] Navegação anterior/próximo do modo livro, separada da cronologia do universo.

## Portal Reforged — 10/11/2026
- [x] Restaurar a composição aprovada no commit 5a038b8: cabeçalho vinho, monograma botânico dourado, índice lateral e manuscrito protagonista desde o início.
- [x] Remover o hero fotográfico de tela inteira e manter a prancha apenas como imagem pequena e emoldurada.
- [x] Manter outros manuscritos em linhas de leitura, sem grade de cards protagonista.
- [x] Integrar a Constelação de memórias como seção navegável do portal, depois do manuscrito em destaque e da lista de leitura.
- [x] Separar ordem editorial do Volume I (17 capítulos) da cronologia do universo.
- [x] Cópia offline com 49 manuscritos, sem IDs duplicados.
- [x] Cópia offline do índice editorial: 17 capítulos, 17 itens cronológicos e 32 obras fora da cronologia.
- [x] Coleção Arquivo das Eras, gênero e temas de A maré não assina recibos disponíveis nos filtros da Bibliotheca.
- [x] Acesso direto da navegação lateral à Constelação e à coleção Arquivo das Eras.
- [x] Navegação temporal por ano, mês e dia; datas de semana ou mês preservam sua precisão sem receber dias inventados.
- [x] Leitor reconhece `related_entries`, prioriza vínculos editoriais explícitos e preserva a autonomia das narrativas relacionadas.
- [x] Prerender usa snapshots sincronizados para evitar requisições remotas repetidas durante a compilação.
- [x] Cartão e leitor integral respeitam a mesma regra de autoria; narrativas independentes não recebem assinatura de Vespera por padrão.
- [x] Diários e lista de manuscritos ordenados pela data explícita de publicação; obras sem data mantêm sua ordem de arquivo e a cronologia do universo continua separada.
- [x] Integrar o dossiê canônico de Eithne ao portal React, preservando o registro de outras presenças como menção até haver material suficiente para uma ficha completa.

## Atlas e cânone
- [x] Resolver referências `atlas/lugar/*` pelo mapeamento canônico de marcadores, tornando navegáveis as ligações recíprocas entre a Biblioteca dos Registros Velados e os Jardins da Primeira Manhã.
- [x] Registrar O Entre como princípio que permite a coexistência dos opostos e a presença consciente de Vespera desde a Criação.
- [x] Registrar a responsabilidade de Vespera pela distinção e relação entre Umbra e realidade física.
- [x] Reconhecer o Sonhar como domínio distinto do mundo desperto, sem inventar sua cartografia.
- [x] Registrar o Pasaje de la Calandria, em Barracas, Buenos Aires, com estado provisório e traçado parcial.
- [x] Integrar ao Atlas React as imagens, a história, as leis, os habitantes e as referências cruzadas do `atlas.json`, sem alterar a geometria ilustrativa nem completar mapas ainda desconhecidos.
- [ ] Produzir imagem própria do Pasaje e aprofundar as fichas de Micaela Funes e Elena Roldán quando houver material narrativo suficiente.
- [ ] Desenvolver cartografia interna da Umbra e do Sonhar somente a partir de manuscritos que estabeleçam regiões, leis e habitantes.

## Validação e publicação
- [x] Sincronizar os snapshots offline de entradas e índice editorial com os arquivos canônicos e exigir igualdade exata antes do prerender.
- [x] 42 testes de regressão aprovados no GitHub Actions em 12/11/2026, incluindo arquivo, continuidade, atribuição e snapshots canônicos do Bestiário e do Atlas.
- [x] Verificação TypeScript sem erros no workspace Lovable em 10/11/2026.
- [x] Conferência visual em desktop e celular: manuscrito em destaque e sem rolagem horizontal; navegação da Constelação com elementos focáveis.
- [x] Remover a entrada SSR customizada (`src/server.ts`) e a configuração explícita `server.entry`; o portal volta a usar a entrada embutida do TanStack Start, que já trata contexto de requisição e erros de SSR.
- [x] Revalidar a suíte após as alterações de publicação e navegação temporal: 47 testes aprovados em 8 arquivos no workflow 43709184834; prerender concluído.
- [x] Confirmar prerender, upload e conclusão do deploy React no workflow 43709184834; a confirmação do conteúdo servido permanece separada.
- [ ] Alterar a fonte do GitHub Pages em Settings → Pages → Build and deployment → Source para `GitHub Actions`. A execução dinâmica 43709184621, de 15/11/2026, ainda executou `Build with Jekyll` a partir de `main`; o deploy React do workflow não elimina essa publicação concorrente.
- [ ] Reconciliar o commit informado pelo projeto Lovable com o histórico de `main`; o SHA reportado pelo projeto não foi encontrado no repositório conectado.
- [ ] Confirmar separadamente por HTTP e inspeção visual que o endereço público está servindo o artefato React; a tentativa de acesso neste ambiente não retornou uma página legível.
- [ ] Completar fichas de personagens humanos do Ciclo das Inacabadas sem inventar biografia ou habilidades.
- [ ] Etapa 3: editor administrativo de gêneros e mapas, dependente de autenticação/Cloud.


## Correção do pipeline — 15/11/2026
- [x] Sincronizar o snapshot editorial offline byte a byte com o índice canônico e atualizar expectativas obsoletas de 16 capítulos/48 obras.
- [x] Corrigir a expectativa da lista diária para a obra publicada em 15/11/2026.
- [x] Validar 47 testes, snapshots, Bestiário, Atlas, prerender e deploy React no workflow 43709184834.
- [x] Tornar o nome do artefato único por execução e tentativa para evitar colisões em reexecuções.
- [ ] Alterar a origem do Pages para GitHub Actions e conferir a página pública por HTTP e visualmente; o workflow dinâmico ainda executa Jekyll.
