// Concept catalogue → Zotero import and filing, batch c (built by Claude, 4 Nov 2026):
// sources for the new entries "Cold chain", "Traceability" and "Post-harvest handling and storage".
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged):
//   1. Creates two sub-folders inside "Supply chain technologies › 1. Preservation - cooling, storage & packaging":
//      "Cold chain" and "Post-harvest handling and storage"; traceability items go into the existing
//      "Supply chain technologies › 3. Traceability, information & digital platforms".
//   2. Imports 13 DOIs checked on Crossref (5 cold chain, 4 traceability, 4 post-harvest; two are candidates not yet cited) and files
//      the existing items each page uses into the same folder.
//   3. Tries Find Available PDF for every touched item without one; erases non-PDF downloads.
//   4. Ends with a summary and a check that no touched item is outside a folder.
//   Every item touched gets the tag below.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-11-04c";
const DELAY_MS = 1500;

const FOLDERS = [
  { id: "CC", name: "Cold chain", parent: "W76MN948", page: "Cold chain",
    dois: [
      { doi: "10.1111/1541-4337.13014", note: "Chen et al. 2022, sustainable food cold chain logistics" },
      { doi: "10.1088/1748-9326/ad4c7b", note: "Friedman-Heiman & Miller 2024, refrigeration, food loss and GHG" },
      { doi: "10.1021/acs.est.8b05322", note: "Heard & Miller 2018, GHG from cold chain introduction" },
      { doi: "10.1201/9781003056607-7", note: "Peters & Sayin 2021, sustainable cold chain development" },
      { doi: "10.1016/j.ehb.2020.100930", note: "Heard et al. 2020, refrigerator ownership and diets in Viet Nam (candidate)" },
    ], manual: [],
    items: ["QF6NGNJE", "NTHUVBWI", "UDH4TCCL", "S6FHMCMY", "523LFBF7", "GYF2CSBV", "GRYYL6YX", "2U6KBGB7", "NLJ9HQTQ"] },
  { id: "TC", name: "3. Traceability, information & digital platforms", parent: "KBYQVNGB", page: "Traceability",
    dois: [
      { doi: "10.1002/agr.20020", note: "Hobbs 2004, information asymmetry and traceability" },
      { doi: "10.1016/j.foodcont.2013.11.007", note: "Aung & Chang 2014, traceability: safety and quality" },
      { doi: "10.1016/j.foodcont.2013.02.004", note: "Bosona & Gebresenbet 2013, traceability and logistics" },
      { doi: "10.1016/j.tifs.2012.10.003", note: "Olsen & Borit 2013, How to define traceability (candidate)" },
    ], manual: [],
    items: ["FRHZQ99M", "JKU7S2MU", "T3M2NHFB", "QAL8HBU8", "3ZE6AWCS", "7HIIKTEY", "S6YR4X7W", "EBXUQZ57", "KJHPIQR4", "9IZDDX4L", "D78C4CAY", "DYMN7BNF"] },
  { id: "PH", name: "Post-harvest handling and storage", parent: "W76MN948", page: "Post-harvest handling and storage",
    dois: [
      { doi: "10.1017/s0021859610000936", note: "Hodges et al. 2011, postharvest losses and waste" },
      { doi: "10.1016/j.worlddev.2014.08.002", note: "Affognon et al. 2015, PHL meta-analysis SSA" },
      { doi: "10.1038/s41893-020-00622-1", note: "Stathers et al. 2020, scoping review of PHL interventions" },
      { doi: "10.1016/j.jspr.2025.102727", note: "Stathers et al. 2025, scoping review update 2024" },
    ], manual: [],
    items: ["4AKJEGWT", "LBHIQRKG", "L62X4M9A", "47V9ITZ9", "4S3I5GXH", "IGUVCWPL", "62N7NGCK", "LQWTUACW", "T482HAKE", "MITHVH33", "XZCBNXXY"] },
];

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-import] " + s); };

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
async function attachFromURL(item, url) {
  try {
    const att = await Zotero.Attachments.importFromURL({ libraryID: lib, url, parentItemID: item.id, contentType: "application/pdf" });
    if (att && att.attachmentContentType === "application/pdf") return true;
    if (att) await att.eraseTx();
  } catch (e) { say(`  Could not fetch PDF from ${url}: ${e}`); }
  return false;
}
const made = {};
async function getFolder(f) {
  if (f.key) return Zotero.Collections.getByLibraryAndKey(lib, f.key);
  const parent = f.parentId ? made[f.parentId] : Zotero.Collections.getByLibraryAndKey(lib, f.parent);
  if (!parent && f.parentId && DRY_RUN) { say(`WOULD CREATE folder "${f.name}" inside "${f.parentId}"`); return null; }
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
async function findByTitle(title) {
  const s = new Zotero.Search(); s.libraryID = lib;
  s.addCondition("title", "is", title);
  const ids = await s.search();
  return Zotero.Items.get(ids).filter(i => !i.deleted && i.isTopLevelItem());
}
async function fileIt(item, col) {
  let changed = false;
  if (!item.inCollection(col.id)) { item.addToCollection(col.id); changed = true; }
  if (!item.hasTag(TAG)) { item.addTag(TAG); changed = true; }
  if (changed) await item.saveTx();
  return changed;
}

const touched = new Map();
let nImp = 0, nSkip = 0, nFail = 0, nFiled = 0, nPDF = 0, nBad = 0, nManual = 0;

for (const f of FOLDERS) {
  const col = await getFolder(f);
  made[f.id] = col;
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
  for (const m of f.manual) {
    const have = await findByTitle(m.fields.title);
    if (have.length) {
      nSkip++;
      if (DRY_RUN || !col) { say(`  ALREADY IN LIBRARY: ${m.note} (would file it)`); continue; }
      if (await fileIt(have[0], col)) nFiled++;
      touched.set(have[0].key, have[0]); say(`  Already in library, filed: ${m.note}`); continue;
    }
    if (DRY_RUN || !col) { say(`  WOULD ADD BY HAND: ${m.note}`); continue; }
    try {
      const it = new Zotero.Item(m.itemType);
      it.libraryID = lib;
      for (const [k, v] of Object.entries(m.fields)) it.setField(k, v);
      it.setCreators(m.creators);
      it.addToCollection(col.id);
      it.addTag(TAG);
      await it.saveTx();
      touched.set(it.key, it); nManual++; say(`  Added by hand: ${m.note}`);
      if (m.pdf && await attachFromURL(it, m.pdf)) { nPDF++; say(`  PDF attached: ${m.note}`); }
    } catch (e) { nFail++; say(`  FAILED to add ${m.note}: ${e}`); }
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
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Imported ${nImp}, added by hand ${nManual}, already in library ${nSkip}, failed ${nFail}, newly filed ${nFiled}, missing/skipped keys ${nBad}, PDFs added ${nPDF}.`);
say(noFolder.length ? `NOT IN ANY FOLDER: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF (${noPDF.length}): ` + noPDF.map(i => `${i.key} "${i.getField("title").slice(0, 50)}"`).join("; "));
return log.join("\n");
