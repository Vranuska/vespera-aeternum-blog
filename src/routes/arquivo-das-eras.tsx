import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Constellation } from "@/components/vespera/Constellation";
import { Monogram } from "@/components/vespera/Monogram";
import { Ornament } from "@/components/vespera/Ornament";
import { worksQuery } from "@/lib/works";
import { editorialQuery } from "@/lib/editorial";

const FORMS = [
  { genre: "diário", label: "Diários", note: "O que foi escrito enquanto o tempo ainda estava acontecendo." },
  { genre: "conto", label: "Contos", note: "Vidas inteiras, ou quase, guardadas entre duas capas." },
  { genre: "crônica", label: "Crônicas", note: "Pequenas ocorrências que se recusaram a ser esquecidas." },
  { genre: "carta", label: "Cartas", note: "Palavras enviadas, retidas ou destinadas a ninguém." },
  { genre: "poema", label: "Poemas", note: "Uma prateleira reservada; nenhum texto será inventado para preenchê-la." },
  { genre: "memória", label: "Memórias", note: "Lembranças cujo lugar nem sempre coincide com a data em que foram escritas." },
  { genre: "fragmento", label: "Fragmentos", note: "Páginas que chegaram sem a obrigação de explicar tudo." },
  { genre: "confissão", label: "Confissões", note: "Aquilo que a narradora admite, ainda que com ressalvas." },
  { genre: "diálogo", label: "Diálogos", note: "Conversas preservadas pelo que disseram e pelo que deixaram de dizer." },
  { genre: "romance-mosaico", label: "Romance-mosaico", note: "Obras autónomas que, lidas em conjunto, revelam relações e consequências." },
] as const;

export const Route = createFileRoute("/arquivo-das-eras")({
  head: () => ({
    meta: [
      { title: "Arquivo das Eras — Vespera Aeternum" },
      { name: "description", content: "Um arquivo gótico e navegável por anos, meses, dias, formas literárias e memórias fora da cronologia." },
      { property: "og:title", content: "Arquivo das Eras — Vespera Aeternum" },
      { property: "og:description", content: "Nem todas as lembranças obedecem à ordem em que foram escritas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(worksQuery),
    context.queryClient.ensureQueryData(editorialQuery),
  ]),
  component: ArchiveOfEras,
});

function ArchiveOfEras() {
  const { data: works } = useSuspenseQuery(worksQuery);
  const { data: editorial } = useSuspenseQuery(editorialQuery);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center"><Monogram className="h-14 w-14 text-gold" /></div>
        <p className="label-archive mt-5 text-gold">Arquivo temporal · {works.length} manuscritos preservados</p>
        <h1 className="mt-4 font-display text-6xl font-light leading-none text-parchment sm:text-8xl">
          Arquivo das <em className="text-rose">Eras</em>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-display text-xl italic leading-relaxed text-parchment/85">
          Não guardo estas páginas em uma única ordem. Há lembranças que chegaram antes de seus próprios motivos; outras só encontraram uma data muitos anos depois.
        </p>
        <Ornament className="mt-8" />
      </header>

      <section className="mx-auto mt-10 max-w-[58rem] frame-gold bg-header px-3 py-2 sm:px-8">
        <Constellation index={editorial} works={works} />
      </section>

      <section className="mt-20 border-t border-border pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-archive text-gold">Índice por forma</p>
          <h2 className="mt-3 font-display text-4xl italic text-parchment sm:text-5xl">As maneiras de permanecer</h2>
          <p className="mt-4 text-lg italic text-sage">
            A data abre uma porta; a forma literária abre outra. Nenhuma delas altera a ordem de leitura aprovada para o romance-mosaico.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMS.map((form) => {
            const count = works.filter((work) => work.genres.includes(form.genre)).length;
            return (
              <li key={form.genre}>
                <Link
                  to="/biblioteca"
                  search={{ generos: [form.genre] }}
                  className="group flex h-full min-h-40 flex-col border border-gold/30 bg-plum/65 p-5 transition-colors hover:border-gold hover:bg-wine/70 focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <span className="label-archive text-gold">
                    {count ? `${count} ${count === 1 ? "registro" : "registros"}` : "Prateleira reservada"}
                  </span>
                  <span className="mt-3 font-display text-3xl text-parchment transition-colors group-hover:text-rose">{form.label}</span>
                  <span className="mt-2 text-parchment/70">{form.note}</span>
                  <span className="mt-auto pt-5 label-archive text-rose">Abrir índice →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <nav aria-label="Outras salas do arquivo" className="mt-20 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
        <Link to="/diarios" className="border-b border-border pb-4 font-display text-2xl italic text-parchment hover:text-rose">
          Leitura contínua <span className="block label-archive mt-2 text-sage">Todos os diários e manuscritos</span>
        </Link>
        <Link to="/atlas" className="border-b border-border pb-4 font-display text-2xl italic text-parchment hover:text-rose">
          Atlas dos Domínios <span className="block label-archive mt-2 text-sage">Lugares, passagens e fronteiras</span>
        </Link>
        <Link to="/bestiario" className="border-b border-border pb-4 font-display text-2xl italic text-parchment hover:text-rose">
          Bestiário <span className="block label-archive mt-2 text-sage">Presenças e testemunhos</span>
        </Link>
      </nav>
    </div>
  );
}
