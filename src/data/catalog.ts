/**
 * Catálogo editorial — SUGESTÕES de classificação feitas a partir da leitura
 * integral de cada manuscrito. Não altera os textos originais.
 * Será editável no painel administrativo (Etapa 3).
 */

export const GENRES = [
  "diário", "conto", "crônica", "carta", "poema", "confissão",
  "memória", "fragmento", "diálogo", "narrativa mitológica",
] as const;

export const COLLECTIONS = [
  "Diários de Vespera",
  "Memórias de Vespera",
  "Dos arquivos da Casa",
  "O Bestiário · Livro Primeiro",
  "Dos arquivos pessoais de Vespera",
  "Fragmentos da Casa",
] as const;

export const THEMES = [
  "memória e esquecimento", "morte e luto", "amizade", "amor", "fé",
  "disfarces e identidade", "promessas", "a casa", "infância", "justiça",
] as const;

export type WorkMeta = { genres: string[]; collection: string; themes: string[]; characters: string[] };

const D = "Diários de Vespera", M = "Memórias de Vespera", F = "Fragmentos da Casa";

export const WORK_META: Record<string, WorkMeta> = {
  "2026-10-15-a-colher-que-me-venceu": { genres: ["crônica", "memória"], collection: D, themes: ["memória e esquecimento", "disfarces e identidade"], characters: ["vespera", "dona-ines", "o-reflexo"] },
  "2026-10-14-2359": { genres: ["diário", "diálogo"], collection: D, themes: ["disfarces e identidade", "infância"], characters: ["vespera", "o-reflexo", "a-menina-do-sapato-vermelho"] },
  "2026-10-14-1906": { genres: ["diário", "confissão"], collection: D, themes: ["memória e esquecimento", "morte e luto"], characters: ["vespera"] },
  "2026-10-14-1142": { genres: ["diário", "memória"], collection: D, themes: ["infância", "a casa"], characters: ["vespera", "a-menina-do-sapato-vermelho", "o-irmao"] },
  "2026-10-14-0317": { genres: ["diário", "narrativa mitológica"], collection: D, themes: ["morte e luto", "memória e esquecimento"], characters: ["vespera"] },
  "arquivo-o-demonio-errado-v1": { genres: ["memória", "conto"], collection: M, themes: ["amizade", "fé", "disfarces e identidade", "morte e luto"], characters: ["vespera", "padre-tomas", "malpherion", "a-irma"] },
  "arquivo-o-demonio-errado-v2": { genres: ["memória", "conto"], collection: M, themes: ["amizade", "fé", "disfarces e identidade", "morte e luto"], characters: ["vespera", "padre-tomas", "malpherion", "a-morte"] },
  "arquivo-santa-paciencia-padre-tomas-v1": { genres: ["memória", "conto"], collection: M, themes: ["amizade", "justiça", "fé"], characters: ["vespera", "padre-tomas", "dona-beatriz", "mateus"] },
  "arquivo-retorno-onze-meses-v1": { genres: ["fragmento", "memória"], collection: M, themes: ["amizade"], characters: ["vespera", "padre-tomas"] },
  "arquivo-cha-padre-tomas-v1": { genres: ["fragmento", "memória"], collection: M, themes: ["amizade"], characters: ["vespera", "padre-tomas"] },
  "azrakhel-o-demonio-que-veio-me-matar-v1": { genres: ["conto", "narrativa mitológica"], collection: "Dos arquivos da Casa", themes: ["memória e esquecimento", "promessas", "infância", "a casa"], characters: ["vespera", "azrakhel", "eva", "a-irma", "o-reflexo", "a-menina-do-sapato-vermelho"] },
  "bestiario-eithne-v1": { genres: ["memória", "conto"], collection: "O Bestiário · Livro Primeiro", themes: ["morte e luto", "amizade", "promessas"], characters: ["vespera", "eithne"] },
  "recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu": { genres: ["fragmento", "narrativa mitológica"], collection: "Dos arquivos pessoais de Vespera", themes: ["memória e esquecimento", "justiça"], characters: ["vespera", "aurelian", "iriel"] },
  "recuperado-a-mulher-que-colecionava-despedidas": { genres: ["diário", "memória"], collection: D, themes: ["morte e luto", "memória e esquecimento"], characters: ["vespera", "a-irma"] },
  "recuperado-uma-questao-de-etiqueta": { genres: ["diário", "crônica"], collection: D, themes: ["a casa"], characters: ["vespera", "azrakhel"] },
  "recuperado-a-segunda-vida-do-sapato-vermelho": { genres: ["diário", "memória"], collection: D, themes: ["infância", "memória e esquecimento"], characters: ["vespera", "a-menina-do-sapato-vermelho"] },
  "recuperado-carta-ao-homem-que-nao-me-amou": { genres: ["carta", "confissão"], collection: D, themes: ["amor", "morte e luto"], characters: ["vespera"] },
  "recuperado-o-espelho-pediu-desculpas": { genres: ["diário", "diálogo"], collection: D, themes: ["memória e esquecimento", "promessas", "disfarces e identidade"], characters: ["vespera", "o-reflexo"] },
  "recuperado-a-escolha-de-contar-minha-historia": { genres: ["diário", "confissão"], collection: D, themes: ["disfarces e identidade"], characters: ["vespera", "o-irmao"] },
  "recuperado-uma-casa-e-um-lar": { genres: ["fragmento"], collection: F, themes: ["a casa"], characters: ["vespera"] },
  "recuperado-sobre-a-beleza-e-o-porao": { genres: ["fragmento"], collection: F, themes: ["a casa"], characters: ["vespera"] },
  "recuperado-uma-xicara-de-cha": { genres: ["fragmento", "carta"], collection: F, themes: ["a casa"], characters: ["vespera"] },
  "recuperado-o-tapete-e-a-avo-de-azrakhel": { genres: ["fragmento", "carta"], collection: F, themes: ["a casa", "amor"], characters: ["vespera", "azrakhel"] },
  "recuperado-helena-e-o-marido-mortal": { genres: ["memória", "confissão"], collection: M, themes: ["amor", "disfarces e identidade", "morte e luto"], characters: ["vespera"] },
  "recuperado-a-taberna-infernal": { genres: ["memória", "crônica"], collection: M, themes: ["disfarces e identidade"], characters: ["vespera"] },
  "recuperado-dos-inconvenientes-de-possuir-uma-cauda": { genres: ["memória", "conto"], collection: M, themes: ["disfarces e identidade", "amor"], characters: ["vespera"] },
  "aldeia-o-vestido-vermelho-e-as-penas-do-bispo": { genres: ["conto", "memória"], collection: M, themes: ["fé", "justiça", "amizade"], characters: ["vespera", "padre-tomas", "dona-beatriz"] },
  "recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu-v2": { genres: ["narrativa mitológica", "memória"], collection: "Dos arquivos pessoais de Vespera", themes: ["memória e esquecimento", "justiça"], characters: ["vespera", "aurelian", "neria", "iriel"] },
  "aldeia-o-arcanjo-que-chegou-tarde-para-um-milagre-v1": { genres: ["conto", "memória"], collection: M, themes: ["amor", "fé", "amizade"], characters: ["vespera", "ithariel", "padre-tomas", "dona-beatriz", "mateus"] },
  "ithariel-a-primeira-vez-que-me-chamou-de-insuportavel-v1": { genres: ["memória", "conto"], collection: M, themes: ["amor"], characters: ["vespera", "ithariel"] },
};
