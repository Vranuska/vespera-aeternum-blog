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

- Works are read live from GitHub `Vranuska/vespera-aeternum/entries.json` via `src/lib/works.ts` (single source, no content duplication).
- Editorial metadata lives in `src/data/` (catalog = genres/collection/themes keyed by work id, characters = Bestiary sheets, atlas = maps/places); it never copies manuscript text beyond literal quotes, so it can move to the admin DB in phase 3.
- Reader sheet look varies by genre via `src/components/vespera/Signature.tsx` (visual only; manuscript content untouched).

- Universe chronology and approved reading order come only from the literary repo's `editorial/indice-romance-mosaico.json` via `src/lib/editorial.ts` (minimal fallback in `src/data/editorial-fallback.json`); never derive it from publication dates.

- The homepage must preserve the approved Reforged portal and mount `Constellation`: rotating rings, the central phrase, era/month navigation, and a separate editorial reading-order list. The universe chronology and reading order are distinct.
- Keep `src/data/editorial-fallback.json` synchronized with the canonical `editorial/indice-romance-mosaico.json`; it is a minimal offline index, not a replacement for the manuscript archive.
- Atlas places support optional imagery, history, laws/limits, inhabitants, Bestiary links, works, secrets, and verified connections. Mark incomplete cartography as provisional; never infer a portal or a connection from silence.
