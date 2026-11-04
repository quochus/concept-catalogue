// Concept catalogue → Zotero import and filing (built by Claude, 4 Nov 2026: "Technology readiness" and
// "Supply chain technologies (fruits and vegetables)")
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged; items stay in every folder they are in now):
//   1. Creates two sub-folders if they do not exist yet:
//        "Technology readiness"      under  3.x › Innovations            (key 7UVMCVZ9)
//        "Supply chain technologies" under  3.5 Markets, value chains & retail (key WMC8FS8W)
//   2. Imports by DOI the works the two pages cite that are not yet in your library (15 + 20 DOIs; two more papers are filed in both folders;
//      all checked on Crossref), skipping any DOI already present (that item is filed instead).
//   3. Adds two items without a DOI by hand, with fields taken from the source itself:
//      Héder (2017, The Innovation Journal) and GAO (2020, GAO-20-48G), and tries to attach their open PDFs.
//   4. Files the 15 items already in your library that the pages use into the same folders.
//   5. Tries Find Available PDF for every touched item without one; erases non-PDF downloads.
//   6. Ends with a summary: imported, already in library, failed, filed, PDFs added, items still without PDF,
//      and a check that no touched item is outside a folder.
//   Every item touched gets the tag below, so the batch can be reviewed or undone in one click.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-11-04";
const DELAY_MS = 1500;

const FOLDERS = [
  { name: "Technology readiness", parent: "7UVMCVZ9", page: "Technology readiness",
    dois: [
      { doi: "10.1016/j.actaastro.2009.03.058", note: "Mankins 2009, Technology readiness assessments: A retrospective" },
      { doi: "10.1002/sys.21533", note: "Olechowski et al. 2020, TRLs: Shortcomings and improvement opportunities" },
      { doi: "10.1177/109467050024001", note: "Parasuraman 2000, Technology Readiness Index (TRI)" },
      { doi: "10.1177/1094670514539730", note: "Parasuraman & Colby 2015, TRI 2.0" },
      { doi: "10.1007/978-3-030-92022-7_3", note: "Schut et al. 2022, Scaling Readiness: Learnings (book chapter)" },
      { doi: "10.1016/j.agsy.2024.104006", note: "Pawera et al. 2024, Guidance on farmer participation" },
      { doi: "10.1016/j.agsy.2024.104148", note: "Frija 2024, A system readiness approach" },
      { doi: "10.1016/j.techfore.2021.120854", note: "Vik et al. 2021, Balanced readiness level assessment (BRLa)" },
      { doi: "10.1080/1389224x.2021.1984955", note: "McCampbell et al. 2021, Are farmers ready to use phone-based digital tools?" },
      { doi: "10.17358/brcs.7.1.14", note: "Rifani et al. 2026, Supply chain actors' readiness, F&V traceability (Indonesia)" },
      { doi: "10.1088/1757-899x/337/1/012058", note: "Hayuningtyas & Djatna 2018, Technology transfer readiness, horticultural postharvest" },
      { doi: "10.1371/journal.pone.0251958", note: "Gebreyes et al. 2021, Overcoming constraints of scaling" },
      { doi: "10.1108/jadee-04-2021-0090", note: "Omar et al. 2021, Technology readiness and the e-AgriFinance app" },
      { doi: "10.32890/jes2023.5.1.3", note: "Rusli et al. 2023, Technology readiness index of paddy farmers (Malaysia)" },
      { doi: "10.26459/hueunijed.v132i5b.7187", note: "Duong et al. 2023, Stakeholders' readiness for blockchain (Hue)" },
    ],
    manual: [
      { itemType: "journalArticle", note: "Héder 2017, From NASA to EU (no DOI)",
        fields: { title: "From NASA to EU: the evolution of the TRL scale in Public Sector Innovation",
                  publicationTitle: "The Innovation Journal: The Public Sector Innovation Journal",
                  volume: "22", issue: "2", pages: "1-23", date: "2017", ISSN: "1715-3816",
                  url: "https://innovation.cc/wp-content/uploads/2017_22_2_3_heder_nasa-to-eu-trl-scale.pdf" },
        creators: [{ firstName: "Mihály", lastName: "Héder", creatorType: "author" }],
        pdf: "https://innovation.cc/wp-content/uploads/2017_22_2_3_heder_nasa-to-eu-trl-scale.pdf" },
      { itemType: "report", note: "GAO 2020, Technology Readiness Assessment Guide (GAO-20-48G)",
        fields: { title: "Technology Readiness Assessment Guide: Best Practices for Evaluating the Readiness of Technology for Use in Acquisition Programs and Projects",
                  reportNumber: "GAO-20-48G", institution: "U.S. Government Accountability Office",
                  place: "Washington, DC", date: "2020-01-07", url: "https://www.gao.gov/products/gao-20-48g" },
        creators: [{ lastName: "U.S. Government Accountability Office", creatorType: "author", fieldMode: 1 }],
        pdf: "https://www.gao.gov/assets/710/704769.pdf" },
    ],
    items: ["CI82HJLC", "LN37DDPN", "3MRZWJ2T", "Q7Y3XZSL"] },
  { name: "Supply chain technologies", parent: "WMC8FS8W", page: "Supply chain technologies (fruits and vegetables)",
    dois: [
      { doi: "10.13031/ja.15660", note: "Kaur & Watson 2024, Scoping review of postharvest losses, SCM and technology" },
      { doi: "10.3390/horticulturae8090776", note: "Makule et al. 2022, Precooling and cold storage in SSA" },
      { doi: "10.1016/j.jafr.2025.101806", note: "Defraeye et al. 2025, A Cooling Atlas for LMIC" },
      { doi: "10.3389/frfst.2023.1100181", note: "Defraeye et al. 2023, Passive evaporative coolers" },
      { doi: "10.1016/j.esd.2025.101787", note: "Wittkamp et al. 2025, Passive evaporative cooling blanket (Kenya)" },
      { doi: "10.1111/1541-4337.12269", note: "Mercier et al. 2017, Time–temperature management along the cold chain" },
      { doi: "10.3390/pr8111431", note: "Onwude et al. 2020, Reducing food losses in fresh produce supply chains" },
      { doi: "10.1108/itp-02-2023-0168", note: "Yap et al. 2023, Blockchain traceability in the Vietnamese fruit chain" },
      { doi: "10.1016/j.tifs.2019.07.034", note: "Kamilaris et al. 2019, The rise of blockchain in agri-food" },
      { doi: "10.1016/j.jclepro.2020.121031", note: "Feng et al. 2020, Blockchain for agri-food traceability" },
      { doi: "10.1111/agec.12300", note: "Deichmann et al. 2016, Will digital technologies transform agriculture?" },
      { doi: "10.1016/j.foodpol.2023.102439", note: "Abate et al. 2023, Digital tools and agricultural market transformation in Africa" },
      { doi: "10.1002/rob.21525", note: "Bac et al. 2014, Harvesting robots for high-value crops" },
      { doi: "10.1016/j.joitmc.2023.100102", note: "Fauziana et al. 2023, Postharvest loss-reduction technologies, mangosteen" },
      { doi: "10.1002/jsfa.4295", note: "Kitinoja et al. 2011, Postharvest technology for developing countries" },
      { doi: "10.1016/j.wds.2024.100185", note: "Steinke et al. 2024, Digital sustainability tracing, Peruvian cocoa" },
      { doi: "10.1016/j.jafr.2025.101949", note: "Elolu et al. 2025, Evaporative cold storage for African indigenous vegetables" },
      { doi: "10.1109/tem.2021.3110903", note: "Menon & Jain 2024, Blockchain for transparency in agri-food" },
      { doi: "10.1111/jfpe.14134", note: "Patel et al. 2022, Low-cost evaporative cooling storage (India)" },
      { doi: "10.1016/j.compind.2020.103187", note: "Lezoche et al. 2020, Agri-food 4.0" },
      { doi: "10.17358/brcs.7.1.14", note: "Rifani et al. 2026 (also filed under Technology readiness)" },
      { doi: "10.1088/1757-899x/337/1/012058", note: "Hayuningtyas & Djatna 2018 (also filed under Technology readiness)" },
    ],
    manual: [],
    items: ["4AKJEGWT", "LBHIQRKG", "L62X4M9A", "QF6NGNJE", "X7YSVP4S", "T3M2NHFB", "3ZE6AWCS",
            "AGSBQINR", "QAL8HBU8", "DX7R99QH", "7R3BGLGF"] },
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
async function getFolder(f) {
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
