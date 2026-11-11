import { manuscriptAttribution, type Work } from "@/lib/works";
import { Signature, SHEET, sheetStyle } from "./Signature";

export function Manuscript({ work }: { work: Work }) {
  const style = sheetStyle(work.genres);
  const sheet = SHEET[style];
  const attribution = manuscriptAttribution(work);
  const first = work.paragraphs.findIndex((p) => /[\p{L}\p{N}]/u.test(p));
  return (
    <div className="reader-surround">
      <div className={`manuscript manuscript-${style}`}>
        <div className="manuscript-ornament" aria-hidden="true"><span />{sheet.ornament}<span /></div>
        {work.image && <figure className="mb-10"><img src={work.image.src} alt={work.image.alt} loading="lazy" className="h-auto w-full" /><figcaption className="mt-3 text-center text-sm italic text-ink-sepia">{work.image.alt}</figcaption></figure>}
        <div className="manuscript-prose">
          {work.paragraphs.map((p, k) => /^[*·~—✧\-]{1,}\s*$|^\*\s*\*\s*\*$/.test(p.trim())
            ? <p key={k} className="manuscript-divider">{p}</p>
            : <p key={k} className={k === first ? "reader-dropcap" : undefined}>{p}</p>)}
        </div>
        {attribution.type === "author" ? <p className="mt-14 text-right font-handwritten text-4xl text-ink-black">{attribution.name}</p> : attribution.type === "vespera" ? <Signature style={style} /> : <div className="manuscript-ornament mt-14" aria-hidden="true"><span />{sheet.separator}<span /></div>}
      </div>
    </div>
  );
}