// Concept catalogue → Zotero import (built by Claude, 25 Oct 2026, second batch: Credence attributes, Intrinsic & Instrumental value, Food hubs)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   First run with DRY_RUN = true (nothing changes; it lists what it would do).
//   Then set DRY_RUN = false and run again. Takes ~2 minutes (one DOI lookup at a time).
// What it does (additive only; it never moves, edits or deletes existing items):
//   1. Creates missing sub-folders under Main collection > 3. Food systems.
//   2. Imports each DOI (skips DOIs already in your library) into its folder(s), with open-access PDFs when Zotero finds them.
//   3. Adds already-existing items (by item key) to the same folders.
//   4. Creates hand-entered items for works without DOIs.
//   5. Tries 'Find Available PDF' for every item it touched that still has no PDF.
//   Every item touched gets the tag below, so you can review or undo it in one click.

const DRY_RUN = false;   // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-25b";     // set to "" for no tag
const SAVE_PDFS = true;
const DELAY_MS = 1500;                   // pause between DOI lookups

// Folder codes → existing collection keys, or [parentKey, "New sub-folder name"] to create.
const FOLDERS = {
  CRED: ["FBHWMX7M", "Credence attributes & information asymmetry"],          // 3.6 > Consumption > (new)
  VAL:  ["C4B78LMF", "Values (intrinsic, instrumental, relational)"],          // 3.1 Concepts & frameworks > (new)
  CERT: "DNRY2DHN",  // 3.3 > Certifications
  TRUST:"6HBHEU25",  // 3.3 > Responsibility, trust & transparency
  HUB:  ["I9I8ZFX4", "Food hubs"],                                             // 3.5 > Alternative food networks > (new)
  PROC: "TVHNMUYE",  // 3.3 > Public food procurement & school meals
};
const EXTRA = {};  // codes that also imply other folders

const DATA = {
 "dois": [
  {
   "doi": "10.2307/1243501",
   "tags": [
    "CRED"
   ],
   "note": "Caswell & Mojduszka 1996"
  },
  {
   "doi": "10.1111/j.1467-8276.2007.01024.x",
   "tags": [
    "CRED",
    "CERT"
   ],
   "note": "Roe & Sheldon 2007"
  },
  {
   "doi": "10.1257/002205106776162717",
   "tags": [
    "CRED"
   ],
   "note": "Dulleck & Kerschbamer 2006"
  },
  {
   "doi": "10.1016/j.foodqual.2013.10.005",
   "tags": [
    "CRED"
   ],
   "note": "Fernqvist & Ekelund 2014"
  },
  {
   "doi": "10.1017/s1068280500001386",
   "tags": [
    "CRED",
    "CERT"
   ],
   "note": "McCluskey 2000"
  },
  {
   "doi": "10.1016/j.foodqual.2011.12.004",
   "tags": [
    "CRED",
    "CERT"
   ],
   "note": "Janssen & Hamm 2012"
  },
  {
   "doi": "10.1016/j.foodpol.2014.12.003",
   "tags": [
    "CRED",
    "TRUST"
   ],
   "note": "Lassoued & Hobbs 2015"
  },
  {
   "doi": "10.1016/j.foodqual.2016.07.011",
   "tags": [
    "CRED"
   ],
   "note": "Lee & Yun 2016"
  },
  {
   "doi": "10.3390/foods12030538",
   "tags": [
    "CRED"
   ],
   "note": "Schrobback 2023"
  },
  {
   "doi": "10.3390/su14074338",
   "tags": [
    "CRED"
   ],
   "note": "Kovacs 2022"
  },
  {
   "doi": "10.1080/1523908x.2013.879038",
   "tags": [
    "CRED",
    "CERT"
   ],
   "note": "Daugbjerg 2014"
  },
  {
   "doi": "10.3390/foods10102490",
   "tags": [
    "TRUST",
    "CRED"
   ],
   "note": "Wu 2021"
  },
  {
   "doi": "10.1016/0148-2963(90)90019-a",
   "tags": [
    "CRED"
   ],
   "note": "Steenkamp 1990"
  },
  {
   "doi": "10.1016/s0950-3293(02)00085-x",
   "tags": [
    "CRED"
   ],
   "note": "Bernues 2003"
  },
  {
   "doi": "10.1073/pnas.1525002113",
   "tags": [
    "VAL"
   ],
   "note": "Chan 2016"
  },
  {
   "doi": "10.1016/j.cosust.2016.12.006",
   "tags": [
    "VAL"
   ],
   "note": "Pascual 2017"
  },
  {
   "doi": "10.1038/s41586-023-06406-9",
   "tags": [
    "VAL"
   ],
   "note": "Pascual 2023"
  },
  {
   "doi": "10.1016/j.tree.2008.11.011",
   "tags": [
    "VAL"
   ],
   "note": "Justus 2009"
  },
  {
   "doi": "10.1038/443027a",
   "tags": [
    "VAL"
   ],
   "note": "McCauley 2006"
  },
  {
   "doi": "10.1016/j.biocon.2017.03.003",
   "tags": [
    "VAL"
   ],
   "note": "Batavia & Nelson 2017"
  },
  {
   "doi": "10.1111/cobi.12464",
   "tags": [
    "VAL"
   ],
   "note": "Vucetich 2015"
  },
  {
   "doi": "10.1016/j.ecolecon.2015.01.006",
   "tags": [
    "VAL"
   ],
   "note": "Kenter 2015"
  },
  {
   "doi": "10.1016/j.cosust.2018.09.005",
   "tags": [
    "VAL"
   ],
   "note": "Himes & Muraca 2018"
  },
  {
   "doi": "10.1371/journal.pone.0183962",
   "tags": [
    "VAL"
   ],
   "note": "Klain 2017"
  },
  {
   "doi": "10.1016/j.jnc.2017.02.007",
   "tags": [
    "VAL"
   ],
   "note": "Piccolo 2017"
  },
  {
   "doi": "10.1007/s11625-019-00715-7",
   "tags": [
    "VAL"
   ],
   "note": "O'Connor & Kenter 2019"
  },
  {
   "doi": "10.1002/pan3.10531",
   "tags": [
    "VAL"
   ],
   "note": "Geissberger 2023"
  },
  {
   "doi": "10.1111/j.1467-8276.2008.01175.x",
   "tags": [
    "VAL",
    "CRED"
   ],
   "note": "Lusk & Briggeman 2009"
  },
  {
   "doi": "10.5304/jafscd.2013.034.004",
   "tags": [
    "HUB"
   ],
   "note": "Matson & Thayer 2013"
  },
  {
   "doi": "10.1016/j.jrurstud.2014.03.008",
   "tags": [
    "HUB"
   ],
   "note": "Cleveland 2014"
  },
  {
   "doi": "10.21955/gatesopenres.1114993.1",
   "tags": [
    "PROC"
   ],
   "note": "Commandeur 2019 structured demand"
  }
 ],
 "existing": [
  {
   "key": "7JY6GWAU",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "BQAJ77FC",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "LU89EZMD",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "KXUE6WSA",
   "tags": [
    "CRED",
    "CERT"
   ]
  },
  {
   "key": "L2K6BNX5",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "7K5CPTGP",
   "tags": [
    "CRED",
    "CERT"
   ]
  },
  {
   "key": "4JSU68RR",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "GYRFDQUV",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "976JZW9Z",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "KSJFJR8Z",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "RLNG2CI9",
   "tags": [
    "HUB"
   ]
  },
  {
   "key": "3NCI5SFN",
   "tags": [
    "PROC"
   ]
  }
 ],
 "manual": [
  {
   "type": "journalArticle",
   "title": "Consumer preferences for fruit and vegetables with credence-based attributes: A review",
   "date": "2011",
   "publicationTitle": "International Food and Agribusiness Management Review",
   "volume": "14",
   "issue": "2",
   "pages": "121-142",
   "url": "https://doi.org/10.22004/ag.econ.103990",
   "extra": "DOI: 10.22004/ag.econ.103990",
   "creators": [
    [
     "Riccarda",
     "Moser"
    ],
    [
     "Roberta",
     "Raffaelli"
    ],
    [
     "Dawn",
     "Thilmany-McFadden"
    ]
   ],
   "tags": [
    "CRED"
   ]
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

const touched = [];
let nImp = 0, nSkip = 0, nFail = 0, nFiled = 0, nMan = 0;

// 1-2. DOIs
for (const d of DATA.dois) {
  const ids = await folderIDs(d.tags);
  const have = await findByDOI(d.doi);
  if (have.length) {
    nSkip++;
    if (DRY_RUN) { say(`ALREADY IN LIBRARY ${d.doi} (${d.note}) → would file into ${d.tags}`); continue; }
    await fileItem(have[0], ids); touched.push(have[0]);
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
    for (const it of items) { if (TAG) { it.addTag(TAG); await it.saveTx(); } touched.push(it); }
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
  if (!item.isTopLevelItem()) { say(`SKIPPED ${x.key}: it is an attachment or note, not a top-level item`); continue; }
  const ids = await folderIDs(x.tags);
  if (DRY_RUN) { say(`WOULD FILE existing ${x.key} "${item.getField("title").slice(0, 70)}" → ${x.tags}`); continue; }
  if (await fileItem(item, ids)) nFiled++;
  touched.push(item);
}

// 4. Grey literature
for (const m of DATA.manual) {
  const s = new Zotero.Search();
  s.libraryID = lib;
  s.addCondition("title", "is", m.title);
  const dup = (await s.search()).length;
  if (dup) { say(`Report already exists, skipped: ${m.title.slice(0, 70)}`); continue; }
  if (DRY_RUN) { say(`WOULD CREATE item "${m.title.slice(0, 70)}" → ${m.tags}`); continue; }
  const it = new Zotero.Item(m.type);
  it.libraryID = lib;
  it.setField("title", m.title);
  if (m.date) it.setField("date", m.date);
  if (m.institution) it.setField("institution", m.institution);
  if (m.reportNumber) it.setField("reportNumber", m.reportNumber);
  if (m.place) it.setField("place", m.place);
  if (m.url) it.setField("url", m.url);
  if (m.extra) it.setField("extra", m.extra);
  for (const f of ["publicationTitle", "volume", "issue", "pages"]) if (m[f]) it.setField(f, m[f]);
  it.setCreators(m.creators.map(([f, l]) => f ? { firstName: f, lastName: l, creatorType: "author" } : { name: l, creatorType: "author", fieldMode: 1 }));
  for (const id of await folderIDs(m.tags)) if (id > 0) it.addToCollection(id);
  if (TAG) it.addTag(TAG);
  await it.saveTx();
  nMan++;
  touched.push(it); say(`Created item: ${m.title.slice(0, 70)}`);
}

// 5. PDFs for anything touched that still has none
const A = Zotero.Attachments;
const findAvailable = A.addAvailableFile || A.addAvailablePDF;
async function hasPDF(item) {
  for (const id of item.getAttachments()) {
    const a = Zotero.Items.get(id);
    if (a && !a.deleted && a.attachmentContentType === "application/pdf" && await a.fileExists()) return true;
  }
  return false;
}
let nPDF = 0; const noPDF = [];
if (!DRY_RUN && SAVE_PDFS && findAvailable) {
  for (const item of touched) {
    if (!item.isRegularItem() || await hasPDF(item)) continue;
    try {
      const att = await findAvailable.call(A, item);
      if (att && att.attachmentContentType === "application/pdf" && await att.fileExists()) { nPDF++; say(`PDF found: ${item.getField("title").slice(0, 70)}`); }
      else { if (att) await att.eraseTx(); noPDF.push(item.getField("title").slice(0, 70)); }
    } catch (e) { noPDF.push(item.getField("title").slice(0, 70)); }
    await Zotero.Promise.delay(800);
  }
}

say(`\n${DRY_RUN ? "DRY RUN — nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, existing items filed ${nFiled}, items created ${nMan}, PDFs added ${nPDF}.`);
if (noPDF.length) say(`Still without PDF (${noPDF.length}):\n  ` + noPDF.join("\n  "));
if (nFail) say("Failed DOIs: add them by hand with the magic wand (Add Item by Identifier).");
return log.join("\n");
