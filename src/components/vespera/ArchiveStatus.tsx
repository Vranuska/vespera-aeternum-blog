import type { Work } from "@/lib/works";

export function ArchiveStatus({ works }: { works: Work[] }) {
  if (!works.some((work) => work.source === "fallback")) return null;
  return <p role="status" className="mx-auto max-w-3xl border-b border-border px-5 py-3 text-sm text-rose">O arquivo remoto está indisponível. Exibindo a cópia de segurança de 23 de outubro de 2026; publicações posteriores podem não aparecer.</p>;
}