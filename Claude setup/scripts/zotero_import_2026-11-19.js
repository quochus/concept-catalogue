// Concept catalogue → Zotero import, filing and two metadata fixes (built by Claude, 19 Nov 2026):
// sources for the entries "Agrobiodiversity" (B20), "Biodiversity" (J27), "Nature-based solutions" (B15)
// and "Agroforestry" (B18).
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged):
//   1. Creates four sub-folders (or reuses them if they exist):
//      "3.4 Sustainable agriculture & environment" (NZ8RTA5J) › "Agrobiodiversity" and › "Agroforestry";
//      "5. Topics › Natural resource management" (BYAYHVYX) › "Biodiversity" and › "Nature-based solutions".
//   2. Imports 4 DOIs checked on Crossref (Beillouin et al. 2021; Chausson et al. 2020; Seddon et al. 2021;
//      Kuyah et al. 2019) and adds 4 items by hand (Cohen-Shacham et al. 2016, IUCN report; IUCN 2016
//      Resolution 069; UNEA 2022 Resolution 5/5; Leakey 1996, Agroforestry Today), then files every existing
//      item the four pages cite into the matching folder.
//   3. Fixes two metadata errors found while drafting: RDWP22FA author is Christian Hald-Mortensen
//      (Zotero has "Christian, H.-M."); RZ8NHXYU (GIZ, Soc Trang EbA slides) is dated 2013, not 2001.
//   4. Tries open-access PDF links, then Find Available PDF, for every touched item without a PDF;
//      erases any download that is not a PDF.
//   5. Ends with a summary and a check that no touched item is outside a folder.
//   Every item touched gets the tag below.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-11-19";
const DELAY_MS = 1500;

const FOLDERS = [
  { id: "AGB", parent: "NZ8RTA5J", name: "Agrobiodiversity", page: "Agrobiodiversity",
    dois: [ { doi: "10.1111/gcb.15747", note: "Beillouin et al. 2021, Positive but variable effects of crop diversification (second-order meta-analysis)" } ],
    manual: [],
    items: ["5TK8EYF6","M7VB95BI","P78BNFR8","L869UWYP","MK2UPKCM","H7TG8PNP","ZJG8Q65C","DV3VA6IS","RGIAKGBP","GWZ657DU","ARM2367K","YVCG3SZH","NMJW2MXA","SDZM835M"] },
  { id: "AF", parent: "NZ8RTA5J", name: "Agroforestry", page: "Agroforestry",
    dois: [ { doi: "10.1007/s13593-019-0589-8", note: "Kuyah et al. 2019, Agroforestry delivers a win-win solution for ecosystem services in SSA (meta-analysis)" } ],
    manual: [
      { note: "Leakey 1996, Definition of agroforestry revisited (Agroforestry Today; fields from the AGRIS record)",
        itemType: "journalArticle",
        fields: { title: "Definition of agroforestry revisited", publicationTitle: "Agroforestry Today", date: "1996",
                  url: "https://agris.fao.org/search/en/records/64775aa46dafec353e510071" },
        creators: [ { firstName: "R. R. B.", lastName: "Leakey", creatorType: "author" } ],
        pdf: [] } ],
    items: ["839CEG2D","HHIYGAQR","KT7CDPFM","NJKWQ837","A7Y5LXVM","YD8EUGLY"] },
  { id: "BIO", parent: "BYAYHVYX", name: "Biodiversity", page: "Biodiversity",
    dois: [], manual: [],
    items: ["NCHI6Q3L","P8XRMAX9","9LAZ8JAD","9JP8VLPM","HIL3CW9E","A88S7TUB","RDWP22FA","DLDTCQ23","RYLDEBM7","GWZ657DU"] },
  { id: "NBS", parent: "BYAYHVYX", name: "Nature-based solutions", page: "Nature-based solutions",
    dois: [ { doi: "10.1111/gcb.15513", note: "Seddon et al. 2021, Getting the message right on nature-based solutions to climate change" },
            { doi: "10.1111/gcb.15310", note: "Chausson et al. 2020, Mapping the effectiveness of nature-based solutions for climate change adaptation" } ],
    manual: [
      { note: "Cohen-Shacham et al. (Eds.) 2016, Nature-based solutions to address global societal challenges (IUCN)",
        itemType: "report",
        fields: { title: "Nature-based solutions to address global societal challenges", institution: "IUCN", place: "Gland, Switzerland", date: "2016",
                  url: "https://www.iucn.org/sites/dev/files/content/documents/2016-036.pdf" },
        creators: [
          { firstName: "E.", lastName: "Cohen-Shacham", creatorType: "editor" },
          { firstName: "G.", lastName: "Walters", creatorType: "editor" },
          { firstName: "C.", lastName: "Janzen", creatorType: "editor" },
          { firstName: "S.", lastName: "Maginnis", creatorType: "editor" } ],
        pdf: ["https://www.iucn.org/sites/dev/files/content/documents/2016-036.pdf"] },
      { note: "IUCN 2016, Resolution WCC-2016-Res-069, Defining Nature-based Solutions",
        itemType: "report",
        fields: { title: "Defining nature-based solutions", institution: "International Union for Conservation of Nature", date: "2016",
                  reportNumber: "WCC-2016-Res-069-EN", reportType: "Resolution",
                  url: "https://portals.iucn.org/library/sites/library/files/resrecfiles/WCC_2016_RES_069_EN.pdf" },
        creators: [ { lastName: "IUCN", creatorType: "author", fieldMode: 1 } ],
        pdf: ["https://portals.iucn.org/library/sites/library/files/resrecfiles/WCC_2016_RES_069_EN.pdf"] },
      { note: "UNEA 2022, Resolution 5/5, Nature-based solutions for supporting sustainable development",
        itemType: "report",
        fields: { title: "Nature-based solutions for supporting sustainable development", institution: "United Nations Environment Assembly", date: "2022",
                  reportNumber: "UNEP/EA.5/Res.5", reportType: "Resolution",
                  url: "https://wedocs.unep.org/bitstream/handle/20.500.11822/39752/K2200677%20-%20UNEP-EA.5-Res.5%20-%20Advance.pdf" },
        creators: [ { lastName: "UNEA", creatorType: "author", fieldMode: 1 } ],
        pdf: ["https://wedocs.unep.org/bitstream/handle/20.500.11822/39752/K2200677%20-%20UNEP-EA.5-Res.5%20-%20Advance.pdf"] } ],
    items: ["4TZHN2DY","SNJ7VQMW","RZ8NHXYU","YD8EUGLY"] },
];

const PDF_URLS = {};
const DOI_PDF = {};

// Metadata fixes (verified against the documents themselves)
const FIXES = [
  { key: "RDWP22FA", note: "author: Christian Hald-Mortensen (title page of the PDF)",
    creators: [ { firstName: "Christian", lastName: "Hald-Mortensen", creatorType: "author" } ] },
  { key: "RZ8NHXYU", note: "date: 2013 (slides dated 23.10.2013; project period 2007-2014)", fields: { date: "2013" } },
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
async function attachFromURL(item, urls) {
  for (const url of [].concat(urls || [])) {
    try {
      const att = await Zotero.Attachments.importFromURL({ libraryID: lib, url, parentItemID: item.id, contentType: "application/pdf" });
      if (att && att.attachmentContentType === "application/pdf") return true;
      if (att) await att.eraseTx();
    } catch (e) { say(`  Could not fetch PDF from ${url}: ${e}`); }
  }
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
  for (const [key, urls] of Object.entries(PDF_URLS)) {
    const item = touched.get(key) || Zotero.Items.getByLibraryAndKey(lib, key);
    if (!item || hasPDF(item)) continue;
    if (await attachFromURL(item, urls)) { nPDF++; say(`PDF attached from open-access link: ${item.getField("title").slice(0, 70)}`); }
  }
  for (const item of touched.values()) {
    if (hasPDF(item)) continue;
    const doi = (item.getField("DOI") || "").toLowerCase();
    if (DOI_PDF[doi] && await attachFromURL(item, DOI_PDF[doi])) { nPDF++; say(`PDF attached from open-access link: ${item.getField("title").slice(0, 70)}`); continue; }
    if (await tryPDF(item)) { nPDF++; say(`PDF added: ${item.getField("title").slice(0, 70)}`); }
  }
}

for (const fx of FIXES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, fx.key);
  if (!item || !item.isTopLevelItem()) { say(`FIX SKIPPED ${fx.key}: not found`); continue; }
  if (DRY_RUN) { say(`WOULD FIX ${fx.key}: ${fx.note}`); continue; }
  if (fx.creators) item.setCreators(fx.creators);
  for (const [k, v] of Object.entries(fx.fields || {})) item.setField(k, v);
  item.addTag(TAG); await item.saveTx(); touched.set(fx.key, item); say(`Fixed ${fx.key}: ${fx.note}`);
}

const all = [...touched.values()];
const noFolder = all.filter(i => !i.getCollections().length);
const noPDF = all.filter(i => !hasPDF(i));
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Imported ${nImp}, added by hand ${nManual}, already in library ${nSkip}, failed ${nFail}, newly filed ${nFiled}, missing/skipped keys ${nBad}, PDFs added ${nPDF}.`);
say(noFolder.length ? `NOT IN ANY FOLDER: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF (${noPDF.length}): ` + noPDF.map(i => `${i.key} "${i.getField("title").slice(0, 50)}"`).join("; "));
return log.join("\n");
