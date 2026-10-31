// Concept catalogue → Zotero filing (built by Claude, 31 Oct 2026, batch c: "Food system interventions" and "Institutional changes")
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: items are ADDED to the two folders and stay in every folder they are in now;
// nothing is moved, deleted or merged):
//   1. "Food system interventions" (3.2 Transitions & transformation): files 60 items already in your library
//      (reviews and evidence maps of food system, value chain, food environment and nutrition-sensitive interventions;
//      frameworks for designing them; and evaluations, incl. Viet Nam and Mekong cases), and imports 1 new DOI:
//      Hawkes et al. (2015), Smart food policies for obesity prevention (Lancet).
//   2. "Institutional changes" (3.1 › Institutions): files 60 items already in your library (theories and
//      mechanisms of institutional change, institutional work and entrepreneurship, institutional change in
//      transitions and agri-food, and Viet Nam cases), and imports 3 new DOIs: Hall & Taylor (1996),
//      Battilana, Leca & Boxenbaum (2009), and Streeck & Thelen (2005, Beyond continuity, book).
//      Where your library has two copies of a paper (the second copy sits in "Theories of institutional changes"),
//      the copy already in "Institutions" is used.
//   3. Tries Find Available PDF for every filed item without one; erases non-PDF downloads.
//   4. Ends with a summary listing items still without a PDF.
//   Every item touched gets the tag below, so the batch can be reviewed or undone in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-31c";
const DELAY_MS = 1500;

const FOLDERS = [
  { name: "Food system interventions", key: "SLBG2G7C", page: "Food system interventions",
    dois: [{ doi: "10.1016/S0140-6736(14)61745-1", note: "Hawkes et al. 2015, Smart food policies for obesity prevention" }],
    items: [
    "G5SVQFND", "XSMAQYFF", "TC53RTCS", "33SRV3IM", "76PXIPJI", "BZ87A2ZW", "NCS4JBUF", "3USM3IZ2", "KHXMKYM8", "WB3FHBJH",
    "CJVZ6GAG", "PIG5AHU8", "NQMFNYJ2", "CR6GVZSB", "SDSXRM2C", "6MCZVHLS", "9MRH7YX4", "F7VZMBVF", "U83BYLMY", "927LHRZM",
    "B3PZD2XZ", "K5IJ4KBF", "W54TMIK4", "537KZ7RA", "NP6TG8MS", "YL6K5U3K", "6B3PA2P2", "SVT7GEYJ", "R69EXS3P", "NRE9VU6H",
    "ECWRWVEI", "J62PPWRS", "WQ3VXVIP", "DZC4XZXW", "DX7BA6DW", "FSTIIJWX", "I28ZUBU4", "IJU82HV7", "6IRUMET5", "ZZBUDZKU",
    "D8MFBEET", "F8TF53PU", "UMF4XKQA", "JEARN8GM", "JFW2J2KJ", "6LMECPTD", "264SX699", "YW7Q8QJL", "NDBMI7IP", "IUCF96W2",
    "QZFTDDMC", "FJUGWI9P", "TV4MUFNH", "4LGE5HAK", "UATNWPTY", "98GVFLW8", "98P6MQ5W", "EVYLEX4B", "C9RC7FY6", "FU4X9FPD"] },
  { name: "Institutional changes", key: "SKDZAW3I", page: "Institutional changes",
    dois: [{ doi: "10.1111/j.1467-9248.1996.tb00343.x", note: "Hall & Taylor 1996, Political science and the three new institutionalisms" },
           { doi: "10.5465/19416520903053598", note: "Battilana, Leca & Boxenbaum 2009, How actors change institutions" },
           { doi: "10.1093/oso/9780199280452.001.0001", note: "Streeck & Thelen (eds) 2005, Beyond continuity (book)" }],
    items: [
    "B5LAHWLK", "VTYZQPLD", "77IBDRJS", "MBFJYKQA", "J3K5E8KJ", "LR48GM4W", "66RMQRRA", "C8A67V6V", "SWEKC5AC", "7AQQSG9M",
    "FTTJ2J44", "AALBG95Y", "P998HI9R", "D36L3LC2", "YPEFPPI7", "K4UV6FXL", "T49ZM7CK", "JVDAXYML", "M8VA4G4P", "9KLJL3KY",
    "6JGSTVXB", "3UAWGSKL", "8UASP4L7", "W73TBFPH", "RV3G288N", "52S2DDIT", "DZNC47M9", "Y87EX7UD", "CY83K3TP", "VF7XXPSN",
    "CHAKSULA", "FAGTI469", "2RQJ7W66", "75S7C72D", "NPB9F4WA", "4TZVBS65", "Z4A53SH7", "34777FQW", "CF4X2Q7W", "GQ6258P3",
    "RAYJ473H", "7UBKN4YS", "Q5UMTGNI", "RDCXLBC5", "GAGG8QSA", "IP47A3H2", "INZEI9F7", "8GHKZ8T4", "X6CKHDTZ", "T8SGIVAB",
    "6DZ2NXE7", "WQEQRGWL", "IT6MMJG5", "4LW863T3", "HGLR54ZX", "R36XCTV7", "ZQX26MPP", "QKPAYIUU", "PJQSBEQX", "IB49XQKX"] },
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
