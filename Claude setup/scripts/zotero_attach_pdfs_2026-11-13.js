// Concept catalogue → attach downloaded PDFs (built by Claude, 13 Nov 2026).
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript. Tick "Run as async function", paste, press Run.
// This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does: attaches three PDFs saved in the vault folder "Claude setup\pdfs" to their Zotero items
// (Zotero stores its own copy; the vault files stay where they are). Skips an item that already has a PDF.
// Nothing else is changed. Each item gets the tag "_cc-import 2026-11-13b".
const DRY_RUN = false;
const TAG = "_cc-import 2026-11-13b";
const DIR = "D:\\Vaults\\concept-catalogue\\Claude setup\\pdfs\\";
const FILES = [
  { key: "4D843HHN", file: "UNEP_2024_Food_Waste_Index_Report.pdf", note: "UNEP 2024, Food Waste Index Report 2024" },
  { key: "LWRRA4Y3", file: "FAO_2019_SOFA_food_loss_and_waste.pdf", note: "FAO 2019, State of Food and Agriculture 2019" },
  { key: "JXQDWFAN", file: "Tran_et_al_2026_household_food_waste_Vietnam.pdf", note: "Tran et al. 2026, Discover Sustainability (article in press)" },
];
const lib = Zotero.Libraries.userLibraryID;
const out = [];
const hasPDF = it => it.getAttachments().map(id => Zotero.Items.get(id)).some(a => a && !a.deleted && a.attachmentContentType === "application/pdf");
for (const f of FILES) {
  const item = Zotero.Items.getByLibraryAndKey(lib, f.key);
  if (!item || !item.isTopLevelItem()) { out.push(`MISSING item ${f.key}: ${f.note}`); continue; }
  if (hasPDF(item)) { out.push(`already has a PDF, skipped: ${f.note}`); continue; }
  const path = DIR + f.file;
  if (!(await IOUtils.exists(path))) { out.push(`FILE NOT FOUND: ${path}`); continue; }
  if (DRY_RUN) { out.push(`WOULD ATTACH ${f.file} to ${f.note}`); continue; }
  try {
    const att = await Zotero.Attachments.importFromFile({ file: path, parentItemID: item.id, libraryID: lib });
    if (!item.hasTag(TAG)) { item.addTag(TAG); await item.saveTx(); }
    out.push(`attached (${att.key}): ${f.note}`);
  } catch (e) { out.push(`FAILED ${f.note}: ${e}`); }
}
return (DRY_RUN ? "DRY RUN: nothing changed.\n" : "") + out.join("\n");
