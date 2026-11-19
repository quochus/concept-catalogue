// Concept catalogue → Zotero import and filing, batch b (built by Claude, 19 Nov 2026):
// more literature for "Agrobiodiversity" (B20), "Biodiversity" (J27), "Nature-based solutions" (B15), "Agroforestry" (B18).
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged):
//   1. Uses the four folders made by batch 2026-11-19: Agrobiodiversity (BVJFCLDC), Agroforestry (5JJE33T2),
//      Biodiversity (UWD5SQLT), Nature-based solutions (QSVXMQBT).
//   2. Imports 47 new DOIs checked on Crossref on 19 Nov: seminal works, reviews and meta-analyses, recent papers and
//      Viet Nam/ASEAN studies found in an online search (OpenAlex, Crossref).
//      It also imports into My Library copies of 6 papers the pages cite that so far exist only in the FECB_Alliance
//      group library (group items cannot be put into My Library folders), and adds Gonsalves et al. 2025 by hand.
//      The group items themselves are not touched.
//   3. Files 3 relevant items already in My Library (Pascual et al. 2017; Nguyen et al. 2013; a Viet Nam agroforestry
//      and extreme-weather paper).
//   4. Tries open-access PDF links, then Find Available PDF; erases any download that is not a PDF.
//   5. Ends with a summary and a check that no touched item is outside a folder.
//   Every item touched gets the tag below.

const DRY_RUN = false;                 // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-11-19b";
const DELAY_MS = 1500;

const FOLDERS = [
  { id: "AGB", key: "BVJFCLDC", name: "Agrobiodiversity", page: "Agrobiodiversity",
    dois: [
      { doi: "10.1016/j.agee.2006.12.017", note: "Jackson, Pascual & Hodgkin 2007, Utilizing and conserving agrobiodiversity in agricultural landscapes (seminal)" },
      { doi: "10.1111/1468-2346.00133", note: "Thrupp 2000, Linking agricultural biodiversity and food security (seminal)" },
      { doi: "10.3390/su3010238", note: "Frison, Cherfas & Hodgkin 2011, Agricultural biodiversity is essential for food and nutrition security" },
      { doi: "10.1038/nplants.2017.47", note: "Zimmerer & de Haan 2017, Agrobiodiversity and a sustainable food future" },
      { doi: "10.1016/j.ancene.2019.100192", note: "Zimmerer et al. 2019, Agrobiodiversity in the Anthropocene: conceptual framework" },
      { doi: "10.1073/pnas.0800607105", note: "Jarvis et al. 2008, Traditional crop-variety diversity maintained by farming communities" },
      { doi: "10.1016/j.foodpol.2018.04.013", note: "Sibhatu & Qaim 2018, Meta-analysis: production diversity, diets and nutrition" },
      { doi: "10.1093/nutrit/nux040", note: "Jones 2017, Critical review: agricultural biodiversity, diet diversity and nutrition in LMICs" },
      { doi: "10.1007/s12571-015-0466-5", note: "Powell et al. 2015, Improving diets with wild and cultivated biodiversity" },
      { doi: "10.1126/sciadv.aba1715", note: "Tamburini et al. 2020, Agricultural diversification promotes ecosystem services (meta-analysis)" },
      { doi: "10.1016/s0167-8809(02)00228-1", note: "Trinh et al. 2003, Agrobiodiversity conservation and development in Vietnamese home gardens" },
      { doi: "10.1007/s10722-010-9603-3", note: "Vlkova et al. 2011, Ethnobotanical knowledge and agrobiodiversity in home gardens, central Viet Nam" },
      { doi: "10.1080/14888386.2008.9712879", note: "Halwart 2008, Biodiversity, nutrition and livelihoods in aquatic rice-based ecosystems" },
      { doi: "10.3390/agriculture12020253", note: "Mulia et al. 2022, Policy support for home gardens in Vietnam and the SDGs" },
      { doi: "10.1073/pnas.1313490111", note: "Khoury et al. 2014 (copy into My Library; original is in the FECB_Alliance group)" },
      { doi: "10.1007/s12571-020-01088-x", note: "Zimmerer & de Haan 2020 (copy into My Library; original in group)" },
      { doi: "10.1017/S1368980018000617", note: "Luna-Gonzalez & Sorensen 2018 (copy into My Library; original in group)" },
      { doi: "10.1038/s43016-024-01096-6", note: "Nguyen & Qaim 2025 (copy into My Library; original in group)" },
      { doi: "10.1016/j.agsy.2025.104515", note: "Nguyen et al. 2026, northern Viet Nam vegetable seed (copy into My Library; original in group)" },
      { doi: "10.1016/j.lanplh.2025.101374", note: "Estrada-Carmona et al. 2025 (copy into My Library; original in group)" },
    ],
    manual: [], items: [] },
  { id: "BIO", key: "UWD5SQLT", name: "Biodiversity", page: "Biodiversity",
    dois: [
      { doi: "10.1038/nature11148", note: "Cardinale et al. 2012, Biodiversity loss and its impact on humanity" },
      { doi: "10.1126/science.aax3100", note: "Diaz et al. 2019, Pervasive human-driven decline of life on Earth (IPBES global assessment)" },
      { doi: "10.1890/04-0922", note: "Hooper et al. 2005, Effects of biodiversity on ecosystem functioning: a consensus" },
      { doi: "10.1038/s41586-020-2705-y", note: "Leclere et al. 2020, Bending the curve of terrestrial biodiversity" },
      { doi: "10.1016/j.oneear.2023.01.013", note: "Obura 2023, The Kunming-Montreal Global Biodiversity Framework" },
      { doi: "10.1016/j.tree.2004.09.006", note: "Sodhi et al. 2004, Southeast Asian biodiversity: an impending disaster" },
      { doi: "10.1016/j.tree.2013.04.005", note: "Wilcove et al. 2013, Logging, agriculture and biodiversity in Southeast Asia" },
      { doi: "10.1007/s10531-009-9758-4", note: "Nijman 2010, International wildlife trade from Southeast Asia" },
      { doi: "10.1080/08941920591005151", note: "Zingerli 2005, Colliding understandings of biodiversity conservation in Vietnam" },
      { doi: "10.1017/s1355770x08004841", note: "Do & Bennett 2009, Wetland biodiversity values, Mekong River Delta (choice modelling)" },
    ],
    manual: [], items: ["R6E374JC"] },
  { id: "NBS", key: "QSVXMQBT", name: "Nature-based solutions", page: "Nature-based solutions",
    dois: [
      { doi: "10.1098/rstb.2019.0120", note: "Seddon et al. 2020, Understanding the value and limits of nature-based solutions" },
      { doi: "10.1016/j.scitotenv.2016.11.106", note: "Nesshover et al. 2017, The science, policy and practice of nature-based solutions" },
      { doi: "10.5751/es-08373-210239", note: "Kabisch et al. 2016, NbS in urban areas: indicators, gaps, barriers" },
      { doi: "10.1073/pnas.1710465114", note: "Griscom et al. 2017, Natural climate solutions" },
      { doi: "10.1016/j.envsci.2022.02.028", note: "Melanidis & Hagerman 2022, Competing narratives of nature-based solutions (critical)" },
      { doi: "10.1126/science.abn9668", note: "Seddon 2022, Harnessing the potential of nature-based solutions" },
      { doi: "10.2305/IUCN.CH.2020.08.en", note: "IUCN 2020, Global Standard for Nature-based Solutions" },
      { doi: "10.4060/cb3140en", note: "FAO 2021, Nature-based solutions in agriculture" },
      { doi: "10.1016/j.ecoleng.2020.106078", note: "Winterwerp et al. 2020, Permeable dams on mangrove-mud coasts (Mekong Delta)" },
      { doi: "10.3389/fmars.2021.756597", note: "Mai Van et al. 2021, Bamboo fences as a nature-based measure in Vietnam" },
      { doi: "10.1016/j.worlddev.2021.105650", note: "Hagedoorn et al. 2021, Preferences for ecosystem-based adaptation to flood risk, Central Vietnam" },
      { doi: "10.1080/17565529.2020.1724068", note: "Wolf et al. 2020, Policy-makers' perceptions of EbA in Central Vietnam" },
      { doi: "10.1007/s10457-018-0302-y", note: "Tran et al. 2018, Ecosystem services and smallholder adaptation: an EbA pilot in Vietnam" },
    ],
    manual: [
      { note: "Gonsalves et al. 2025, Agroforestry: platforms for NbS (copy into My Library; original in the FECB_Alliance group)",
        itemType: "report",
        fields: { title: "Agroforestry: Platforms for nature-based solutions and ecosystem adaptation. An educational primer", institution: "CGIAR", date: "2025",
                  url: "https://hdl.handle.net/10568/176654" },
        creators: [ { firstName: "Julian", lastName: "Gonsalves", creatorType: "author" } ],
        pdf: [] } ],
    items: [] },
  { id: "AF", key: "5JJE33T2", name: "Agroforestry", page: "Agroforestry",
    dois: [
      { doi: "10.1007/s10457-009-9229-7", note: "Jose 2009, Agroforestry for ecosystem services and environmental benefits: an overview" },
      { doi: "10.1016/j.agee.2016.06.002", note: "Torralba et al. 2016, European agroforestry, biodiversity and ecosystem services (meta-analysis)" },
      { doi: "10.1016/j.cosust.2013.10.014", note: "Mbow et al. 2014, Agroforestry solutions for food security and climate change in Africa" },
      { doi: "10.1038/srep29987", note: "Zomer et al. 2016, Global tree cover and biomass carbon on agricultural land" },
      { doi: "10.3390/su11102879", note: "Udawatta et al. 2019, Agroforestry and biodiversity" },
      { doi: "10.1016/j.oneear.2019.10.017", note: "Rosenstock et al. 2019, A planetary health perspective on agroforestry in SSA" },
      { doi: "10.1007/s10457-016-9906-2", note: "Simelton et al. 2017, Agroforestry adoption in Viet Nam: multi-level policy analysis" },
      { doi: "10.1007/s13593-020-00624-5", note: "Do et al. 2020, Decision analysis of agroforestry options, northwest Viet Nam" },
      { doi: "10.3390/f12040493", note: "Nguyen et al. 2021, Agroforestry adoption in northwest Viet Nam: social and cultural norms" },
      { doi: "10.1007/s10457-025-01199-4", note: "Do et al. 2025, Markets and incentives drive agroforestry adoption, Son La" },
    ],
    manual: [
      { note: "Gonsalves et al. 2025, Agroforestry: platforms for NbS (copy into My Library; original in the FECB_Alliance group)",
        itemType: "report",
        fields: { title: "Agroforestry: Platforms for nature-based solutions and ecosystem adaptation. An educational primer", institution: "CGIAR", date: "2025",
                  url: "https://hdl.handle.net/10568/176654" },
        creators: [ { firstName: "Julian", lastName: "Gonsalves", creatorType: "author" } ],
        pdf: [] } ],
    items: ["ALCBR2I2", "9U4PTF3V"] },
];

const PDF_URLS = {};
const DOI_PDF = {
  "10.3390/su3010238": ["https://www.mdpi.com/2071-1050/3/1/238/pdf"],
  "10.3390/su11102879": ["https://www.mdpi.com/2071-1050/11/10/2879/pdf"],
  "10.3390/f12040493": ["https://www.mdpi.com/1999-4907/12/4/493/pdf"],
  "10.3390/agriculture12020253": ["https://www.mdpi.com/2077-0472/12/2/253/pdf"],
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
