// Concept catalogue → Zotero PDFs and copies (built by Claude, 13 Nov 2026), for "Food loss and waste" (C07)
// and "Food loss and waste in Viet Nam" (C32).
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript. Tick "Run as async function", paste, press Run.
// This file is LIVE (DRY_RUN = false): it changes your library when you press Run.
// What it does (additive only: nothing is moved, deleted or merged):
//   1. Copies two items that sit only in the FECB_Alliance group library into your own library and files
//      them in "3.5 Markets, value chains & retail › Food loss and waste": UNEP Food Waste Index Report 2024
//      and Fabi et al. 2021 (Improving data on food losses and waste). The group originals are untouched.
//   2. Tries to attach a PDF to every food loss and waste item still without one: first the direct links
//      below (FAO, UNEP, Springer, mirrors), then the open-access link Unpaywall reports for the DOI,
//      then Zotero's Find Available PDF. Any download that is not a PDF is erased.
//   3. Ends with a summary listing which items still have no PDF (closed access: add these by hand).
//   Every item touched gets the tag below.

const DRY_RUN = false;
const TAG = "_cc-import 2026-11-13b";
const UNPAYWALL_EMAIL = "concept.catalogue@example.org";
const lib = Zotero.Libraries.userLibraryID;
const FLW_FOLDER = "SHZ5DNQR";          // Food loss and waste
const log = []; const say = s => { log.push(s); Zotero.debug("[cc-pdfs] " + s); };

// user-library items without PDF (parent keys), with direct links to try first
const ITEMS = {
  "P75AYE97": { note: "Gustavsson et al. 2011, Global food losses and food waste (FAO)",
                urls: ["https://www.fao.org/4/mb060e/mb060e.pdf", "https://fao.org/4/mb060e/mb060e.pdf", "https://www.fao.org/3/mb060e/mb060e.pdf"] },
  "LWRRA4Y3": { note: "FAO 2019, State of Food and Agriculture 2019",
                urls: ["https://www.fao.org/4/ca6030en/ca6030en.pdf", "https://www.fao.org/3/ca6030en/ca6030en.pdf", "https://cdn.agroklub.com/upload/documents/ca6030en.pdf"] },
  "JGNDBNPW": { note: "HLPE 2014, Food losses and waste in the context of sustainable food systems",
                urls: ["https://www.fao.org/4/i3901e/i3901e.pdf", "https://www.fao.org/3/i3901e/i3901e.pdf", "http://www.fao.org/3/a-i3901e.pdf"] },
  "JXQDWFAN": { note: "Tran et al. 2026, urban household food waste reduction intentions (Discover Sustainability)",
                urls: ["https://link.springer.com/content/pdf/10.1007/s43621-026-04333-z.pdf"] },
  "EZ87KVTL": { note: "Nguyen & Nguyen 2025, extended TPB and household food waste (Cleaner Waste Systems)", urls: [] },
  "GU2T5V38": { note: "Gligor et al. 2018, obstacles to cold chain implementation in Viet Nam (Emerald; likely closed)", urls: [] },
  "W9YBLWCZ": { note: "Pottinger-Glass et al. 2025, FLW in Southeast Asia (SEI)", urls: [] },
  "7VNBDYE7": { note: "Chaboud & Daviron 2017", urls: [] },
  "ZUE9JEIB": { note: "Sheahan & Barrett 2017", urls: [] },
  "W789ZCL9": { note: "Bellemare et al. 2017", urls: [] },
  "29ADZRPC": { note: "Quested et al. 2013", urls: [] },
  "Z99IN9S7": { note: "Porter et al. 2016", urls: [] },
  "JGNXK2PB": { note: "Hodges et al. 2011", urls: [] },
  "W4NEKGIQ": { note: "Phan 2018, rice postharvest technologies (Acta Hort)", urls: [] },
};
// group-library items to copy into your library (group "FECB_Alliance", libraryID found by name)
const COPY = [
  { key: "WPRARBB9", note: "UNEP 2024, Food Waste Index Report 2024",
    urls: ["https://wedocs.unep.org/bitstream/handle/20.500.11822/45230/food_waste_index_report_2024.pdf",
           "https://digitallibrary.un.org/record/4042857/files/1401794_EN.pdf"] },
  { key: "LPSLSHBW", note: "Fabi et al. 2021, Improving data on food losses and waste", urls: [] },
];

function hasPDF(item) {
  return item.getAttachments().map(id => Zotero.Items.get(id)).some(a => a && !a.deleted && a.attachmentContentType === "application/pdf");
}
async function fromURL(item, url) {
  try {
    const att = await Zotero.Attachments.importFromURL({ libraryID: item.libraryID, url, parentItemID: item.id, contentType: "application/pdf" });
    if (att && att.attachmentContentType === "application/pdf") return true;
    if (att) await att.eraseTx();
  } catch (e) { say(`    no PDF at ${url}`); }
  return false;
}
async function unpaywall(doi) {
  if (!doi) return [];
  try {
    const r = await Zotero.HTTP.request("GET", `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${UNPAYWALL_EMAIL}`, { responseType: "json", timeout: 30000 });
    const j = r.response || {};
    return (j.oa_locations || []).map(l => l.url_for_pdf).filter(Boolean);
  } catch (e) { return []; }
}
async function getPDF(item, urls, note) {
  if (hasPDF(item)) { say(`  already has PDF: ${note}`); return "had"; }
  if (DRY_RUN) { say(`  WOULD TRY PDF for ${note}`); return "dry"; }
  for (const u of urls) if (await fromURL(item, u)) { say(`  PDF attached (direct link): ${note}`); return "added"; }
  const doi = (item.getField("DOI") || "").trim();
  for (const u of await unpaywall(doi)) if (await fromURL(item, u)) { say(`  PDF attached (Unpaywall): ${note}`); return "added"; }
  try {
    const att = await Zotero.Attachments.addAvailableFile(item);
    if (att && att.attachmentContentType === "application/pdf") { say(`  PDF attached (Find Available PDF): ${note}`); return "added"; }
    if (att) await att.eraseTx();
  } catch (e) {}
  say(`  STILL NO PDF: ${note}`); return "none";
}
async function tag(item) { if (!item.hasTag(TAG)) { item.addTag(TAG); await item.saveTx(); } }

const col = Zotero.Collections.getByLibraryAndKey(lib, FLW_FOLDER);
if (!col) return `Folder ${FLW_FOLDER} not found: stop and tell Claude.`;
const groupLib = Zotero.Groups.getAll().find(g => g.name === "FECB_Alliance");
let nCopy = 0, nPDF = 0; const still = [];

say("1. Copy group items into your library");
for (const c of COPY) {
  const src = groupLib ? Zotero.Items.getByLibraryAndKey(groupLib.libraryID, c.key) : null;
  if (!src) { say(`  NOT FOUND in group: ${c.key} (${c.note})`); continue; }
  const s = new Zotero.Search(); s.libraryID = lib; s.addCondition("title", "is", src.getField("title"));
  let copy = Zotero.Items.get(await s.search()).find(i => !i.deleted && i.isTopLevelItem());
  if (copy) say(`  already in your library (${copy.key}): ${c.note}`);
  else if (DRY_RUN) { say(`  WOULD COPY ${c.note}`); continue; }
  else {
    copy = src.clone(lib, { skipTags: false });
    copy.setCollections([col.id]);
    copy.addTag(TAG);
    await copy.saveTx();
    nCopy++; say(`  copied as ${copy.key}: ${c.note}`);
  }
  if (!copy.inCollection(col.id)) { copy.addToCollection(col.id); await copy.saveTx(); }
  await tag(copy);
  const r = await getPDF(copy, c.urls, c.note);
  if (r === "added") nPDF++; if (r === "none") still.push(`${copy.key} ${c.note}`);
}

say("\n2. PDFs for items already in your library");
for (const [key, v] of Object.entries(ITEMS)) {
  const item = Zotero.Items.getByLibraryAndKey(lib, key);
  if (!item || !item.isTopLevelItem()) { say(`  MISSING ${key} (${v.note})`); continue; }
  if (!DRY_RUN) await tag(item);
  const r = await getPDF(item, v.urls, v.note);
  if (r === "added") nPDF++; if (r === "none") still.push(`${key} ${v.note}`);
  await Zotero.Promise.delay(800);
}

say(`\n${DRY_RUN ? "DRY RUN: nothing changed. " : ""}Copied ${nCopy} item(s) from the group library, PDFs added ${nPDF}.`);
if (still.length) say(`Still without PDF (${still.length}), add by hand if you have access:\n  - ` + still.join("\n  - "));
return log.join("\n");
