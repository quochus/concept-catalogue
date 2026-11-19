// Concept catalogue → Zotero: open-access PDFs and one title fix (built by Claude, 20 Nov 2026)
// for items added by batches "_cc-import 2026-11-19" and "_cc-import 2026-11-19b".
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript. Tick "Run as async function", paste, press Run.
//   This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only; nothing is deleted except non-PDF downloads this script itself makes):
//   1. For 15 items with no PDF, tries open-access PDF links found on OpenAlex (repository copies first
//      where the publisher blocks downloads), then Zotero's Find Available PDF.
//   2. Fixes the ALL-CAPS title of 7MBJLTJK (Hooper et al. 2005) to sentence case. Nothing else is changed.
//   Every item touched gets the tag below.

const DRY_RUN = false;
const TAG = "_cc-import 2026-11-20";
const lib = Zotero.Libraries.userLibraryID;
const log = []; const say = s => { log.push(s); Zotero.debug("[cc-pdf] " + s); };

const PDF = {
  "65MFNHX4": ["https://researchonline.jcu.edu.au/30012/1/30012_Wilcove_etal_2013.pdf"],
  "7MBJLTJK": ["https://onlinelibrary.wiley.com/doi/pdfdirect/10.1890/04-0922"],
  "ACAH5VPW": ["https://pub.epsilon.slu.se/10240/7/wardle_d_etal_130415.pdf"],
  "CBVUU5S9": ["https://academic.oup.com/nutritionreviews/article-pdf/75/10/769/24349892/nux040.pdf"],
  "HEEYAASG": ["https://advances.sciencemag.org/content/advances/6/45/eaba1715.full.pdf"],
  "JXIRFNFX": ["http://www.cell.com/article/S2590332219301319/pdf", "https://eprints.gla.ac.uk/258201/1/258201.pdf"],
  "PEZQNLXZ": ["https://ora.ox.ac.uk/objects/uuid:8ad89af4-f16b-4320-8649-84f5c9d89caa/files/r70795837q"],
  "VFBY7Q57": ["https://ora.ox.ac.uk/objects/uuid:4f15c07d-6bc9-4742-a808-d9ca960505c8/files/md108035a76986dbd6ca8d8b291fda82d"],
  "VRQEX35U": ["https://www.pnas.org/content/pnas/114/44/11645.full.pdf", "https://aura.abdn.ac.uk/bitstream/2164/9453/3/PNAS_2017_Griscom_11645_50.pdf"],
  "Y27BNMCJ": ["https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/gcb.15513", "https://ora.ox.ac.uk/objects/uuid:4fbf1362-fd71-441e-9c1c-205e812d7f3d/files/r4f16c304s"],
  "E5ZSUJ2P": ["https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/gcb.15310"],
  "CRW6AEF9": ["https://www.pnas.org/doi/pdf/10.1073/pnas.0800607105"],
  "WN9ZVYD4": ["https://www.pnas.org/doi/pdf/10.1073/pnas.1313490111"],
  "DLYHPXN2": ["https://portals.iucn.org/library/sites/library/files/documents/2020-020-En.pdf"],
  "EYCPGA6S": ["https://www.fao.org/3/cb3140en/cb3140en.pdf"]
};
const TITLES = { "7MBJLTJK": "Effects of biodiversity on ecosystem functioning: A consensus of current knowledge" };

const hasPDF = it => it.getAttachments().map(id => Zotero.Items.get(id)).some(a => a && !a.deleted && a.attachmentContentType === "application/pdf");
let nPDF = 0; const still = [];
for (const [key, list] of Object.entries(PDF)) {
  const it = Zotero.Items.getByLibraryAndKey(lib, key);
  if (!it || !it.isTopLevelItem()) { say(`SKIPPED ${key}: not found`); continue; }
  if (hasPDF(it)) continue;
  if (DRY_RUN) { say(`WOULD TRY PDF for ${key}`); continue; }
  let ok = false;
  for (const url of list) {
    try {
      const att = await Zotero.Attachments.importFromURL({ libraryID: lib, url, parentItemID: it.id, contentType: "application/pdf" });
      if (att && att.attachmentContentType === "application/pdf") { ok = true; break; }
      if (att) await att.eraseTx();
    } catch (e) { say(`  ${key}: could not fetch ${url}`); }
  }
  if (!ok) {
    try { const att = await Zotero.Attachments.addAvailableFile(it);
      if (att && att.attachmentContentType === "application/pdf") ok = true; else if (att) await att.eraseTx(); } catch (e) {}
  }
  if (ok) { nPDF++; it.addTag(TAG); await it.saveTx(); say(`PDF added: ${key} "${it.getField("title").slice(0, 60)}"`); }
  else still.push(`${key} "${it.getField("title").slice(0, 50)}"`);
}
for (const [key, t] of Object.entries(TITLES)) {
  const it = Zotero.Items.getByLibraryAndKey(lib, key);
  if (!it) { say(`TITLE SKIPPED ${key}`); continue; }
  if (DRY_RUN) { say(`WOULD SET TITLE ${key}: ${t}`); continue; }
  it.setField("title", t); it.addTag(TAG); await it.saveTx(); say(`Title fixed: ${key}`);
}
say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}PDFs added ${nPDF} of ${Object.keys(PDF).length} tried.`);
if (still.length) say("Still without PDF: " + still.join("; "));
return log.join("\n");
