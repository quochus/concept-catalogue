// Concept catalogue → Zotero import and filing (built by Claude, 13 Nov 2026):
// sources for the entries "Food loss and waste" (C07) and "Food loss and waste in Viet Nam" (C32).
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged):
//   1. Uses the existing folder "3.5 Markets, value chains & retail › Food loss and waste" (key SHZ5DNQR)
//      and creates a sub-folder inside it: "Food loss and waste in Viet Nam".
//   2. Imports 18 DOIs checked on Crossref (9 general FLW works, 9 Viet Nam studies found in a literature
//      search on 13 Nov) and adds 2 reports by hand (Gustavsson et al. 2011, FAO; Kok et al. 2024, WUR brief
//      on rice food loss in Viet Nam), then files every existing item the two pages cite, plus five relevant
//      items already in the library, into the matching folder.
//   3. Tries open-access PDF links (FAO, UN Digital Library, Royal Society), then Find Available PDF,
//      for every touched item without a PDF; erases any download that is not a PDF.
//   4. Ends with a summary and a check that no touched item is outside a folder.
//   Every item touched gets the tag below.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-11-13";
const DELAY_MS = 1500;

const FOLDERS = [
  { id: "FLW", key: "SHZ5DNQR", name: "Food loss and waste", page: "Food loss and waste",
    dois: [
      { doi: "10.1098/rstb.2010.0126", note: "Parfitt, Barthel & Macnaughton 2010, food waste within food supply chains (Phil Trans B 365(1554), 3065-3081)" },
      { doi: "10.18356/32f21f8c-en", note: "FAO 2019, The State of Food and Agriculture 2019: moving forward on food loss and waste reduction" },
      { doi: "10.1021/acs.est.7b00401", note: "Xue et al. 2017, Missing food, missing data? Critical review of global FLW data (634 cites)" },
      { doi: "10.1016/j.gfs.2016.11.004", note: "Chaboud & Daviron 2017, Food losses and waste: navigating the inconsistencies (191 cites)" },
      { doi: "10.1016/j.foodpol.2017.03.012", note: "Sheahan & Barrett 2017, Review: food loss and waste in sub-Saharan Africa (284 cites)" },
      { doi: "10.1093/ajae/aax034", note: "Bellemare et al. 2017, On the measurement of food waste (295 cites)" },
      { doi: "10.1016/j.resconrec.2013.04.011", note: "Quested et al. 2013, Spaghetti soup: the complex world of food waste behaviours (758 cites)" },
      { doi: "10.1016/j.scitotenv.2016.07.041", note: "Porter et al. 2016, half-century of GHG from FLW (loss rates used in the Viet Nam model)" },
      { doi: "10.3389/fhort.2025.1529040", note: "Ambuko et al. 2025, FLW data gaps in fruit and vegetable value chains (review)" },
    ],
    manual: [
      { note: "Gustavsson et al. 2011, Global food losses and food waste (FAO)",
        itemType: "report",
        fields: { title: "Global food losses and food waste: Extent, causes and prevention", institution: "FAO", place: "Rome", date: "2011",
                  url: "http://www.fao.org/docrep/014/mb060e/mb060e00.pdf" },
        creators: [
          { firstName: "Jenny", lastName: "Gustavsson", creatorType: "author" },
          { firstName: "Christel", lastName: "Cederberg", creatorType: "author" },
          { firstName: "Ulf", lastName: "Sonesson", creatorType: "author" },
          { firstName: "Robert", lastName: "van Otterdijk", creatorType: "author" },
          { firstName: "Alexandre", lastName: "Meybeck", creatorType: "author" } ],
        pdf: ["http://www.fao.org/docrep/014/mb060e/mb060e00.pdf", "https://www.fao.org/3/mb060e/mb060e.pdf"] },
    ],
    // existing items cited on "Food loss and waste" (parent keys, checked in the database copy)
    items: ["J8MCCYSW", "QI2WU8J3", "533RYBZA", "325UTQIJ", "NHWPU5HX", "2ZXVSCTR", "4RGU8E8N", "4RQAUD97",
            "I9LYC844", "5RTT8UZX", "GRYYL6YX", "2U6KBGB7", "M69V2NLP", "KD6ZEQPU", "VL7X3NDZ", "9656HVW9",
            "4AKJEGWT", "DMM5PZMR", "X7YSVP4S", "WPRARBB9", "JGNDBNPW",
            "LPSLSHBW", "JGNXK2PB"] },   // Fabi et al. 2021; Hodges et al. 2011 (already in library)
  { id: "FLWVN", name: "Food loss and waste in Viet Nam", parentId: "FLW", page: "Food loss and waste in Viet Nam",
    dois: [
      { doi: "10.3390/su12166565", note: "Liu & Nguyen 2020, household food waste generation in Hanoi and SDG 12.3" },
      { doi: "10.3390/su13137368", note: "Pham et al. 2021, food waste in Da Nang: trends, challenges, perspectives" },
      { doi: "10.1016/j.clwas.2025.100349", note: "Nguyen & Nguyen 2025, extended TPB and household food waste reduction in Viet Nam" },
      { doi: "10.1007/s43621-026-04333-z", note: "Tran et al. 2026, urban household food waste reduction intentions in Viet Nam (TPB)" },
      { doi: "10.18174/577022", note: "Axmann, Soethoudt & Thuy 2022, Roadmap post-harvest loss reduction in Vietnamese value chains, phase 2 (WFBR report 2330)" },
      { doi: "10.56097/binhduonguniversityjournalofscienceandtechnology.v5i2.42", note: "Tang et al. 2022, Tackling food loss in Viet Nam's logistics sector via technology" },
      { doi: "10.17660/actahortic.2018.1213.4", note: "Phan 2018, mechanization and postharvest technologies in Viet Nam's rice sector" },
      { doi: "10.5539/jas.v17n11p40", note: "Pham et al. 2025, determinants of post-harvest losses in Vietnamese lychee farming" },
      { doi: "10.61602/jdi.2025.81.09", note: "Ho et al. 2025, shallot supply chain losses in Tra Vinh province" },
    ],
    manual: [
      { note: "Kok et al. 2024, Insights from primary data collection on rice food loss in Vietnam (WUR brief)",
        itemType: "report",
        fields: { title: "Insights from primary data collection on rice food loss in Vietnam", institution: "Wageningen University & Research",
                  place: "Wageningen", date: "2024", reportType: "Brief", url: "https://hdl.handle.net/10568/168355" },
        creators: [
          { firstName: "M. G.", lastName: "Kok", creatorType: "author" },
          { firstName: "J. M.", lastName: "Soethoudt", creatorType: "author" },
          { firstName: "X.", lastName: "Guo", creatorType: "author" },
          { firstName: "H. B.", lastName: "Axmann", creatorType: "author" } ],
        pdf: [] },
    ],
    items: ["TT5Q3JB5", "X7YSVP4S", "IWBELK5L", "QF6NGNJE", "4NZBJF2X", "DMM5PZMR", "IGUVCWPL", "4AKJEGWT", "K4C7HRJU",
            "JE5IMKAL", "GU2T5V38", "W9YBLWCZ"] },   // Yang et al. 2021; Gligor et al. 2018; Pottinger-Glass et al. 2025 (already in library)
];

// Open-access PDF links tried for existing items that have no PDF yet
const PDF_URLS = {
  "WPRARBB9": ["https://digitallibrary.un.org/record/4042857/files/1401794_EN.pdf"],   // UNEP Food Waste Index Report 2024
  "JGNDBNPW": ["http://www.fao.org/3/a-i3901e.pdf"],                                    // HLPE 2014, Food losses and waste
};
// Open-access PDF links tried first for newly imported DOIs (then Find Available PDF)
const DOI_PDF = {
  "10.1098/rstb.2010.0126": ["https://royalsocietypublishing.org/doi/pdf/10.1098/rstb.2010.0126"],
  "10.18356/32f21f8c-en": ["https://www.fao.org/3/ca6030en/ca6030en.pdf"],
  "10.18174/577022": ["https://edepot.wur.nl/577022"],
  "10.5539/jas.v17n11p40": ["https://ccsenet.org/journal/index.php/jas/article/download/0/0/52305/56959"],
  "10.61602/jdi.2025.81.09": ["https://vjol.info.vn/kttc/vi/article/view/114187/95517"],
};

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

const all = [...touched.values()];
const noFolder = all.filter(i => !i.getCollections().length);
const noPDF = all.filter(i => !hasPDF(i));
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Imported ${nImp}, added by hand ${nManual}, already in library ${nSkip}, failed ${nFail}, newly filed ${nFiled}, missing/skipped keys ${nBad}, PDFs added ${nPDF}.`);
say(noFolder.length ? `NOT IN ANY FOLDER: ${noFolder.map(i => i.key).join(", ")}` : "Check: every touched item is in a folder.");
if (noPDF.length) say(`Still without PDF (${noPDF.length}): ` + noPDF.map(i => `${i.key} "${i.getField("title").slice(0, 50)}"`).join("; "));
return log.join("\n");
