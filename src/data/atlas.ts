/**
 * Atlas do Impossível — cartografia ficcional.
 * Lugares: apenas os nomeados nos manuscritos. As POSIÇÕES no mapa são
 * ilustrativas (os textos não dão geografia). Conexões marcadas como
 * "inferida" não são canônicas. Estrutura pronta para o editor (Etapa 3).
 */

export type Status = "confirmado" | "provisório";
export type Kind =
  | "plano" | "casa" | "salão" | "jardim" | "palácio" | "biblioteca" | "tribunal"
  | "mar" | "corte" | "taberna" | "aldeia" | "cidade" | "lago" | "estação" | "igreja"
  | "torre" | "ponte" | "estrela" | "quarto" | "portal";

export type Place = {
  id: string;
  name: string;
  kind: Kind;
  x: number; // 0–1000
  y: number; // 0–700
  status: Status;
  description: string;
  history?: string[];
  characters?: string[];
  works?: string[];
  secrets?: string[];
  map?: string; // id do mapa de detalhe
};
export type Link = { from: string; to: string; kind: "caminho" | "portal"; status: "confirmada" | "inferida"; label?: string };
export type AtlasMap = { id: string; title: string; subtitle: string; terrain: "cosmos" | "entre" | "celeste" | "infernal" | "mortal" | "aldeia" | "casa" | "vazio"; places: Place[]; links: Link[] };

export const ROOT_MAP = "cosmologia";

export const MAPS: Record<string, AtlasMap> = {
  cosmologia: {
    id: "cosmologia",
    title: "A Cosmologia do Impossível",
    subtitle: "Os planos por onde Vespera atravessa",
    terrain: "cosmos",
    places: [
      { id: "entre", name: "O Entre", kind: "plano", x: 500, y: 350, status: "confirmado", map: "entre",
        description: "Domínio que não pertence à jurisdição celestial. É ali que Vespera mora — e de onde lhe vem o título de senhora do Entre.",
        history: ["Por estar fora da lei do Céu, Vespera pôde testemunhar o Pacto das Portas sem se submeter a ele."],
        characters: ["vespera"], works: ["recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu-v2", "azrakhel-o-demonio-que-veio-me-matar-v1"] },
      { id: "firmamentos", name: "Os Firmamentos", kind: "plano", x: 500, y: 110, status: "confirmado", map: "firmamentos",
        description: "As grandes regiões celestiais, cada uma com territórios, habitantes e atribuições próprios. Pelo menos sete, numeradas.",
        characters: ["ithariel", "aurelian", "neria", "iriel"], works: ["recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu-v2", "ithariel-a-primeira-vez-que-me-chamou-de-insuportavel-v1"] },
      { id: "infernos", name: "Os Domínios Infernais", kind: "plano", x: 500, y: 600, status: "confirmado", map: "infernos",
        description: "Cortes, palácios e tabernas de demônios — onde se negocia enxofre e se contam guerras antigas com metade das mentiras.",
        characters: ["azrakhel", "malpherion"], works: ["recuperado-a-taberna-infernal", "recuperado-dos-inconvenientes-de-possuir-uma-cauda"] },
      { id: "mortais", name: "O Mundo dos Mortais", kind: "plano", x: 170, y: 360, status: "confirmado", map: "mortais",
        description: "Aldeias, portos e cidades que já não constam dos mapas. Aqui Vespera se chama Helena, ou Augusto, e aprende o preço do pão.",
        characters: ["padre-tomas", "dona-beatriz", "mateus", "eithne", "dona-ines"] },
      { id: "vazio", name: "Onde os relógios se recusam a funcionar", kind: "estrela", x: 830, y: 330, status: "provisório",
        description: "O lugar de onde Vespera escreve sobre a morte silenciosa de uma estrela. Os textos não dizem em que plano fica.",
        works: ["2026-10-14-0317"], secrets: ["Posição e plano desconhecidos — espaço provisório para futura edição."] },
    ],
    links: [
      { from: "firmamentos", to: "entre", kind: "portal", status: "inferida", label: "O último portão do Céu" },
      { from: "infernos", to: "entre", kind: "portal", status: "inferida", label: "Por onde Azrakhel chegou" },
      { from: "mortais", to: "entre", kind: "caminho", status: "inferida" },
    ],
  },

  entre: {
    id: "entre", title: "O Entre", subtitle: "Domínio de Vespera", terrain: "entre",
    places: [
      { id: "casa", name: "A Casa de Vespera", kind: "casa", x: 470, y: 330, status: "confirmado", map: "casa",
        description: "Também chamada Casa do Impossível. Uma casa onde todas as portas permanecem abertas e nenhuma lembrança aceita partir.",
        works: ["recuperado-uma-casa-e-um-lar", "recuperado-uma-xicara-de-cha", "recuperado-a-escolha-de-contar-minha-historia", "2026-10-14-1906"],
        secrets: ["Há uma última porta que, se aberta, guarda algo que a própria Vespera não está preparada para reconhecer."] },
      { id: "jardim", name: "O jardim das coisas esquecidas", kind: "jardim", x: 720, y: 220, status: "confirmado",
        description: "Flores que jamais existiram, árvores alimentadas por promessas não cumpridas e ervas daninhas feitas dos nomes de filhos que nunca nasceram. Os mortos o chamam de paraíso.",
        history: ["Uma menina voou ali por uma tarde inteira; décadas depois voltou com a filha."],
        characters: ["a-menina-do-sapato-vermelho"], works: ["2026-10-14-1142", "recuperado-a-segunda-vida-do-sapato-vermelho"],
        secrets: ["Numa caixa de madeira, dois sapatos: um vermelho, outro bordado de estrelas."] },
      { id: "primeira-casa", name: "A primeira casa", kind: "casa", x: 250, y: 500, status: "provisório",
        description: "Portas de marfim, janelas de cristal, rosas para perfumar um cemitério. Os textos não dizem se fica no Entre.",
        works: ["recuperado-sobre-a-beleza-e-o-porao"], secrets: ["Ninguém perguntou o que havia no porão."] },
    ],
    links: [{ from: "casa", to: "jardim", kind: "caminho", status: "confirmada", label: "Ela caminha da casa ao jardim" }],
  },

  casa: {
    id: "casa", title: "A Casa de Vespera", subtitle: "Cômodos nomeados nos manuscritos", terrain: "casa",
    places: [
      { id: "salao", name: "Salão das Audiências", kind: "salão", x: 300, y: 300, status: "confirmado",
        description: "Dobradiças que sobreviveram à queda de sete impérios e um tapete persa mais antigo que certas linhagens infernais.",
        characters: ["azrakhel"], works: ["azrakhel-o-demonio-que-veio-me-matar-v1", "recuperado-uma-questao-de-etiqueta", "recuperado-o-tapete-e-a-avo-de-azrakhel"] },
      { id: "aposentos", name: "Meus aposentos", kind: "quarto", x: 650, y: 230, status: "confirmado",
        description: "Uma escrivaninha onde um sapato vermelho repousa entre um cálice de prata e a coroa de um deus esquecido.",
        characters: ["o-reflexo"], works: ["2026-10-14-2359", "2026-10-14-1906"] },
      { id: "corredor", name: "O espelho do corredor", kind: "portal", x: 520, y: 470, status: "confirmado",
        description: "Onde o reflexo a aguarda — e onde o vidro começou a rachar.", characters: ["o-reflexo", "eva"], works: ["azrakhel-o-demonio-que-veio-me-matar-v1"] },
      { id: "quarto-sem-janelas", name: "Quarto sem janelas", kind: "quarto", x: 800, y: 470, status: "confirmado",
        description: "Ali o espelho não refletia o quarto, mas outro: uma janela aberta, violetas, e uma fotografia de Vespera envelhecendo.",
        characters: ["o-reflexo"], works: ["recuperado-o-espelho-pediu-desculpas"], secrets: ["“Você prometeu voltar.”"] },
    ],
    links: [{ from: "salao", to: "corredor", kind: "caminho", status: "inferida" }],
  },

  firmamentos: {
    id: "firmamentos", title: "Os Firmamentos", subtitle: "Regiões celestiais", terrain: "celeste",
    places: [
      { id: "terceiro", name: "Terceiro Firmamento · Palácio das Setecentas Janelas", kind: "palácio", x: 300, y: 330, status: "confirmado",
        description: "Guarda das antigas passagens celestiais. Cada uma das setecentas janelas dá para um amanhecer diferente — uma delas, para o de um mundo que jamais nascerá.",
        history: ["Na renovação do Pacto das Portas, Vespera sentou-se na centésima cadeira e foi expulsa do Céu pela primeira vez."],
        characters: ["aurelian", "neria", "iriel"], works: ["recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu", "recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu-v2"],
        secrets: ["Nas atas, uma nota de Aurelian: a existência do acusado não está em discussão."] },
      { id: "setimo", name: "Sétimo Firmamento · Biblioteca", kind: "biblioteca", x: 700, y: 200, status: "confirmado",
        description: "Galerias sobre um mar de nuvens prateadas, livros em línguas ainda não inventadas e cartas de amor de deuses a criaturas que os detestavam.",
        characters: ["ithariel"], works: ["ithariel-a-primeira-vez-que-me-chamou-de-insuportavel-v1"] },
      { id: "jardins-manha", name: "Jardins da Primeira Manhã", kind: "jardim", x: 640, y: 470, status: "provisório",
        description: "De lá escaparam espíritos feitos de possibilidades abandonadas; ali crescem os grãos do pão servido no Céu. Firmamento não informado.",
        works: ["ithariel-a-primeira-vez-que-me-chamou-de-insuportavel-v1", "recuperado-sobre-a-primeira-vez-que-fui-expulsa-do-ceu-v2"] },
      { id: "mar-vidro", name: "Mar de Vidro Negro", kind: "mar", x: 860, y: 560, status: "provisório",
        description: "Uma varanda sobre ele, onde navios chegavam com coisas esquecidas. Ali Ithariel a beijou pela primeira vez — e ali ela perdeu um par de brincos.",
        characters: ["ithariel"], works: ["aldeia-o-arcanjo-que-chegou-tarde-para-um-milagre-v1"] },
      { id: "tribunal", name: "Tribunal das Vozes", kind: "tribunal", x: 160, y: 560, status: "provisório",
        description: "Onde Vespera passou onze dias defendendo uma pequena criatura infernal — e quem a acusara. Localização não informada.",
        characters: ["ithariel"], works: ["ithariel-a-primeira-vez-que-me-chamou-de-insuportavel-v1"] },
    ],
    links: [],
  },

  infernos: {
    id: "infernos", title: "Os Domínios Infernais", subtitle: "Cortes e tabernas", terrain: "infernal",
    places: [
      { id: "corte-cinzas", name: "Corte das Cinzas", kind: "corte", x: 320, y: 300, status: "confirmado",
        description: "Corte de um duque infernal que dizia descender das primeiras chamas — e cujo bisavô fora um espírito de lareira.",
        works: ["recuperado-dos-inconvenientes-de-possuir-uma-cauda"], secrets: ["“O que aconteceu depois pertence a outra história.”"] },
      { id: "taberna", name: "Uma taberna infernal", kind: "taberna", x: 680, y: 260, status: "confirmado",
        description: "Dezessete anos servindo vinho e ouvindo um velho demônio mentir sobre a primeira guerra celestial.",
        works: ["recuperado-a-taberna-infernal"] },
      { id: "palacio-azrakhel", name: "O palácio de Azrakhel", kind: "palácio", x: 520, y: 500, status: "provisório",
        description: "Um quarto que a família julga vazio. Quando o nome de Eva foi dito, uma porta que não existia havia trezentos anos apareceu no fim de um corredor.",
        characters: ["azrakhel", "eva"], works: ["azrakhel-o-demonio-que-veio-me-matar-v1"] },
    ],
    links: [],
  },

  mortais: {
    id: "mortais", title: "O Mundo dos Mortais", subtitle: "Lugares visitados", terrain: "mortal",
    places: [
      { id: "aldeia", name: "A aldeia de padre Tomás", kind: "aldeia", x: 420, y: 330, status: "confirmado", map: "aldeia",
        description: "Montanhas, um rio que sobe depressa, uma paróquia e uma viúva que desconfia de tudo. Vinte anos da vida de Helena.",
        characters: ["padre-tomas", "dona-beatriz", "mateus", "ithariel"], works: ["arquivo-o-demonio-errado-v2", "aldeia-o-vestido-vermelho-e-as-penas-do-bispo", "aldeia-o-arcanjo-que-chegou-tarde-para-um-milagre-v1"] },
      { id: "amendoeiras", name: "Rua das Amendoeiras", kind: "cidade", x: 720, y: 190, status: "confirmado",
        description: "Numa cidade que já não consta dos mapas: o leilão de um boticário e uma casa de janelas azuis.",
        characters: ["dona-ines"], works: ["2026-10-15-a-colher-que-me-venceu"] },
      { id: "sao-lazaro", name: "Estação de São Lázaro", kind: "estação", x: 780, y: 480, status: "confirmado",
        description: "Onde se registra a mulher que, por vinte e três anos, foi a quatrocentos e dezessete funerais de desconhecidos.",
        works: ["recuperado-a-mulher-que-colecionava-despedidas"] },
      { id: "porto", name: "Uma cidade portuária", kind: "cidade", x: 180, y: 540, status: "confirmado",
        description: "Helena vendia flores e foi casada trinta e dois anos com um homem que roncava como um animal moribundo.",
        works: ["recuperado-helena-e-o-marido-mortal"] },
      { id: "lago", name: "O lago de Eithne", kind: "lago", x: 200, y: 170, status: "confirmado",
        description: "Uma casa de pedra numa margem, a casa de uma família na outra. Cebolas que sobrevivem ao frio.",
        characters: ["eithne"], works: ["bestiario-eithne-v1"] },
    ],
    links: [],
  },

  aldeia: {
    id: "aldeia", title: "A aldeia de padre Tomás", subtitle: "Mapa de detalhe", terrain: "aldeia",
    places: [
      { id: "igreja", name: "A igreja da aldeia", kind: "igreja", x: 480, y: 280, status: "confirmado",
        description: "Onde um vestido vermelho e as penas bordadas de um bispo provocaram o silêncio que antecede a queda de um vaso caro.",
        characters: ["padre-tomas", "dona-beatriz"], works: ["aldeia-o-vestido-vermelho-e-as-penas-do-bispo", "arquivo-o-demonio-errado-v2"] },
      { id: "torre", name: "A torre do sino", kind: "torre", x: 560, y: 160, status: "confirmado",
        description: "Interditada desde que a escada cedeu. Um menino subiu mesmo assim.",
        characters: ["mateus"], works: ["aldeia-o-arcanjo-que-chegou-tarde-para-um-milagre-v1"] },
      { id: "beatriz", name: "Casa e galinheiro de dona Beatriz", kind: "casa", x: 300, y: 430, status: "confirmado",
        description: "Separada da paróquia por uma cerca que caiu mais de uma vez. Na enchente, abrigou vinte e três pessoas.",
        characters: ["dona-beatriz", "mateus", "ithariel"], works: ["arquivo-santa-paciencia-padre-tomas-v1", "aldeia-o-arcanjo-que-chegou-tarde-para-um-milagre-v1"] },
      { id: "ponte", name: "A ponte e o rio", kind: "ponte", x: 720, y: 500, status: "confirmado",
        description: "O rio subiu pelas montanhas e engoliu a passagem. Ithariel ajudou a trocar as tábuas.",
        works: ["aldeia-o-arcanjo-que-chegou-tarde-para-um-milagre-v1"] },
      { id: "padaria", name: "O quarto sobre a padaria", kind: "quarto", x: 200, y: 230, status: "confirmado",
        description: "Alugado por Helena ao chegar, junto com um vestido azul que a fazia parecer respeitável.",
        works: ["arquivo-o-demonio-errado-v2"] },
    ],
    links: [
      { from: "igreja", to: "torre", kind: "caminho", status: "confirmada" },
      { from: "igreja", to: "beatriz", kind: "caminho", status: "confirmada", label: "A cerca" },
      { from: "igreja", to: "ponte", kind: "caminho", status: "inferida" },
    ],
  },
};

export function findPlace(mapId: string, placeId: string) {
  return MAPS[mapId]?.places.find((p) => p.id === placeId);
}
