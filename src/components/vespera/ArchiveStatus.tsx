import type { Work } from "@/lib/works";

export function ArchiveStatus({ works }: { works: Work[] }) {
  if (!works.some((work) => work.source === "fallback")) return null;
  return <p role="status" className="mx-auto max-w-3xl border-b border-border px-5 py-3 text-sm text-rose">O arquivo remoto está indisponível. Exibindo a última cópia de segurança do arquivo ({works.length} manuscritos); publicações mais recentes podem ainda não aparecer.</p>;
}