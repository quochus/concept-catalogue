// Concept catalogue → Zotero folder merge and sort (built by Claude, 31 Oct 2026, at Quoc's request)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
//   Tip: set DRY_RUN = true first if you want to read the list of moves before anything changes.
// What it does (Quoc asked for moves and a folder merge, so this script MOVES items between folders;
// it never deletes or merges items, and it deletes only two empty folders that Claude's earlier scripts created):
//   1. Merges the two "Food systems transformation" folders under 3.2 Transitions & transformation
//      (SQCILE5P, 22 items; 9NXAWMTH, 4 items; both made by Claude's scripts) into your
//      "Food system transformation" folder (GUUL2PUA, under Food system transition), placing each item
//      in the matching sub-folder (Concepts; Pathways; Politics; Country cases; Diet-led; Structural; Tracking).
//   2. Moves 43 transformation-focused papers out of the root of "Food system transition" into those sub-folders.
//      Papers about transitions (MLP, niches, regimes, agroecological and just transitions) stay where they are.
//      6 papers that are about both are kept in "Food system transition" AND added to a transformation sub-folder.
//   3. Moves all 23 items sitting loose in the "Food system transformation" root into its sub-folders.
//   4. Deletes the two duplicate "Food systems transformation" folders once they hold nothing that is not also
//      in the merged folder (items are never deleted with them).
//   5. Ends with a check that every touched item is still in at least one folder, and a summary.
//   Every item touched gets the tag below, so the batch can be reviewed in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-sort 2026-10-31";
const MERGED = "GUUL2PUA";             // Food system transformation (under Food system transition)
const DUPLICATES = ["SQCILE5P", "9NXAWMTH"];   // the two "Food systems transformation" folders to remove
const SUBS = {
  XZERTHZK: "Concepts, principles & visions", Z64T7854: "Pathways, levers & entry points",
  Z64HBJ9E: "Politics, power & governance of transformation", "24BHLGRX": "Country & regional cases",
  "88FI96AB": "Diet- & nutrition-led transformation", RHN77SJZ: "Structural, rural & market transformation",
  WZSHTYJ8: "Tracking, assessment & foresight",
};

// key = item; to = transformation sub-folder; from = folders to take it out of ([] = add only)
const MOVES = [
  { key: "E3T7CQIG", to: "XZERTHZK", from: ["YZPPFN2A", "GUUL2PUA"], note: "Caron 2018 four-part transformation" },
  { key: "SNKWWW3T", to: "XZERTHZK", from: ["YZPPFN2A"], note: "Importance of vision in FST" },
  { key: "DB5Q29AF", to: "XZERTHZK", from: ["YZPPFN2A"], note: "Juri 2024 (duplicate copy)" },
  { key: "MMIGC5K3", to: "XZERTHZK", from: ["YZPPFN2A"], note: "Food for transformation" },
  { key: "92WTVAUJ", to: "XZERTHZK", from: ["YZPPFN2A"], note: "Transforming Food Systems 2021" },
  { key: "HHTVZP7G", to: "XZERTHZK", from: ["YZPPFN2A"], note: "How to normatively transform food systems 2025" },
  { key: "SMP9KKP5", to: "XZERTHZK", from: ["YZPPFN2A"], note: "Food System Transformations: social movements 2020" },
  { key: "A3GBB5M6", to: "Z64HBJ9E", from: ["YZPPFN2A", "GUUL2PUA"], note: "Béné 2022 Great Food Transformation" },
  { key: "UQCLMQ6Y", to: "Z64HBJ9E", from: ["YZPPFN2A", "GUUL2PUA"], note: "Leeuwis 2021" },
  { key: "IAEMTLIR", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Béné & Abdulai 2024" },
  { key: "VRP5STXB", to: "Z64HBJ9E", from: ["YZPPFN2A", "GUUL2PUA"], note: "Pereira 2020" },
  { key: "VW3UW977", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Research agenda food systems governance and transformation" },
  { key: "QWAMLCQY", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Political economy of food systems reform 2017" },
  { key: "IGF5JP8Q", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Transformation in governance towards resilient food systems" },
  { key: "9E6K2MR4", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Transforming governance in telecoupled food systems" },
  { key: "XM669D6Y", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Food governance transformation 2014" },
  { key: "QGNQ59T2", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Whole-of-food system governance 2025" },
  { key: "AVPST2KH", to: "Z64HBJ9E", from: ["YZPPFN2A"], note: "Integrating food policies towards FST 2024" },
  { key: "ZQTSXUWP", to: "Z64T7854", from: ["YZPPFN2A", "GUUL2PUA"], note: "Klerkx & Begemann 2020" },
  { key: "DHSN6JXL", to: "Z64T7854", from: ["YZPPFN2A"], note: "Pathways of transformation in global food systems 2017" },
  { key: "GACE4JLQ", to: "Z64T7854", from: ["YZPPFN2A"], note: "Shared transformation pathways 2017" },
  { key: "TNF2KL8C", to: "Z64T7854", from: ["YZPPFN2A"], note: "Redirecting investment 2018" },
  { key: "NP6TG8MS", to: "Z64T7854", from: ["YZPPFN2A"], note: "The transformative value chain 2023" },
  { key: "NZT8RVUH", to: "Z64T7854", from: ["YZPPFN2A"], note: "Food systems innovation and the SDGs 2021" },
  { key: "5TYNUAYU", to: "88FI96AB", from: ["YZPPFN2A"], note: "Changing diets and transforming food systems" },
  { key: "L9QBBE6B", to: "88FI96AB", from: ["YZPPFN2A"], note: "Transforming food systems for healthy sustainable diets (academies)" },
  { key: "QDJDXWQR", to: "88FI96AB", from: ["YZPPFN2A"], note: "Transforming the food system to fight NCDs" },
  { key: "XKCY3H4D", to: "88FI96AB", from: ["YZPPFN2A"], note: "National food systems: inclusive transformation for healthier diets" },
  { key: "WNYTMQTA", to: "88FI96AB", from: ["YZPPFN2A"], note: "Food system innovations for healthier diets in LMICs" },
  { key: "V9SFYVXJ", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Food value chain transformations in developing countries" },
  { key: "VX6XEC4F", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Westernization of Asian diets and transformation of food systems" },
  { key: "L8YDZYPF", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Food consumption, urbanization and rural transformation" },
  { key: "F9VADKHF", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Rapid transformation of food systems in developing regions" },
  { key: "59RZH98W", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Rural transformation and cereal-based agri-food systems" },
  { key: "XYA6RTI8", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Agrarian transformative changes: a review" },
  { key: "UC8CD7UM", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Agri-food value chain revolutions in LMICs" },
  { key: "9UDHS8XG", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Transforming agribusiness: FinTech" },
  { key: "L2A9GD47", to: "RHN77SJZ", from: ["YZPPFN2A"], note: "Transforming developing country agriculture" },
  { key: "L85CQU95", to: "RHN77SJZ", from: ["YZPPFN2A", "GUUL2PUA"], note: "Vorley 2023 informality" },
  { key: "REHZI3BZ", to: "24BHLGRX", from: ["YZPPFN2A"], note: "Swedish initiatives challenging corporate food regime" },
  { key: "ABG7RXL9", to: "WZSHTYJ8", from: ["YZPPFN2A"], note: "Participatory foresight for food systems change" },
  { key: "R7ZWCUH6", to: "WZSHTYJ8", from: ["YZPPFN2A"], note: "Foresight learn from hindsight" },
  { key: "VVUHGYJ7", to: "WZSHTYJ8", from: ["YZPPFN2A", "GUUL2PUA"], note: "Economics of the FST 2024" },
  { key: "EKRMIXFJ", to: "XZERTHZK", from: [], note: "On food system transitions & transformations (both)" },
  { key: "AF9ZX7DB", to: "XZERTHZK", from: [], note: "From transition to domains of transformation (both)" },
  { key: "U2GAVQJ7", to: "Z64T7854", from: [], note: "Ingredients for food systems change (both)" },
  { key: "47GUCMXY", to: "RHN77SJZ", from: [], note: "Reardon 2015 hidden middle (both; cited on transitions page)" },
  { key: "2ZZ89CHP", to: "24BHLGRX", from: [], note: "VietGAP transforming traditional agri-food system (both)" },
  { key: "2JZX8U38", to: "WZSHTYJ8", from: [], note: "Accelerators and triggers for transformation (both)" },
  { key: "NKW6PWRH", to: "24BHLGRX", from: ["GUUL2PUA"], note: "Si & Scott 2019 China" },
  { key: "DIZF2Q3K", to: "88FI96AB", from: ["GUUL2PUA"], note: "Willett 2019 EAT-Lancet" },
  { key: "DLDWYKAD", to: "Z64T7854", from: ["GUUL2PUA"], note: "FAO 2018 20 actions" },
  { key: "2EHEB3UV", to: "RHN77SJZ", from: ["GUUL2PUA"], note: "Reardon & Berdegué 2008" },
  { key: "A9SCCSRP", to: "XZERTHZK", from: ["GUUL2PUA"], note: "Feola 2015" },
  { key: "QH3DU6GX", to: "Z64HBJ9E", from: ["GUUL2PUA"], note: "Pendergrast 2019" },
  { key: "8EDD2DFC", to: "Z64HBJ9E", from: ["GUUL2PUA"], note: "Patterson 2017" },
  { key: "9ZNCUAGH", to: "24BHLGRX", from: ["GUUL2PUA"], note: "Baldy & Kruse 2019" },
  { key: "GVW8U57V", to: "XZERTHZK", from: ["GUUL2PUA"], note: "von Braun 2021" },
  { key: "UV4VGYEQ", to: "XZERTHZK", from: ["GUUL2PUA"], note: "Webb 2020" },
  { key: "Z4V2WYPA", to: "88FI96AB", from: ["GUUL2PUA"], note: "Lee 2021" },
  { key: "AEY48W2P", to: "24BHLGRX", from: ["GUUL2PUA"], note: "IFPRI 2016" },
  { key: "JV6SPSG9", to: "Z64HBJ9E", from: ["GUUL2PUA"], note: "Vignola & Oosterveer 2025" },
  { key: "RMV246EC", to: "Z64HBJ9E", from: ["GUUL2PUA"], note: "Canfield 2021" },
  { key: "ESHT6RII", to: "24BHLGRX", from: ["GUUL2PUA"], note: "Jomo 2025" },
  { key: "7RLMJB3C", to: "WZSHTYJ8", from: ["GUUL2PUA"], note: "Fanzo 2021 monitoring" },
  { key: "PNGEFIPM", to: "24BHLGRX", from: [], note: "Dao & Nguyen 2022 Viet Nam" },
  { key: "5YRYQIPI", to: "Z64T7854", from: [], note: "Walton 2025 asset stranding" },
  { key: "ZESC7W84", to: "Z64HBJ9E", from: [], note: "Horton 2024 UNFSS Australia" },
  { key: "J9ZHV96Y", to: "24BHLGRX", from: [], note: "Jomo 2026 GESI" },
  { key: "T6EPB5AS", to: "88FI96AB", from: [], note: "Rockström 2025 EAT-Lancet" },
  { key: "DGPZV579", to: "XZERTHZK", from: [], note: "Juri 2024" },
  { key: "X5M9HDNC", to: "Z64T7854", from: [], note: "Candel 2025 (already filed there)" }
];

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-sort] " + s); };
const getCol = (k) => {
  const c = Zotero.Collections.getByLibraryAndKey(lib, k);
  if (!c) throw new Error(`Folder key ${k} not found: stop and tell Claude.`);
  return c;
};
const merged = getCol(MERGED);
for (const k of Object.keys(SUBS)) {
  const c = getCol(k);
  if (c.parentKey !== MERGED) throw new Error(`Folder ${k} is not inside "${merged.name}": stop and tell Claude.`);
}

const touched = new Map();
let nAdd = 0, nRemoved = 0, nBad = 0;

// 1–3. Moves
for (const m of MOVES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, m.key);
  if (!item) { say(`MISSING item ${m.key} (${m.note})`); nBad++; continue; }
  if (!item.isTopLevelItem()) { say(`SKIPPED ${m.key}: not a top-level item`); nBad++; continue; }
  const to = getCol(m.to);
  const fromCols = m.from.map(getCol).filter(c => item.inCollection(c.id));
  if (DRY_RUN) {
    say(`WOULD ${fromCols.length ? "MOVE" : "ADD"} ${m.note} → ${SUBS[m.to]}${fromCols.length ? " (out of " + fromCols.map(c => c.name).join(", ") + ")" : ""}`);
    continue;
  }
  if (!item.inCollection(to.id)) { item.addToCollection(to.id); nAdd++; }
  for (const c of fromCols) { item.removeFromCollection(c.id); nRemoved++; }
  if (!item.hasTag(TAG)) item.addTag(TAG);
  await item.saveTx();
  touched.set(m.key, item);
  say(`${fromCols.length ? "Moved" : "Added"}: ${m.note} → ${SUBS[m.to]}`);
}

// 4. Remove the duplicate folders, only if every item in them is now in the merged folder or one of its sub-folders
const mergedIds = new Set([merged.id, ...Object.keys(SUBS).map(k => getCol(k).id)]);
for (const k of DUPLICATES) {
  const c = Zotero.Collections.getByLibraryAndKey(lib, k);
  if (!c) { say(`Duplicate folder ${k} already gone`); continue; }
  const items = Zotero.Items.get(c.getChildItems(true)).filter(i => !i.deleted && i.isTopLevelItem());
  const orphans = items.filter(i => !i.getCollections().some(id => mergedIds.has(id)));
  if (orphans.length) { say(`KEPT folder "${c.name}" (${k}): ${orphans.length} item(s) not yet in the merged folder: ${orphans.map(i => i.key).join(", ")}`); continue; }
  if (c.hasChildCollections()) { say(`KEPT folder "${c.name}" (${k}): it has sub-folders`); continue; }
  if (DRY_RUN) { say(`WOULD DELETE empty duplicate folder "${c.name}" (${k}, ${items.length} items all kept in the merged folder)`); continue; }
  await c.eraseTx({ deleteItems: false });
  say(`Deleted duplicate folder "${c.name}" (${k}); its ${items.length} items stay in the merged folder`);
}

// 5. Check and summary
const noFolder = [...touched.values()].filter(i => !i.getCollections().length);
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Added to sub-folders ${nAdd}, removed from old folders ${nRemoved}, missing/skipped ${nBad}.`);
say(noFolder.length ? `NOT IN ANY FOLDER: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in at least one folder.");
return log.join("\n");
