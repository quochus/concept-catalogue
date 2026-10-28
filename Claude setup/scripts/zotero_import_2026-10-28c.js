// Concept catalogue → Zotero import (built by Claude, 28 Oct 2026, batch c: J06 Food system resilience, second revision)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
//   Takes about a minute.
// What it does (additive only; it never moves, deletes or merges items):
//   1. Imports 4 DOIs (Cottrell et al. 2019; Davis et al. 2021; Hertel et al. 2021; Smith & Frankenberger 2018), skipping any already
//      in your library, into Main collection > 3. Food systems > 3.7 Food security, safety & resilience > Food system resilience.
//   2. Creates 1 hand-entered book section (Dawe & Slayton 2011, The world rice market in 2007-08, FAO) in the same folder,
//      with the open PDF from fao.org.
//   3. Files 5 items already in your library into that folder (Adger 2000; Barrett & Constas 2014; Biggs et al. 2012;
//      Carpenter et al. 2001; Cote & Nightingale 2012).
//   4. Tries open-access PDFs and erases any non-PDF download.
//   5. Fixes two records: Rotz & Fraser (2018) DOI and pages (10.4324/9781315561103-6, pp. 103-116),
//      and the author "Frankerberger" → "Frankenberger" in Béné et al. (2026).
//   6. Ends with a check that every touched item is in a folder, and a summary.
//   Every item touched gets the tag below, so the batch can be reviewed or undone in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-28c";
const FOLDER_KEY = "F322LI9L";         // 3. Food systems > 3.7 Food security, safety & resilience > Food system resilience
const DELAY_MS = 1500;

// DOIs, Crossref-checked in Quoc's personal account (28 Oct 2026).
const DOIS = [
  { doi: "10.1038/s41893-018-0210-1", note: "Cottrell et al. 2019, Food production shocks across land and sea", pdf: [] },
  { doi: "10.1038/s43016-020-00196-3", note: "Davis, Downs & Gephart 2021, Towards food supply chain resilience to environmental shocks", pdf: [] },
  { doi: "10.1038/s43016-021-00403-9", note: "Hertel et al. 2021, Diversification for enhanced food systems resilience", pdf: [] },
  { doi: "10.1016/j.worlddev.2017.07.003", note: "Smith & Frankenberger 2018, Resilience capacity and the 2014 Bangladesh floods", pdf: [] },
];

// Book section without DOI; metadata from Quoc's revised page (28 Oct 2026).
const MANUAL = [
  { type: "bookSection", note: "Dawe & Slayton 2011 (world rice market 2007-08)",
    fields: { title: "The world rice market in 2007–08", bookTitle: "Safeguarding food security in volatile global markets",
              publisher: "FAO", place: "Rome", date: "2011", pages: "164–174",
              url: "https://www.fao.org/3/i2107e/i2107e09.pdf" },
    creators: [{ lastName: "Dawe", firstName: "D.", creatorType: "author" },
               { lastName: "Slayton", firstName: "T.", creatorType: "author" },
               { lastName: "Prakash", firstName: "A.", creatorType: "editor" }],
    pdf: ["https://www.fao.org/3/i2107e/i2107e09.pdf"] },
];

const EXISTING = [
  "KIQMSJWN", // Adger 2000
  "J5MF2XSS", // Barrett & Constas 2014
  "C56RYANJ", // Biggs et al. 2012
  "EK4TLDCU", // Carpenter et al. 2001
  "Y296LBKM", // Cote & Nightingale 2012
];

// Rotz & Fraser: 10.4324/9781315561103-17 is another chapter (Hsu, "Governing by numbers"); correction checked on Crossref by Quoc.
const FIXES = [
  { key: "STICAMIL", field: "DOI", from: "10.4324/9781315561103-17", to: "10.4324/9781315561103-6", note: "Rotz & Fraser 2018 (DOI)" },
  { key: "STICAMIL", field: "pages", from: "133-146", to: "103–116", note: "Rotz & Fraser 2018 (pages)" },
];
const CREATOR_FIXES = [
  { key: "LXU3KLB6", from: "Frankerberger", to: "Frankenberger", note: "Béné et al. 2026 author" },
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
  it.setCreators(m.creators.map(c => c.name ? { lastName: c.name, creatorType: c.creatorType, fieldMode: c.fieldMode } : c));
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
  try { item.setField(f.field, f.to); }
  catch (e) { item.setField("extra", ((item.getField("extra") || "") + `\nDOI: ${f.to}`).trim()); say(`${f.note}: no ${f.field} field for this item type; DOI written to Extra`); }
  if (TAG && !item.hasTag(TAG)) item.addTag(TAG); await item.saveTx(); nFix++;
  say(`Fixed ${f.note}: ${f.field} → ${f.to}`);
}

// 5b. Creator name fixes
for (const f of CREATOR_FIXES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, f.key);
  if (!item) { say(`MISSING fix key ${f.key}`); continue; }
  const cr = item.getCreators();
  const i = cr.findIndex(c => c.lastName === f.from);
  if (i < 0) { say(`Fix skipped for ${f.note}: no creator named ${f.from}`); continue; }
  if (DRY_RUN) { say(`WOULD RENAME ${f.note}: ${f.from} → ${f.to}`); continue; }
  cr[i].lastName = f.to; item.setCreators(cr);
  if (TAG && !item.hasTag(TAG)) item.addTag(TAG); await item.saveTx(); nFix++;
  say(`Fixed ${f.note}: ${f.from} → ${f.to}`);
}

// 6. Check and summary
const noFolder = touched.map(([i]) => i).filter(i => !i.getCollections().length);
const noPDF = touched.map(([i]) => i).filter(i => !hasPDF(i));
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, existing items newly filed ${nFiled}, items created ${nMan}, PDFs added ${nPDF}, fixes ${nFix}.`);
say(noFolder.length ? `WARNING: ${noFolder.length} item(s) in no folder: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF: ${noPDF.map(i => i.getField("title").slice(0, 60)).join(" | ")}`);
return log.join("\n");
