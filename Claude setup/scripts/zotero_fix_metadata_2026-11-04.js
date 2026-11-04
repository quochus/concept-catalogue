// Concept catalogue → Zotero metadata fixes (built by Claude, 4 Nov 2026)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (changes only the fields listed below, on 21 items found by key; nothing is deleted, moved or merged):
//   1. Sentence-case titles for ALL-CAPS or Title Case titles of items cited in the catalogue pages
//      (Technology readiness, Supply chain technologies, Cold chain, Traceability, Post-harvest handling and storage).
//   2. Author fixes: Rusli et al. 2023 (given names), Duong et al. 2023 (Vietnamese family and given names were swapped),
//      Ho et al. 2022 (first author stored as one field), Weinberger et al. 2008 ("Ii" → "Genova II"),
//      Acedo Jr. et al. 2012 (the four authors were listed four times; duplicates removed, editors kept).
//   3. Reardon et al.: year 2017 → 2019, volume 83, pages 285–288 (checked on Crossref).
//   Safety: each fix first checks that the item's current title starts with the expected text; if not, it skips the
//   item and reports it. Every changed item gets the tag below, so the batch can be reviewed in one click.
//   Not done here (do by hand): merge the duplicate Heard et al. 2020 items (keys D5IELYEQ and 3SJ9FPVW).

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-fix 2026-11-04";

const FIXES = [
  { key: "J7UCU72S", expect: "TECHNOLOGY READINESS INDEX OF PADDY",
    title: "Technology readiness index of paddy farmers in MADA, KADA, and IADA BLS, Malaysia",
    creators: [["Rusli", "Nor Masitoh"], ["Samah", "Rozana"], ["Kamaruddin", "Roslina"]] },
  { key: "PTZ4PRZ9", expect: "BUILDING THE ASSESSMENT SCALE",
    title: "Building the assessment scale on stakeholders’ readiness level to apply blockchain technology to the agricultural supply chain",
    creators: [["Duong", "Dac Quang Hao"], ["Nguyen", "Thi Minh Hoa"], ["Hoang", "La Phuong Hien"]] },
  { key: "L62X4M9A", expect: "Postharvest research, education and extension",
    title: "Postharvest research, education and extension: AVRDC – The World Vegetable Center's experience",
    dedupeCreators: true },
  { key: "7R3BGLGF", expect: "Links among innovation, food system transformation",
    fields: { date: "2019", volume: "83", pages: "285-288" } },
  { key: "QF6NGNJE", expect: "Cold chain and food loss in the Vietnamese food chain",
    replaceFirstCreator: ["Ho", "Thi Thu Hoa"] },
  { key: "4AKJEGWT", expect: "Quantifying postharvest loss in vegetables",
    replaceCreatorByLast: { from: "Ii", to: ["Genova II", "Christian"] }, fields: { pages: "288-297" } },
  { key: "D78C4CAY", expect: "Mapping Supply Chain Actors",
    title: "Mapping supply chain actors’ readiness on new technology in fresh fruit and vegetable traceability system" },
  { key: "7HIIKTEY", expect: "The Role of Blockchain Technology",
    title: "The role of blockchain technology in promoting traceability systems in agri-food production and supply chains" },
  { key: "I2RI5MRP", expect: "Towards Sustainable Digital Agriculture",
    title: "Towards sustainable digital agriculture for smallholder farmers: A systematic literature review" },
  { key: "S6FHMCMY", expect: "Ambient Parameter Monitoring",
    title: "Ambient parameter monitoring in fresh fruit and vegetable supply chains using Internet of Things-enabled sensor and communication technology" },
  { key: "I3N78HST", expect: "Development Challenges of Fruit-Harvesting",
    title: "Development challenges of fruit-harvesting robotic arms: A critical review" },
  { key: "6FFT7N8F", expect: "The Impact of Agricultural E-Commerce",
    title: "The impact of agricultural e-commerce on smallholder incomes and supply chains: Evidence from Garut, West Jawa" },
  { key: "ZHRPY76E", expect: "The Influence of E-Commerce Platforms",
    title: "The influence of e-commerce platforms on sustainable agriculture practices among smallholder farmers in sub-Saharan Africa" },
  { key: "JKU7S2MU", expect: "Explaining Consumers",
    title: "Explaining consumers’ intention for traceable pork regarding animal disease: The role of food safety concern, risk perception, trust, and habit" },
  { key: "GRYYL6YX", expect: "Management of Postharvest Losses",
    title: "Management of postharvest losses and wastages in the Indian tomato supply chain—A temperature-controlled storage perspective" },
  { key: "LPP4X7QB", expect: "Technology Readiness Index (Tri)",
    title: "Technology Readiness Index (TRI): A multiple-item scale to measure readiness to embrace new technologies" },
  { key: "VIJTK6GU", expect: "An Updated and Streamlined",
    title: "An updated and streamlined Technology Readiness Index: TRI 2.0" },
  { key: "HEMW9DDJ", expect: "Can technology readiness predict",
    title: "Can technology readiness predict farmers’ adoption intention of the e-AgriFinance app?" },
  { key: "ZNBQDSQ8", expect: "From NASA to EU",
    title: "From NASA to EU: The evolution of the TRL scale in public sector innovation" },
  { key: "WEX9KAIM", expect: "Technology Readiness Assessment Guide",
    title: "Technology readiness assessment guide: Best practices for evaluating the readiness of technology for use in acquisition programs and projects" },
  { key: "X7YSVP4S", expect: "Mitigate+: Food Loss and Waste",
    title: "Mitigate+: Food loss and waste country profile Vietnam" },
];

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-fix] " + s); };
let nDone = 0, nSkip = 0;

for (const f of FIXES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, f.key);
  if (!item || !item.isTopLevelItem()) { say(`SKIPPED ${f.key}: not found or not a top-level item`); nSkip++; continue; }
  const oldTitle = item.getField("title") || "";
  if (!oldTitle.startsWith(f.expect)) { say(`SKIPPED ${f.key}: title has changed ("${oldTitle.slice(0, 60)}")`); nSkip++; continue; }
  const changes = [];
  if (f.title && f.title !== oldTitle) { changes.push(`title → "${f.title}"`); if (!DRY_RUN) item.setField("title", f.title); }
  if (f.fields) for (const [k, v] of Object.entries(f.fields)) {
    if (item.getField(k) !== v) { changes.push(`${k}: "${item.getField(k)}" → "${v}"`); if (!DRY_RUN) item.setField(k, v); }
  }
  let cr = item.getCreators();
  if (f.creators) {
    const authors = cr.filter(c => Zotero.CreatorTypes.getName(c.creatorTypeID) === "author");
    const others = cr.filter(c => Zotero.CreatorTypes.getName(c.creatorTypeID) !== "author");
    if (authors.length === f.creators.length) {
      const newAuthors = f.creators.map(([last, first], i) => ({ lastName: last, firstName: first, fieldMode: 0, creatorTypeID: authors[i].creatorTypeID }));
      changes.push(`authors → ${f.creators.map(a => a.join(", ")).join("; ")}`);
      cr = newAuthors.concat(others);
    } else say(`  ${f.key}: author count differs (${authors.length}), authors left unchanged`);
  }
  if (f.dedupeCreators) {
    const seen = new Set(); const kept = [];
    for (const c of cr) {
      const id = `${c.lastName}|${c.firstName}|${c.creatorTypeID}`;
      if (!seen.has(id)) { seen.add(id); kept.push(c); }
    }
    if (kept.length !== cr.length) { changes.push(`creators ${cr.length} → ${kept.length} (duplicates removed)`); cr = kept; }
  }
  if (f.replaceFirstCreator && cr.length) {
    const [last, first] = f.replaceFirstCreator;
    changes.push(`first author "${cr[0].lastName}${cr[0].firstName ? ", " + cr[0].firstName : ""}" → "${last}, ${first}"`);
    cr[0] = { lastName: last, firstName: first, fieldMode: 0, creatorTypeID: cr[0].creatorTypeID };
  }
  if (f.replaceCreatorByLast) {
    const i = cr.findIndex(c => c.lastName === f.replaceCreatorByLast.from);
    if (i >= 0) {
      const [last, first] = f.replaceCreatorByLast.to;
      changes.push(`author "${cr[i].lastName}, ${cr[i].firstName}" → "${last}, ${first}"`);
      cr[i] = { lastName: last, firstName: first, fieldMode: 0, creatorTypeID: cr[i].creatorTypeID };
    }
  }
  if (f.creators || f.dedupeCreators || f.replaceFirstCreator || f.replaceCreatorByLast) { if (!DRY_RUN) item.setCreators(cr); }
  if (!changes.length) { say(`No change needed: ${f.key}`); continue; }
  if (!DRY_RUN) { item.addTag(TAG); await item.saveTx(); }
  nDone++;
  say(`${DRY_RUN ? "WOULD FIX" : "Fixed"} ${f.key}: ${changes.join(" | ")}`);
}
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Fixed ${nDone} items, skipped ${nSkip}. Remember to merge the duplicate Heard et al. 2020 items (D5IELYEQ, 3SJ9FPVW) by hand.`);
return log.join("\n");
