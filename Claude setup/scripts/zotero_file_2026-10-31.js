// Concept catalogue → Zotero filing and fixes (built by Claude, 31 Oct 2026: A01 Food system, G02 Food system transitions, G03 Food systems transformation)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
//   Takes under a minute.
// What it does (additive only; it never moves, deletes or merges items):
//   1. Imports nothing new: every source the three pages cite is already in your library.
//   2. Files the cited items into folders, one per page:
//        - Food system (22 items) → 3. Food systems > 3.1 Concepts & frameworks > Food system viewpoints (existing folder)
//        - Food system transitions (24 items) → 3. Food systems > 3.2 Transitions & transformation > Food system transition (existing folder)
//        - Food systems transformation (25 items) → 3.2 Transitions & transformation > Food systems transformation (NEW sub-folder)
//      Items cited on two pages go into both folders (Zotero folders are like labels, so nothing is copied).
//   3. Tries Find Available PDF for any filed item without a PDF, and erases non-PDF downloads.
//   4. Fixes three records (only if the current value is the known wrong one; values checked on Crossref 31 Oct 2026):
//        - Wieczorek (2018): DOI 10.1016/j.enveci.2017.08.008 → 10.1016/j.envsci.2017.08.008; issue "December 2016" → cleared
//        - Willett et al. (2019, EAT–Lancet): journal "Lancet" → "The Lancet"; volume 6736 → 393; issue 18 → 10170; pages 3–49 → 447–492; date → 2019-02
//        - Béné & Abdulai (2024): adds journal "Frontiers in Sustainable Food Systems", volume 8, pages 1399024
//   5. Ends with a check that every touched item is in a folder, and a summary.
//   Every item touched gets the tag below, so the batch can be reviewed or undone in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-31";

const PARENT_32 = "VX47SECC";          // 3.2 Transitions & transformation (for the new sub-folder)
const FOLDERS = [
  { name: "Food system viewpoints", key: "MEYYEM7W", page: "Food system (A01)", items: [
    "XV2M4EJ7","D737RF6R","KRPQBDAL","53NY8YKX","TJYL2YIM","FB4JWGLQ","GVW8U57V","Q4ATQS63","632MCC4R","DPBWGPD7","95DN3QCE",
    "PCX2ER4H","CMEK3MPF","G7HGUWGS","9DNIJA95","9MGWBZI3","XLW5FTH4","QQHNYAKL","YTIF468T","28CDECSF","UQCLMQ6Y","CP6VXQWE"] },
  { name: "Food system transition", key: "YZPPFN2A", page: "Food system transitions (G02)", items: [
    "FMTC3CDH","MLR323P7","NZWE8J8G","EWZGF9K5","VA4G6UDJ","U3YJ6BYK","BFDCT8AZ","NYF9CIUV","95DN3QCE","47GUCMXY","L85CQU95",
    "VWXCEMZE","52XG4BRN","SDIBP76W","IEJE5P3V","MSY44YT7","CP7QASVY","U4HDCF5T","N84HB5SU","HFN97PEF","YTIF468T","3CRZS489","377HPUMY","4V9GPEMX"] },
  { name: "Food systems transformation", key: null, parent: PARENT_32, page: "Food systems transformation (G03)", items: [
    "A9SCCSRP","8EDD2DFC","2EHEB3UV","AEY48W2P","E3T7CQIG","DLDWYKAD","DGPZV579","GVW8U57V","RMV246EC","ZQTSXUWP","VRP5STXB",
    "VVUHGYJ7","ESHT6RII","L85CQU95","NKW6PWRH","9ZNCUAGH","Z4V2WYPA","QH3DU6GX","A3GBB5M6","8PF2P2PB","UQCLMQ6Y","T6EPB5AS","JV6SPSG9","UV4VGYEQ","DIZF2Q3K"] },
];

// Field fixes: applied only when the current value equals "from" (use "" for an empty field).
const FIXES = [
  { key: "NYF9CIUV", field: "DOI", from: "10.1016/j.enveci.2017.08.008", to: "10.1016/j.envsci.2017.08.008", note: "Wieczorek 2018 DOI" },
  { key: "NYF9CIUV", field: "issue", from: "December 2016", to: "", note: "Wieczorek 2018 issue" },
  { key: "DIZF2Q3K", field: "publicationTitle", from: "Lancet", to: "The Lancet", note: "Willett 2019 journal" },
  { key: "DIZF2Q3K", field: "volume", from: "6736", to: "393", note: "Willett 2019 volume" },
  { key: "DIZF2Q3K", field: "issue", from: "18", to: "10170", note: "Willett 2019 issue" },
  { key: "DIZF2Q3K", field: "pages", from: "3–49", to: "447–492", note: "Willett 2019 pages" },
  { key: "DIZF2Q3K", field: "date", from: "2019", to: "2019-02", note: "Willett 2019 date" },
  { key: "8PF2P2PB", field: "publicationTitle", from: "", to: "Frontiers in Sustainable Food Systems", note: "Béné & Abdulai 2024 journal" },
  { key: "8PF2P2PB", field: "volume", from: "", to: "8", note: "Béné & Abdulai 2024 volume" },
  { key: "8PF2P2PB", field: "pages", from: "", to: "1399024", note: "Béné & Abdulai 2024 article number" },
];

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-file] " + s); };

function hasPDF(item) {
  return item.getAttachments().map(id => Zotero.Items.get(id)).some(a => a && !a.deleted && a.attachmentContentType === "application/pdf");
}
async function tryPDF(item) {
  if (hasPDF(item)) return false;
  try {
    const att = await Zotero.Attachments.addAvailableFile(item);
    if (att && att.attachmentContentType === "application/pdf") return true;
    if (att) { await att.eraseTx(); say(`  Removed non-PDF download for "${item.getField("title").slice(0, 60)}"`); }
  } catch (e) { /* no PDF found */ }
  return false;
}
async function getFolder(f) {
  if (f.key) {
    const c = Zotero.Collections.getByLibraryAndKey(lib, f.key);
    if (!c) throw new Error(`Folder key ${f.key} (${f.name}) not found: stop and tell Claude.`);
    return c;
  }
  const parent = Zotero.Collections.getByLibraryAndKey(lib, f.parent);
  if (!parent) throw new Error(`Parent folder key ${f.parent} not found: stop and tell Claude.`);
  const existing = Zotero.Collections.getByParent(parent.id).find(c => c.name === f.name);
  if (existing) return existing;
  if (DRY_RUN) { say(`WOULD CREATE folder "${f.name}" under "${parent.name}"`); return null; }
  const c = new Zotero.Collection({ libraryID: lib, name: f.name, parentID: parent.id });
  await c.saveTx();
  say(`Created folder "${f.name}" under "${parent.name}"`);
  return c;
}

const touched = new Map();
let nFiled = 0, nAlready = 0, nPDF = 0, nFix = 0, nBad = 0;

// 2. Filing
for (const f of FOLDERS) {
  const col = await getFolder(f);
  say(`\n${f.page} → "${f.name}"`);
  for (const key of f.items) {
    const item = Zotero.Items.getByLibraryAndKey(lib, key);
    if (!item) { say(`  MISSING item key ${key}`); nBad++; continue; }
    if (!item.isTopLevelItem()) { say(`  SKIPPED ${key}: not a top-level item`); nBad++; continue; }
    const t = item.getField("title").slice(0, 70);
    if (DRY_RUN) { say(`  WOULD FILE ${key} "${t}"`); continue; }
    let changed = false;
    if (!item.inCollection(col.id)) { item.addToCollection(col.id); changed = true; nFiled++; } else nAlready++;
    if (!item.hasTag(TAG)) { item.addTag(TAG); changed = true; }
    if (changed) await item.saveTx();
    touched.set(key, item);
  }
}

// 3. PDFs
if (!DRY_RUN) {
  for (const item of touched.values()) {
    if (hasPDF(item)) continue;
    if (await tryPDF(item)) { nPDF++; say(`PDF added: ${item.getField("title").slice(0, 70)}`); }
  }
}

// 4. Fixes
for (const f of FIXES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, f.key);
  if (!item) { say(`MISSING fix key ${f.key}`); continue; }
  let cur = "";
  try { cur = item.getField(f.field) || ""; } catch (e) { say(`Fix skipped for ${f.note}: no field ${f.field}`); continue; }
  if (f.field === "date") cur = cur.slice(0, 4) === f.from && cur.length <= 4 ? f.from : cur;
  if (cur !== f.from) { say(`Fix skipped for ${f.note}: ${f.field} is now "${cur}"`); continue; }
  if (DRY_RUN) { say(`WOULD SET ${f.note}: ${f.field} → "${f.to}"`); continue; }
  item.setField(f.field, f.to);
  if (!item.hasTag(TAG)) item.addTag(TAG);
  await item.saveTx(); nFix++;
  touched.set(f.key, item);
  say(`Fixed ${f.note}: ${f.field} → "${f.to}"`);
}

// 5. Check and summary
const all = [...touched.values()];
const noFolder = all.filter(i => !i.getCollections().length);
const noPDF = all.filter(i => !hasPDF(i));
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Newly filed ${nFiled}, already in folder ${nAlready}, missing/skipped keys ${nBad}, PDFs added ${nPDF}, fixes ${nFix}.`);
say(noFolder.length ? `NOT IN ANY FOLDER: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF (${noPDF.length}): ` + noPDF.map(i => `${i.key} "${i.getField("title").slice(0, 50)}"`).join("; "));
return log.join("\n");
