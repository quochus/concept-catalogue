// Concept catalogue → Zotero import (built by Claude, 25 Oct 2026 — anchors for 8 new concept pages)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   First run with DRY_RUN = true (nothing changes; it lists what it would do).
//   Then set DRY_RUN = false and run again. Takes ~5 minutes (one DOI lookup at a time).
// What it does (additive only; it never moves, edits or deletes existing items):
//   1. Creates missing sub-folders under Main collection > 3. Food systems.
//   2. Imports each DOI (skips DOIs already in your library) into its folder(s), with open-access PDFs when Zotero finds them.
//   3. Adds already-existing items (by item key) to the same folders.
//   4. Creates hand-entered report items for grey literature without DOIs.
//   Every item touched gets the tag below, so you can review or undo it in one click.

const DRY_RUN = false;   // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-25";     // set to "" for no tag
const SAVE_PDFS = true;
const DELAY_MS = 1500;                   // pause between DOI lookups

// Folder codes → existing collection keys, or [parentKey, "New sub-folder name"] to create.
const FOLDERS = {
  TRUST: "6HBHEU25",  // 3.3 > Responsibility, trust & transparency
  CERT:  "DNRY2DHN",  // 3.3 > Certifications
  VBSC:  "I9I8ZFX4",  // 3.5 > Alternative food networks
  WTP:   "CS3KXPS8",  // 4.4 > Choice experiments & willingness to pay
  INC:   ["CKB4KXH5", "Incentives"],                              // 3.3 > (new)
  PROC:  ["CKB4KXH5", "Public food procurement & school meals"],  // 3.3 > (new)
  NUDGE: ["FBHWMX7M", "Nudges & choice architecture"],            // 3.6 > Consumption > (new)
  IBG:   ["FBHWMX7M", "Intention–behaviour gap"],                 // 3.6 > Consumption > (new)
};
const EXTRA = {};  // codes that also imply other folders

const DATA = {
 "dois": [
  {
   "doi": "10.1080/14792772143000003",
   "tags": [
    "IBG"
   ],
   "note": "E26 Sheeran 2002"
  },
  {
   "doi": "10.1037/0033-2909.132.2.249",
   "tags": [
    "IBG"
   ],
   "note": "E26 Webb & Sheeran 2006"
  },
  {
   "doi": "10.1016/j.jclepro.2020.122556",
   "tags": [
    "IBG"
   ],
   "note": "E26 ElHaffar 2020"
  },
  {
   "doi": "10.1016/0749-5978(91)90020-t",
   "tags": [
    "IBG"
   ],
   "note": "E26 Ajzen 1991"
  },
  {
   "doi": "10.1007/s10551-014-2440-0",
   "tags": [
    "IBG"
   ],
   "note": "E26 Hassan 2016"
  },
  {
   "doi": "10.1007/s10551-010-0501-6",
   "tags": [
    "IBG"
   ],
   "note": "E26 Carrington 2010"
  },
  {
   "doi": "10.3390/agriculture6030039",
   "tags": [
    "VBSC"
   ],
   "note": "D10 Feenstra & Hardesty 2016"
  },
  {
   "doi": "10.1007/s10806-006-9000-2",
   "tags": [
    "TRUST"
   ],
   "note": "D08 Meijboom 2006"
  },
  {
   "doi": "10.1111/j.1539-6924.2008.01115.x",
   "tags": [
    "TRUST"
   ],
   "note": "D08 Chen 2008"
  },
  {
   "doi": "10.22434/ifamr2022.0032",
   "tags": [
    "TRUST"
   ],
   "note": "D08 de Vries 2023"
  },
  {
   "doi": "10.1016/j.tifs.2008.01.017",
   "tags": [
    "TRUST"
   ],
   "note": "D08 Siegrist 2008"
  },
  {
   "doi": "10.1111/conl.12314",
   "tags": [
    "CERT"
   ],
   "note": "D16 Tayleur 2017"
  },
  {
   "doi": "10.1016/j.ecolind.2021.107490",
   "tags": [
    "CERT"
   ],
   "note": "D16 Traldi 2021"
  },
  {
   "doi": "10.1146/annurev-environ-102017-025931",
   "tags": [
    "CERT"
   ],
   "note": "D16 Lambin & Thorlakson 2018"
  },
  {
   "doi": "10.1016/j.worlddev.2008.10.001",
   "tags": [
    "CERT"
   ],
   "note": "D16 Raynolds 2009"
  },
  {
   "doi": "10.1257/jep.25.4.191",
   "tags": [
    "INC"
   ],
   "note": "I24 Gneezy 2011"
  },
  {
   "doi": "10.1016/j.ecolecon.2014.08.016",
   "tags": [
    "INC"
   ],
   "note": "I24 Wunder 2015"
  },
  {
   "doi": "10.1016/j.ecolecon.2008.03.011",
   "tags": [
    "INC"
   ],
   "note": "I24 Engel 2008"
  },
  {
   "doi": "10.1016/j.ecolecon.2021.107002",
   "tags": [
    "INC"
   ],
   "note": "I24 Drechsler 2021"
  },
  {
   "doi": "10.1007/s10640-004-3332-z",
   "tags": [
    "WTP"
   ],
   "note": "E11 Murphy 2005"
  },
  {
   "doi": "10.1023/a:1012791822804",
   "tags": [
    "WTP"
   ],
   "note": "E11 List & Gallet 2001"
  },
  {
   "doi": "10.1186/1471-2458-13-1218",
   "tags": [
    "NUDGE"
   ],
   "note": "E25 Hollands 2013"
  },
  {
   "doi": "10.1073/pnas.2107346118",
   "tags": [
    "NUDGE"
   ],
   "note": "E25 Mertens 2022"
  },
  {
   "doi": "10.1073/pnas.2200300119",
   "tags": [
    "NUDGE"
   ],
   "note": "E25 Maier 2022"
  },
  {
   "doi": "10.1017/s0029665119000971",
   "tags": [
    "NUDGE"
   ],
   "note": "E25 Vandenbroele 2020"
  },
  {
   "doi": "10.1186/s12889-016-3272-x",
   "tags": [
    "NUDGE"
   ],
   "note": "E25 Arno & Thomas 2016"
  },
  {
   "doi": "10.1080/00343400802195154",
   "tags": [
    "PROC"
   ],
   "note": "I27 Morgan 2008"
  },
  {
   "doi": "10.1068/a40112",
   "tags": [
    "PROC"
   ],
   "note": "I27 Sonnino 2009"
  },
  {
   "doi": "10.1111/joac.12131",
   "tags": [
    "PROC"
   ],
   "note": "I27 Wittman & Blesh 2017"
  },
  {
   "doi": "10.1017/s1368980012005101",
   "tags": [
    "PROC"
   ],
   "note": "I27 Sidaner 2013"
  }
 ],
 "existing": [],
 "manual": [
  {
   "type": "book",
   "tags": [
    "NUDGE"
   ],
   "title": "Nudge: Improving decisions about health, wealth, and happiness",
   "creators": [
    [
     "Richard H.",
     "Thaler"
    ],
    [
     "Cass R.",
     "Sunstein"
    ]
   ],
   "date": "2008",
   "institution": "",
   "publisher": "Yale University Press",
   "place": "New Haven, CT",
   "ISBN": "9780300122237",
   "reportNumber": "",
   "extra": "Seminal; add PDF/ebook by hand if you have it."
  }
 ]
};

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-import] " + s); };
const colIDs = {};

async function folderID(code) {
  if (colIDs[code]) return colIDs[code];
  const spec = FOLDERS[code];
  if (!spec) throw new Error("Unknown folder code " + code);
  let col;
  if (typeof spec === "string") {
    col = Zotero.Collections.getByLibraryAndKey(lib, spec);
    if (!col) throw new Error(`Collection key ${spec} (${code}) not found`);
  } else {
    const parent = Zotero.Collections.getByLibraryAndKey(lib, spec[0]);
    if (!parent) throw new Error(`Parent key ${spec[0]} not found`);
    col = parent.getChildCollections().find(c => c.name === spec[1]);
    if (!col) {
      if (DRY_RUN) { say(`WOULD CREATE folder "${spec[1]}" under "${parent.name}"`); colIDs[code] = -1; return -1; }
      col = new Zotero.Collection({ libraryID: lib, name: spec[1], parentID: parent.id });
      await col.saveTx();
      say(`Created folder "${spec[1]}" under "${parent.name}"`);
    }
  }
  colIDs[code] = col.id;
  return col.id;
}
function expand(codes) {
  const s = new Set(codes);
  codes.forEach(c => (EXTRA[c] || []).forEach(x => s.add(x)));
  return [...s];
}
async function folderIDs(codes) { const out = []; for (const c of expand(codes)) out.push(await folderID(c)); return out; }
async function findByDOI(doi) {
  const s = new Zotero.Search();
  s.libraryID = lib;
  s.addCondition("DOI", "contains", doi);
  const ids = await s.search();
  return Zotero.Items.get(ids).filter(i => !i.deleted && (i.getField("DOI") || "").toLowerCase().trim() === doi.toLowerCase());
}
async function fileItem(item, ids) {
  let changed = false;
  for (const id of ids) if (id > 0 && !item.inCollection(id)) { item.addToCollection(id); changed = true; }
  if (TAG && !item.hasTag(TAG)) { item.addTag(TAG); changed = true; }
  if (changed) await item.saveTx();
  return changed;
}

let nImp = 0, nSkip = 0, nFail = 0, nFiled = 0, nMan = 0;

// 1-2. DOIs
for (const d of DATA.dois) {
  const ids = await folderIDs(d.tags);
  const have = await findByDOI(d.doi);
  if (have.length) {
    nSkip++;
    if (DRY_RUN) { say(`ALREADY IN LIBRARY ${d.doi} (${d.note}) → would file into ${d.tags}`); continue; }
    await fileItem(have[0], ids);
    say(`Already in library, filed: ${d.doi} (${d.note})`);
    continue;
  }
  if (DRY_RUN) { say(`WOULD IMPORT ${d.doi} (${d.note}) → ${d.tags}`); continue; }
  try {
    const tr = new Zotero.Translate.Search();
    tr.setIdentifier({ DOI: d.doi });
    const translators = await tr.getTranslators();
    if (!translators.length) throw new Error("no translator");
    tr.setTranslator(translators);
    const items = await tr.translate({ libraryID: lib, collections: ids.filter(i => i > 0), saveAttachments: SAVE_PDFS });
    for (const it of items) if (TAG) { it.addTag(TAG); await it.saveTx(); }
    nImp++;
    say(`Imported ${d.doi} (${d.note}): ${items.map(i => i.getField("title")).join("; ").slice(0, 90)}`);
  } catch (e) {
    nFail++;
    say(`FAILED ${d.doi} (${d.note}): ${e}`);
  }
  await Zotero.Promise.delay(DELAY_MS);
}

// 3. Existing items by key
for (const x of DATA.existing) {
  const item = Zotero.Items.getByLibraryAndKey(lib, x.key);
  if (!item) { say(`MISSING item key ${x.key}`); continue; }
  const ids = await folderIDs(x.tags);
  if (DRY_RUN) { say(`WOULD FILE existing ${x.key} "${item.getField("title").slice(0, 70)}" → ${x.tags}`); continue; }
  if (await fileItem(item, ids)) nFiled++;
}

// 4. Grey literature
for (const m of DATA.manual) {
  const s = new Zotero.Search();
  s.libraryID = lib;
  s.addCondition("title", "is", m.title);
  const dup = (await s.search()).length;
  if (dup) { say(`Report already exists, skipped: ${m.title.slice(0, 70)}`); continue; }
  if (DRY_RUN) { say(`WOULD CREATE report "${m.title.slice(0, 70)}" → ${m.tags}`); continue; }
  const it = new Zotero.Item(m.type);
  it.libraryID = lib;
  it.setField("title", m.title);
  if (m.date) it.setField("date", m.date);
  if (m.institution) it.setField("institution", m.institution);
  if (m.publisher) it.setField("publisher", m.publisher);
  if (m.ISBN) it.setField("ISBN", m.ISBN);
  if (m.reportNumber) it.setField("reportNumber", m.reportNumber);
  if (m.place) it.setField("place", m.place);
  if (m.url) it.setField("url", m.url);
  if (m.extra) it.setField("extra", m.extra);
  it.setCreators(m.creators.map(([f, l]) => f ? { firstName: f, lastName: l, creatorType: "author" } : { name: l, creatorType: "author", fieldMode: 1 }));
  for (const id of await folderIDs(m.tags)) if (id > 0) it.addToCollection(id);
  if (TAG) it.addTag(TAG);
  await it.saveTx();
  nMan++;
  say(`Created report: ${m.title.slice(0, 70)}`);
}

say(`\n${DRY_RUN ? "DRY RUN — nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, existing items filed ${nFiled}, reports created ${nMan}.`);
if (nFail) say("Failed DOIs: add them by hand with the magic wand (Add Item by Identifier).");
return log.join("\n");
