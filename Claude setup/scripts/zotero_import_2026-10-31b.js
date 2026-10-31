// Concept catalogue → Zotero import (built by Claude, 31 Oct 2026, batch b: wider search for A01, G02, G03)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
//   It works whether or not you have already run zotero_file_2026-10-31.js (run that one too; order does not matter).
// What it does (additive only; it never moves, deletes or merges items):
//   1. Imports 3 new DOIs found in the wider search (Crossref-checked 31 Oct 2026), skipping any already in your library:
//        - Horton et al. (2024), UN Food Systems Summit discourse in Australia → Food systems transformation
//        - Jomo et al. (2026), gender equality and social inclusion in East African pathways → Food systems transformation
//        - 3ie (2021), evidence gap map of food systems interventions in LMICs → Food system viewpoints
//   2. Files 6 recent items already in your library into the page folders:
//        - Elsner et al. (2023), López-García et al. (2025), Trung et al. (2026) → Food system transition
//        - Candel et al. (2025), Walton et al. (2025), Dao & Nguyen (2022) → Food systems transformation
//   3. Tries open-access PDFs (Find Available PDF) for all of them; López-García, Walton and Trung have no PDF yet,
//      and I need the PDFs to quote them on the pages. Non-PDF downloads are erased.
//   4. Ends with a check that every touched item is in a folder, and a summary listing items still without a PDF.
//   Every item touched gets the tag below, so the batch can be reviewed or undone in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-31b";
const DELAY_MS = 1500;
const PARENT_32 = "VX47SECC";          // 3.2 Transitions & transformation

const FOLDERS = [
  { name: "Food system viewpoints", key: "MEYYEM7W", page: "Food system (A01)",
    dois: [{ doi: "10.23846/b/egm/202101", note: "3ie 2021, Food systems interventions EGM (LMICs)" }],
    items: [] },
  { name: "Food system transition", key: "YZPPFN2A", page: "Food system transitions (G02)",
    dois: [],
    items: ["929BV83I", "Y3AWUE6V", "NPB9F4WA"] },
  { name: "Food systems transformation", key: null, parent: PARENT_32, page: "Food systems transformation (G03)",
    dois: [{ doi: "10.1016/j.envsci.2023.103605", note: "Horton et al. 2024, Producing food utopia(s) at the UNFSS" },
           { doi: "10.3389/fsufs.2026.1816769", note: "Jomo et al. 2026, GESI in food systems transformation pathways" }],
    items: ["VNVIV38I", "5YRYQIPI", "PNGEFIPM"] },
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

async function findByDOI(doi) {
  const s = new Zotero.Search(); s.libraryID = lib;
  s.addCondition("DOI", "contains", doi);
  const ids = await s.search();
  return Zotero.Items.get(ids).filter(i => !i.deleted && i.isTopLevelItem() && (i.getField("DOI") || "").toLowerCase().trim() === doi.toLowerCase());
}
async function fileIt(item, col) {
  let changed = false;
  if (!item.inCollection(col.id)) { item.addToCollection(col.id); changed = true; }
  if (!item.hasTag(TAG)) { item.addTag(TAG); changed = true; }
  if (changed) await item.saveTx();
  return changed;
}

const touched = new Map();
let nImp = 0, nSkip = 0, nFail = 0, nFiled = 0, nPDF = 0, nBad = 0;

for (const f of FOLDERS) {
  const col = await getFolder(f);
  say(`\n${f.page} → "${f.name}"`);
  for (const d of f.dois) {
    const have = await findByDOI(d.doi);
    if (have.length) {
      nSkip++;
      if (DRY_RUN || !col) { say(`  ALREADY IN LIBRARY: ${d.note} (would file it)`); continue; }
      if (await fileIt(have[0], col)) nFiled++;
      touched.set(have[0].key, have[0]); say(`  Already in library, filed: ${d.note}`); continue;
    }
    if (DRY_RUN || !col) { say(`  WOULD IMPORT ${d.doi} (${d.note})`); continue; }
    try {
      const tr = new Zotero.Translate.Search();
      tr.setIdentifier({ DOI: d.doi });
      const translators = await tr.getTranslators();
      if (!translators.length) throw new Error("no translator");
      tr.setTranslator(translators);
      const items = await tr.translate({ libraryID: lib, collections: [col.id], saveAttachments: true });
      for (const it of items) { it.addTag(TAG); await it.saveTx(); touched.set(it.key, it); }
      nImp++; say(`  Imported: ${d.note}`);
    } catch (e) { nFail++; say(`  FAILED ${d.doi} (${d.note}): ${e}`); }
    await Zotero.Promise.delay(DELAY_MS);
  }
  for (const key of f.items) {
    const item = Zotero.Items.getByLibraryAndKey(lib, key);
    if (!item) { say(`  MISSING item key ${key}`); nBad++; continue; }
    if (!item.isTopLevelItem()) { say(`  SKIPPED ${key}: not a top-level item`); nBad++; continue; }
    if (DRY_RUN || !col) { say(`  WOULD FILE ${key} "${item.getField("title").slice(0, 70)}"`); continue; }
    if (await fileIt(item, col)) nFiled++;
    touched.set(key, item);
  }
}

if (!DRY_RUN) {
  for (const item of touched.values()) {
    if (hasPDF(item)) continue;
    if (await tryPDF(item)) { nPDF++; say(`PDF added: ${item.getField("title").slice(0, 70)}`); }
  }
}

const all = [...touched.values()];
const noFolder = all.filter(i => !i.getCollections().length);
const noPDF = all.filter(i => !hasPDF(i));
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, newly filed ${nFiled}, missing/skipped keys ${nBad}, PDFs added ${nPDF}.`);
say(noFolder.length ? `NOT IN ANY FOLDER: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF (${noPDF.length}): ` + noPDF.map(i => `${i.key} "${i.getField("title").slice(0, 50)}"`).join("; "));
return log.join("\n");
