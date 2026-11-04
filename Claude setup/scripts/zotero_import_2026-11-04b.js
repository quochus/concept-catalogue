// Concept catalogue → Zotero import and filing, batch b (built by Claude, 4 Nov 2026).
// REPLACES zotero_import_2026-11-04.js: run only this file. If you already ran the first one, this one is safe:
// it skips DOIs already in your library and only files them.
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged; items stay in every folder they are in now):
//   1. "Technology readiness" under Innovations (7UVMCVZ9): 15 DOIs + 2 hand-added items (Héder 2017, GAO 2020) + 4 existing items.
//   2. "Supply chain technologies" under 3.5 Markets, value chains & retail (WMC8FS8W), the MAIN folder with the key
//      articles: cross-cutting reviews, Viet Nam / ASEAN overviews, adoption and readiness studies and critical views
//      (17 DOIs + 16 existing items). Key papers of each group are ALSO kept here.
//   3. Four sub-folders of "Supply chain technologies", one per technology group:
//        1. Preservation - cooling, storage & packaging              (22 DOIs + 7 existing items)
//        2. Monitoring & sensing - cold chain IoT & digital twins     (10 DOIs)
//        3. Traceability, information & digital platforms            (21 DOIs + 14 existing items)
//        4. Automation & robotics - sorting, grading & harvesting    (9 DOIs)
//      An item can sit in the main folder and in a group folder at the same time (Zotero folders are like tags).
//   4. Tries Find Available PDF for every touched item without one; erases non-PDF downloads.
//   5. Ends with a summary and a check that no touched item is outside a folder.
//   All DOIs were checked on Crossref (4 Nov 2026). Every item touched gets the tag below.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-11-04b";
const DELAY_MS = 1500;

const FOLDERS = [
  { id: "TR", name: "Technology readiness", parent: "7UVMCVZ9", page: "Technology readiness",
    dois: [
      { doi: "10.1016/j.actaastro.2009.03.058", note: "Mankins 2009, TRA retrospective" },
      { doi: "10.1002/sys.21533", note: "Olechowski et al. 2020, TRL shortcomings" },
      { doi: "10.1177/109467050024001", note: "Parasuraman 2000, TRI" },
      { doi: "10.1177/1094670514539730", note: "Parasuraman & Colby 2015, TRI 2.0" },
      { doi: "10.1007/978-3-030-92022-7_3", note: "Schut et al. 2022, Scaling Readiness learnings" },
      { doi: "10.1016/j.agsy.2024.104006", note: "Pawera et al. 2024, farmer participation" },
      { doi: "10.1016/j.agsy.2024.104148", note: "Frija 2024, system readiness" },
      { doi: "10.1016/j.techfore.2021.120854", note: "Vik et al. 2021, BRLa" },
      { doi: "10.1080/1389224x.2021.1984955", note: "McCampbell et al. 2021, user readiness Rwanda" },
      { doi: "10.17358/brcs.7.1.14", note: "Rifani et al. 2026, F&V traceability readiness Indonesia" },
      { doi: "10.1088/1757-899x/337/1/012058", note: "Hayuningtyas & Djatna 2018, postharvest TRL" },
      { doi: "10.1371/journal.pone.0251958", note: "Gebreyes et al. 2021, constraints of scaling" },
      { doi: "10.1108/jadee-04-2021-0090", note: "Omar et al. 2021, TRI e-AgriFinance" },
      { doi: "10.32890/jes2023.5.1.3", note: "Rusli et al. 2023, TRI paddy farmers" },
      { doi: "10.26459/hueunijed.v132i5b.7187", note: "Duong et al. 2023, blockchain readiness Hue" },
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
  { id: "SC", name: "Supply chain technologies", parent: "WMC8FS8W", page: "Supply chain technologies (fruits and vegetables): key articles",
    dois: [
      { doi: "10.13031/ja.15660", note: "Kaur & Watson 2024, scoping review postharvest losses, SCM and technology" },
      { doi: "10.3390/pr8111431", note: "Onwude et al. 2020, reducing losses in fresh produce supply chains" },
      { doi: "10.1002/jsfa.4295", note: "Kitinoja et al. 2011, postharvest technology for developing countries" },
      { doi: "10.1111/agec.12300", note: "Deichmann et al. 2016, digital technologies in developing-country agriculture" },
      { doi: "10.1016/j.foodpol.2023.102439", note: "Abate et al. 2023, digital tools not at scale in Africa" },
      { doi: "10.1016/j.compind.2020.103187", note: "Lezoche et al. 2020, Agri-food 4.0" },
      { doi: "10.1016/j.joitmc.2023.100102", note: "Fauziana et al. 2023, adoption of loss-reduction technologies, mangosteen" },
      { doi: "10.17358/brcs.7.1.14", note: "Rifani et al. 2026, readiness by chain stage, F&V traceability" },
      { doi: "10.1088/1757-899x/337/1/012058", note: "Hayuningtyas & Djatna 2018, postharvest technology readiness" },
      { doi: "10.1177/00307270231197825", note: "Hoang & Tran 2023, digital technology adoption, Viet Nam" },
      { doi: "10.3390/su151612530", note: "Gumbi et al. 2023, digital agriculture for smallholders, systematic review" },
      { doi: "10.1016/j.jafr.2025.101806", note: "Defraeye et al. 2025, Cooling Atlas for LMIC" },
      { doi: "10.1111/1541-4337.12269", note: "Mercier et al. 2017, time-temperature management in cold chains" },
      { doi: "10.1016/j.tifs.2019.07.034", note: "Kamilaris et al. 2019, blockchain in agri-food" },
      { doi: "10.1002/rob.21525", note: "Bac et al. 2014, harvesting robots review" },
      { doi: "10.56669/adsb1623", note: "FFTC 2003, country report on fruit and vegetable preservation in Viet Nam" },
      { doi: "10.56669/fjxf6035", note: "FFTC 2003, postharvest handling of vegetables in Ho Chi Minh City" },
    ], manual: [],
    items: ["4AKJEGWT", "LBHIQRKG", "L62X4M9A", "QF6NGNJE", "X7YSVP4S", "3ZE6AWCS", "AGSBQINR", "DX7R99QH", "7R3BGLGF", "36R37R63", "RR8GCI4Q", "HJ3CKCFJ", "69JLAEJC", "GFZYUYZ6", "J8MCCYSW", "533RYBZA"] },
  { id: "SC1", name: "1. Preservation - cooling, storage & packaging", parentId: "SC", page: "Group 1: preservation technologies",
    dois: [
      { doi: "10.3390/horticulturae8090776", note: "Makule et al. 2022, precooling and cold storage in SSA" },
      { doi: "10.1016/j.jafr.2025.101806", note: "Defraeye et al. 2025, Cooling Atlas" },
      { doi: "10.3389/frfst.2023.1100181", note: "Defraeye et al. 2023, where to deploy evaporative coolers" },
      { doi: "10.1016/j.esd.2025.101787", note: "Wittkamp et al. 2025, evaporative cooling blanket, Kenya" },
      { doi: "10.1016/j.jafr.2025.101949", note: "Elolu et al. 2025, evaporative cold storage, indigenous vegetables" },
      { doi: "10.1111/jfpe.14134", note: "Patel et al. 2022, evaporative cooling, India" },
      { doi: "10.3390/su15021331", note: "Mohan et al. 2023, tomato chain storage, India" },
      { doi: "10.1111/1541-4337.12269", note: "Mercier et al. 2017, cold chain time-temperature" },
      { doi: "10.1093/ce/zkad015", note: "Amjad et al. 2023, decentralised solar-powered cooling, review" },
      { doi: "10.1111/agec.12771", note: "Takeshima et al. 2023, solar cold storage impact evaluation, Nigeria" },
      { doi: "10.3389/fsufs.2025.1525148", note: "Kansanga et al. 2025, willingness to adopt solar cold storage, Ghana" },
      { doi: "10.1016/j.erss.2024.103686", note: "Garcia/Quaresma et al. 2024, solar off-grid cold storage business models" },
      { doi: "10.1016/j.seta.2024.104032", note: "Singh Tomar & Pradhan 2024, solar refrigeration for F&V, review" },
      { doi: "10.1007/s13197-011-0311-6", note: "Basediya et al. 2013, evaporative cooling for F&V, review" },
      { doi: "10.1111/jfpe.70127", note: "Lufu et al. 2025, evaporative cooling in SSA, review" },
      { doi: "10.1201/9781003056607-16", note: "Odeyemi & Ikegwuonu 2021, ColdHubs solar cold rooms, Nigeria" },
      { doi: "10.1201/9781003056607-17", note: "Verploegen et al. 2021, low-cost cooling, Rwanda and Burkina Faso" },
      { doi: "10.1109/ghtc.2018.8601894", note: "Verploegen et al. 2018, evaporative coolers, Mali" },
      { doi: "10.1016/j.postharvbio.2022.112235", note: "Mahajan & Lee 2023, MAP: science and commercial success" },
      { doi: "10.21273/hortsci14732-19", note: "Batziakas et al. 2020, passive MAP for small producers" },
      { doi: "10.1016/j.postharvbio.2020.111119", note: "Matar et al. 2020, MAP and consumer behaviour" },
      { doi: "10.56669/akaz4739", note: "FFTC 2019, postharvest handling innovations, dragon fruit, Viet Nam" },
    ], manual: [],
    items: ["QF6NGNJE", "LBHIQRKG", "L62X4M9A", "4S3I5GXH", "Q75S62KL", "8HZR2CCD", "6FYG5CWQ"] },
  { id: "SC2", name: "2. Monitoring & sensing - cold chain IoT & digital twins", parentId: "SC", page: "Group 2: monitoring and sensing",
    dois: [
      { doi: "10.1111/1541-4337.12269", note: "Mercier et al. 2017, cold chain time-temperature" },
      { doi: "10.3390/pr8111431", note: "Onwude et al. 2020, sensing and digital twins for fresh produce" },
      { doi: "10.3390/foods11121777", note: "Lamberty & Kreyenschmidt 2022, IoT ambient monitoring for F&V, review" },
      { doi: "10.1007/s44187-025-00427-1", note: "Lamberty & Kreyenschmidt 2025, requirements for IoT temperature monitoring" },
      { doi: "10.3390/s20071860", note: "Torres-Sanchez et al. 2020, real-time shelf-life monitoring" },
      { doi: "10.1016/j.foodcont.2013.09.023", note: "Qi et al. 2014, WSN shelf-life decision support" },
      { doi: "10.1016/j.postharvbio.2025.113714", note: "Elashmawy et al. 2025, digital cold chain with AI" },
      { doi: "10.3389/frai.2026.1830032", note: "Taguta et al. 2026, IoT-ML temperature breaks, systematic review" },
      { doi: "10.1016/j.jfoodeng.2022.111077", note: "Shoji et al. 2022, physics-based digital twins" },
      { doi: "10.1016/j.tifs.2021.01.025", note: "Defraeye et al. 2021, digital twins for fresh produce" },
    ], manual: [], items: [] },
  { id: "SC3", name: "3. Traceability, information & digital platforms", parentId: "SC", page: "Group 3: information and coordination",
    dois: [
      { doi: "10.1108/itp-02-2023-0168", note: "Yap et al. 2023, blockchain traceability, Vietnamese fruit" },
      { doi: "10.1016/j.tifs.2019.07.034", note: "Kamilaris et al. 2019, blockchain in agri-food" },
      { doi: "10.1016/j.jclepro.2020.121031", note: "Feng et al. 2020, blockchain traceability review" },
      { doi: "10.1109/tem.2021.3110903", note: "Menon & Jain 2024, blockchain transparency, limitations" },
      { doi: "10.1016/j.wds.2024.100185", note: "Steinke et al. 2024, digital tracing, Peruvian cocoa" },
      { doi: "10.3390/s23115342", note: "Bosona & Gebresenbet 2023, blockchain traceability review" },
      { doi: "10.1016/j.compind.2019.04.002", note: "Zhao et al. 2019, blockchain in agri-food value chains" },
      { doi: "10.1016/j.ijinfomgt.2019.05.023", note: "Kamble et al. 2020, blockchain traceability enablers, India" },
      { doi: "10.1002/aepp.13134", note: "Collart & Canales 2022, blockchain traceability in fresh produce" },
      { doi: "10.3390/app11167596", note: "Tagarakis et al. 2021, IoT traceability for fresh produce" },
      { doi: "10.47191/ijsshr/v5-i3-16", note: "Vu 2022, Vietnamese farmers and e-commerce for fresh produce" },
      { doi: "10.1111/glob.12352", note: "Yang 2022, digital platforms and SE Asian fruit trade to China" },
      { doi: "10.3390/su16156496", note: "Morepje et al. 2024, e-commerce for smallholders in SSA, review" },
      { doi: "10.59261/jedvb.v3i2.51", note: "Magfiroh et al. 2025, agricultural e-commerce, West Java" },
      { doi: "10.1111/agec.12300", note: "Deichmann et al. 2016, digital technologies" },
      { doi: "10.1016/j.foodpol.2023.102439", note: "Abate et al. 2023, digital tools in African markets" },
      { doi: "10.1177/00307270231197825", note: "Hoang & Tran 2023, digital adoption, Viet Nam" },
      { doi: "10.3390/su151612530", note: "Gumbi et al. 2023, digital agriculture for smallholders" },
      { doi: "10.26459/hueunijed.v132i5b.7187", note: "Duong et al. 2023, blockchain readiness, Hue" },
      { doi: "10.17358/brcs.7.1.14", note: "Rifani et al. 2026, traceability readiness, Indonesia" },
      { doi: "10.56669/hikf3611", note: "FFTC 2019, blockchain traceability for dragon fruit, Viet Nam" },
    ], manual: [],
    items: ["T3M2NHFB", "QAL8HBU8", "3ZE6AWCS", "FRHZQ99M", "BJZFEUQ6", "IIPZSUWT", "DYMN7BNF", "JKU7S2MU", "663MCZGI", "4S8JFYMA", "UGXY5YZB", "8SY9BIPR", "AGSBQINR", "DX7R99QH"] },
  { id: "SC4", name: "4. Automation & robotics - sorting, grading & harvesting", parentId: "SC", page: "Group 4: automation and robotics",
    dois: [
      { doi: "10.1002/rob.21525", note: "Bac et al. 2014, harvesting robots for high-value crops" },
      { doi: "10.1007/s11947-010-0411-8", note: "Cubero et al. 2011, machine vision for F&V inspection" },
      { doi: "10.1016/s1537-5110(03)00088-6", note: "Blasco et al. 2003, machine vision fruit grading" },
      { doi: "10.1016/j.jksuci.2018.06.002", note: "Bhargava & Bansal 2021, computer vision for F&V quality, review" },
      { doi: "10.1016/j.tifs.2018.09.018", note: "Zhang et al. 2018, challenges of optical grading systems" },
      { doi: "10.1007/s10846-022-01793-z", note: "Droukas et al. 2023, robotic harvesting survey" },
      { doi: "10.1109/access.2022.3190863", note: "Elfferich et al. 2022, soft grippers for crop handling" },
      { doi: "10.3390/agriengineering5040136", note: "Kaleem et al. 2023, fruit-harvesting robotic arms, critical review" },
      { doi: "10.3390/agronomy14102233", note: "Chen et al. 2024, picking robots, review" },
    ], manual: [], items: [] },
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
