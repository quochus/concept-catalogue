// Concept catalogue → Zotero import (built by Claude, 28 Oct 2026: J06 Food system resilience)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
//   Takes under a minute.
// What it does (additive only; it never moves, deletes or merges items):
//   1. Imports 2 DOIs (Zurek et al. 2022; Cabell & Oelofse 2012), skipping any already in your library,
//      into Main collection > 3. Food systems > 3.7 Food security, safety & resilience > Food system resilience.
//   2. Creates 1 hand-entered report (FAO 2021, The State of Food and Agriculture 2021) in the same folder.
//   3. Files the 23 existing items cited on the "Food system resilience" page into that folder too,
//      so the concept's papers sit together (items already there are left as they are, apart from the tag).
//   4. Tries open-access PDFs (direct links first, then Zotero's Find Available PDF) and erases any non-PDF download.
//   5. Fixes one wrong DOI: Walker et al. (2004) has the DOI of a physics paper; it is set to 10.5751/ES-00650-090205.
//   6. Ends with a check that every touched item is in a folder, and a summary.
//   Every item touched gets the tag below, so the batch can be reviewed or undone in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-28";
const FOLDER_KEY = "F322LI9L";         // 3. Food systems > 3.7 Food security, safety & resilience > Food system resilience
const DELAY_MS = 1500;

// DOIs and metadata checked on publisher or repository pages, 28 Oct 2026.
const DOIS = [
  { doi: "10.1146/annurev-environ-112320-050744", note: "Zurek et al. 2022, Food system resilience: concepts, issues, and challenges",
    pdf: [] },
  { doi: "10.5751/ES-04666-170118", note: "Cabell & Oelofse 2012, An indicator framework for assessing agroecosystem resilience",
    pdf: [] },
];

const MANUAL = [
  { type: "report", note: "FAO 2021 SOFA",
    fields: { title: "The State of Food and Agriculture 2021: Making agrifood systems more resilient to shocks and stresses",
              institution: "FAO", place: "Rome", date: "2021",
              url: "https://openknowledge.fao.org/handle/20.500.14283/cb4476en" },
    creators: [{ name: "FAO", creatorType: "author", fieldMode: 1 }],
    pdf: ["https://uncclearn.org/wp-content/uploads/library/cb4476en.pdf"] },
];

// Parent (top-level) keys of the items cited on the page.
const EXISTING = [
  "QJ36ZHMN", // Anderson et al. 2026
  "ZKV925CT", // Béné 2020
  "BLV498U6", // Béné et al. 2016
  "YH9ZSSDY", // Béné et al. 2023
  "BXM9LKU3", // Béné et al. 2012
  "LXU3KLB6", // Béné et al. 2026
  "5TTCL8N8", // Black et al. 2024
  "JUJ6BWIG", // Ericksen et al. 2010
  "EF4THLHJ", // Folke 2006
  "CN2ZDEXY", // HLPE 2025
  "DUM7DQFA", // Hoang 2018
  "T3Y2PBB2", // Holling 1973
  "68KXLJSL", // Keil et al. 2008
  "8KPCMIZY", // Meyer 2020
  "F54BF8MQ", // Moran et al. 2020
  "6KTLKIGF", // Paulus et al. 2025
  "AXMMMJA7", // Puma 2019
  "STICAMIL", // Rotz & Fraser 2018
  "52I9IPA9", // Schipanski et al. 2016
  "AVLLP9TX", // Tendall et al. 2015
  "FM8VCYA4", // Tran 2012
  "PWX8HRT6", // Walker et al. 2004
  "CTRP7I69", // Wood et al. 2023
];

const FIXES = [
  { key: "PWX8HRT6", field: "DOI", from: "10.1103/PhysRevLett.95.258101", to: "10.5751/ES-00650-090205", note: "Walker et al. 2004" },
];

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-import] " + s); };
const col = Zotero.Collections.getByLibraryAndKey(lib, FOLDER_KEY);
if (!col) throw new Error(`Folder key ${FOLDER_KEY} not found: stop and tell Claude.`);
say(`Target folder: "${col.name}"`);

async function findByDOI(doi) {
  const s = new Zotero.Search();
  s.libraryID = lib;
  s.addCondition("DOI", "contains", doi);
  const ids = await s.search();
  return Zotero.Items.get(ids).filter(i => !i.deleted && (i.getField("DOI") || "").toLowerCase().trim() === doi.toLowerCase());
}
async function fileItem(item) {
  let changed = false;
  if (!item.inCollection(col.id)) { item.addToCollection(col.id); changed = true; }
  if (TAG && !item.hasTag(TAG)) { item.addTag(TAG); changed = true; }
  if (changed) await item.saveTx();
  return changed;
}
function hasPDF(item) {
  return item.getAttachments().map(id => Zotero.Items.get(id)).some(a => a && !a.deleted && a.attachmentContentType === "application/pdf");
}
async function tryPDF(item, urls) {
  if (hasPDF(item)) return false;
  for (const url of urls || []) {
    try {
      const att = await Zotero.Attachments.importFromURL({ libraryID: lib, url, parentItemID: item.id, contentType: "application/pdf" });
      if (att && att.attachmentContentType === "application/pdf") return true;
      if (att) { await att.eraseTx(); say(`  Removed non-PDF download from ${url}`); }
    } catch (e) { say(`  PDF link failed (${url}): ${e}`); }
  }
  try {
    const att = await Zotero.Attachments.addAvailableFile(item);
    if (att && att.attachmentContentType === "application/pdf") return true;
    if (att) { await att.eraseTx(); say(`  Removed non-PDF download (Find Available PDF)`); }
  } catch (e) { /* no PDF found */ }
  return false;
}

const touched = [];
let nImp = 0, nSkip = 0, nFail = 0, nFiled = 0, nMan = 0, nPDF = 0, nFix = 0;

// 1. DOIs
for (const d of DOIS) {
  const have = await findByDOI(d.doi);
  if (have.length) {
    nSkip++;
    if (DRY_RUN) { say(`ALREADY IN LIBRARY ${d.doi} (${d.note}): would file it`); continue; }
    await fileItem(have[0]); touched.push([have[0], d.pdf]);
    say(`Already in library, filed: ${d.note}`);
    continue;
  }
  if (DRY_RUN) { say(`WOULD IMPORT ${d.doi} (${d.note})`); continue; }
  try {
    const tr = new Zotero.Translate.Search();
    tr.setIdentifier({ DOI: d.doi });
    const translators = await tr.getTranslators();
    if (!translators.length) throw new Error("no translator");
    tr.setTranslator(translators);
    const items = await tr.translate({ libraryID: lib, collections: [col.id], saveAttachments: true });
    for (const it of items) { if (TAG) { it.addTag(TAG); await it.saveTx(); } touched.push([it, d.pdf]); }
    nImp++;
    say(`Imported: ${d.note}`);
  } catch (e) { nFail++; say(`FAILED ${d.doi} (${d.note}): ${e}`); }
  await Zotero.Promise.delay(DELAY_MS);
}

// 2. Hand-entered items (skipped if an item with the same title exists)
for (const m of MANUAL) {
  const s = new Zotero.Search(); s.libraryID = lib;
  s.addCondition("title", "is", m.fields.title);
  const found = Zotero.Items.get(await s.search()).filter(i => !i.deleted && i.isTopLevelItem());
  if (found.length) {
    nSkip++;
    if (DRY_RUN) { say(`ALREADY IN LIBRARY: ${m.note}`); continue; }
    await fileItem(found[0]); touched.push([found[0], m.pdf]); say(`Already in library, filed: ${m.note}`); continue;
  }
  if (DRY_RUN) { say(`WOULD CREATE: ${m.note}`); continue; }
  const it = new Zotero.Item(m.type);
  it.libraryID = lib;
  for (const [f, v] of Object.entries(m.fields)) it.setField(f, v);
  it.setCreators(m.creators.map(c => ({ lastName: c.name, creatorType: c.creatorType, fieldMode: c.fieldMode })));
  it.addToCollection(col.id);
  if (TAG) it.addTag(TAG);
  await it.saveTx();
  touched.push([it, m.pdf]); nMan++;
  say(`Created: ${m.note}`);
}

// 3. Existing items by parent key
for (const key of EXISTING) {
  const item = Zotero.Items.getByLibraryAndKey(lib, key);
  if (!item) { say(`MISSING item key ${key}`); continue; }
  if (!item.isTopLevelItem()) { say(`SKIPPED ${key}: not a top-level item`); continue; }
  if (DRY_RUN) { say(`WOULD FILE existing ${key} "${item.getField("title").slice(0, 70)}"`); continue; }
  if (await fileItem(item)) nFiled++;
  touched.push([item, []]);
}

// 4. PDFs for new or filed items that still lack one
if (!DRY_RUN) {
  for (const [it, urls] of touched) {
    if (hasPDF(it)) continue;
    if (await tryPDF(it, urls)) { nPDF++; say(`PDF added: ${it.getField("title").slice(0, 70)}`); }
  }
}

// 5. Metadata fixes (only when the current value is the known wrong one)
for (const f of FIXES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, f.key);
  if (!item) { say(`MISSING fix key ${f.key}`); continue; }
  const cur = item.getField(f.field);
  if (cur !== f.from) { say(`Fix skipped for ${f.note}: ${f.field} is now "${cur}"`); continue; }
  if (DRY_RUN) { say(`WOULD SET ${f.note} ${f.field} → ${f.to}`); continue; }
  item.setField(f.field, f.to); if (TAG && !item.hasTag(TAG)) item.addTag(TAG); await item.saveTx(); nFix++;
  say(`Fixed ${f.note}: ${f.field} → ${f.to}`);
}

// 6. Check and summary
const noFolder = touched.map(([i]) => i).filter(i => !i.getCollections().length);
const noPDF = touched.map(([i]) => i).filter(i => !hasPDF(i));
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, existing items newly filed ${nFiled}, items created ${nMan}, PDFs added ${nPDF}, fixes ${nFix}.`);
say(noFolder.length ? `WARNING: ${noFolder.length} item(s) in no folder: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF: ${noPDF.map(i => i.getField("title").slice(0, 60)).join(" | ")}`);
return log.join("\n");
