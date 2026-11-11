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
- [x] Preservar a Constelação de memórias como seção secundária depois do manuscrito e da lista.
- [x] Separar ordem editorial do Volume I (16 capítulos) da cronologia do universo.
- [x] Cópia offline com 48 manuscritos, sem IDs duplicados.
- [x] Cópia offline do índice editorial: 16 capítulos, 16 itens cronológicos e 32 obras fora da cronologia.
- [x] Coleção Arquivo das Eras, gênero e temas de A maré não assina recibos disponíveis nos filtros da Bibliotheca.
- [x] Acesso direto da navegação lateral à Constelação e à coleção Arquivo das Eras.
- [x] Leitor reconhece `related_entries`, prioriza vínculos editoriais explícitos e preserva a autonomia das narrativas relacionadas.
- [x] Prerender usa snapshots sincronizados para evitar requisições remotas repetidas durante a compilação.
- [x] Cartão e leitor integral respeitam a mesma regra de autoria; narrativas independentes não recebem assinatura de Vespera por padrão.
- [x] Integrar o dossiê canônico de Eithne ao portal React, preservando o registro de outras presenças como menção até haver material suficiente para uma ficha completa.

## Atlas e cânone
- [x] Registrar O Entre como princípio que permite a coexistência dos opostos e a presença consciente de Vespera desde a Criação.
- [x] Registrar a responsabilidade de Vespera pela distinção e relação entre Umbra e realidade física.
- [x] Reconhecer o Sonhar como domínio distinto do mundo desperto, sem inventar sua cartografia.
- [x] Registrar o Pasaje de la Calandria, em Barracas, Buenos Aires, com estado provisório e traçado parcial.
- [ ] Produzir imagem própria do Pasaje e aprofundar as fichas de Micaela Funes e Elena Roldán quando houver material narrativo suficiente.
- [ ] Desenvolver cartografia interna da Umbra e do Sonhar somente a partir de manuscritos que estabeleçam regiões, leis e habitantes.

## Validação e publicação
- [x] 22 testes aprovados no workspace Lovable em 10/11/2026.
- [x] Verificação TypeScript sem erros no workspace Lovable em 10/11/2026.
- [x] Conferência visual em desktop e celular: manuscrito em destaque e sem rolagem horizontal; navegação da Constelação com elementos focáveis.
- [ ] Executar e confirmar build de produção (não concluído nesta etapa).
- [ ] Confirmar que o commit restaurado no Lovable está sincronizado ao GitHub main.
- [ ] Publicar a versão validada e confirmar separadamente a resposta HTTP/visual do endereço público.
- [ ] Completar fichas de personagens humanos do Ciclo das Inacabadas sem inventar biografia ou habilidades.
- [ ] Etapa 3: editor administrativo de gêneros e mapas, dependente de autenticação/Cloud.
