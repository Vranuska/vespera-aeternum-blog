<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Works are validated and read live from GitHub via `src/lib/works.ts`; the bundled dated snapshot is used only on failure, never merged over live content, to preserve availability without overriding manuscripts.
- Author-declared remote metadata takes precedence over local editorial suggestions; book order uses approved IDs in `src/data/reading-order.ts`, otherwise a neutral title index and explicit series positions, to avoid fabricating canon.
- Reusable `Manuscript` renders original paragraphs verbatim and only declared author-owned images; a Vespera signature requires her presence or explicit authorship, so independent stories are not attributed to her.
- Editorial metadata lives in `src/data/` (catalog = genres/collection/themes keyed by work id, characters = Bestiary sheets, atlas = maps/places); it never copies manuscript text beyond literal quotes, so it can move to the admin DB in phase 3.
- Reader sheet look varies by genre via `src/components/vespera/Signature.tsx` (visual only; manuscript content untouched).
- Reader paper tones and ruling are CSS tokens; calligraphy is loaded in the root font stylesheet, keeping visual changes separate from manuscript content.
- Reader neighbor selection is centralized in `readerNavigation`; `BookNavigation` renders the same book controls above and below the manuscript, preserving chronology and keeping index positions out of literary metadata.
- Universe chronology and approved reading order come only from the literary repo's editorial/indice-romance-mosaico.json via `src/lib/editorial.ts` (minimal fallback in `src/data/editorial-fallback.json`); never derive it from publication dates.

## Prioridade visual da página inicial
- A composição aprovada é a do commit 5a038b8 ("Reforged Vespera home page"): cabeçalho vinho quase negro, monograma botânico dourado, índice lateral delicado e manuscrito/pergaminho como protagonista desde o início.
- Não reintroduzir hero fotográfico de tela inteira, grade de cards protagonista ou visual genérico de blog.
- A Constellation é uma seção secundária, depois do manuscrito e da lista de outros manuscritos; não substitui a leitura tradicional.
- Preservar responsividade, foco visível e respeito a prefers-reduced-motion.

## Integridade de dados e do Atlas
- Manter src/data/entries-fallback.json sincronizado com o arquivo canônico entries.json (47 obras em 10/11/2026); a cópia local só é usada quando a leitura remota falha.
- Manter src/data/editorial-fallback.json sincronizado com editorial/indice-romance-mosaico.json (16 capítulos, 16 itens cronológicos e 31 fora da cronologia em 10/11/2026).
- O Atlas distingue documentado, menção e provisório. Não inventar geografia, leis, habitantes, habilidades ou portais; uma conexão inferida deve permanecer identificada como inferida.
- A Umbra é responsabilidade de Vespera na distinção/relação com a realidade física; o Sonhar é domínio reconhecido. As geografias internas continuam em aberto.

## Sincronização e publicação
- Confirmar explicitamente que cada commit do workspace Lovable chegou ao repositório GitHub e que o deploy público corresponde ao commit esperado. Preview, commit e produção são estados distintos.
