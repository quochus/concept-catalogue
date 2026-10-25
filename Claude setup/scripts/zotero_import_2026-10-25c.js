// Concept catalogue → Zotero import (built by Claude, 25 Oct 2026, third batch: Market linkages, Innovation bundling, Values-based supply chains, Conservation agriculture, plus PDFs for the credence and values anchors)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is set to LIVE (DRY_RUN = false): it changes your library when you press Run.
//   Takes ~3 minutes (one DOI lookup at a time).
// What it does (additive only; it never moves, edits or deletes existing items):
//   1. Creates missing sub-folders under Main collection > 3. Food systems.
//   2. Imports each DOI (skips DOIs already in your library) into its folder(s), with open-access PDFs when Zotero finds them.
//   3. Adds already-existing items (by item key) to the same folders.
//   4. Creates hand-entered items for works without DOIs.
//   5. Tries 'Find Available PDF' for every item it touched that still has no PDF.
//   6. Checks that every item it touched is in at least one folder, and warns if not.
//   Every item touched gets the tag below, so you can review or undo it in one click.

const DRY_RUN = false;   // LIVE run (set to true to only list what it would do)
const TAG = "_cc-import 2026-10-25c";     // set to "" for no tag
const SAVE_PDFS = true;
const DELAY_MS = 1500;                   // pause between DOI lookups

// Folder codes → existing collection keys, or [parentKey, "New sub-folder name"] to create.
const FOLDERS = {
  ML:   ["WMC8FS8W", "Market linkages & smallholder market access"],   // 3.5 > (exists)
  BUN:  ["7UVMCVZ9", "Innovation bundles"],                            // 3.2 > Innovations > (exists)
  VBSC: ["I9I8ZFX4", "Values-based supply chains"],                    // 3.5 > Alternative food networks > (new)
  RC:   "K6GER9RP",   // 3.4 > Sustainable agriculture > Regenerative & conservation agriculture
  CRED: ["FBHWMX7M", "Credence attributes & information asymmetry"],   // 3.6 > Consumption > (exists)
  VAL:  ["C4B78LMF", "Values (intrinsic, instrumental, relational)"],  // 3.1 > (exists)
};
const EXTRA = {};  // codes that also imply other folders

const DATA = {
 "dois": [
  {
   "doi": "10.5304/jafscd.2011.014.014",
   "tags": [
    "VBSC"
   ],
   "note": "Lev & Stevenson 2011"
  },
  {
   "doi": "10.5304/jafscd.2011.014.013",
   "tags": [
    "VBSC"
   ],
   "note": "Diamond & Barham 2011"
  },
  {
   "doi": "10.5304/jafscd.2011.014.007",
   "tags": [
    "VBSC"
   ],
   "note": "Stevenson et al. 2011"
  },
  {
   "doi": "10.3390/agriculture6030036",
   "tags": [
    "VBSC"
   ],
   "note": "Fleury et al. 2016"
  },
  {
   "doi": "10.1177/0891242413507103",
   "tags": [
    "VBSC"
   ],
   "note": "Hardesty et al. 2014"
  },
  {
   "doi": "10.1007/s10460-006-9040-2",
   "tags": [
    "VBSC"
   ],
   "note": "Friedmann 2007"
  },
  {
   "doi": "10.1016/j.techfore.2012.08.007",
   "tags": [
    "BUN"
   ],
   "note": "Kassie et al. 2013"
  },
  {
   "doi": "10.1111/1477-9552.12011",
   "tags": [
    "BUN"
   ],
   "note": "Teklewold et al. 2013"
  },
  {
   "doi": "10.1038/s41598-019-54086-1",
   "tags": [
    "BUN"
   ],
   "note": "Jat et al. 2019"
  },
  {
   "doi": "10.1186/s40066-021-00321-w",
   "tags": [
    "BUN"
   ],
   "note": "Ogada et al. 2021"
  },
  {
   "doi": "10.1016/j.worlddev.2018.08.018",
   "tags": [
    "ML"
   ],
   "note": "Bellemare & Bloem 2018"
  },
  {
   "doi": "10.1016/j.foodpol.2008.08.001",
   "tags": [
    "ML"
   ],
   "note": "Bernard & Spielman 2009"
  },
  {
   "doi": "10.1017/s0014479716000375",
   "tags": [
    "ML"
   ],
   "note": "Kilelu et al. 2017"
  },
  {
   "doi": "10.1016/s0309-1740(03)00130-x",
   "tags": [
    "CRED"
   ],
   "note": "Grunert et al. 2004"
  }
 ],
 "existing": [
  {
   "key": "MCIE4JHS",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "FJUGWI9P",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "BAYFSYV6",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "SVU4SXCU",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "NHYG7IYC",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "EACCGUMG",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "A4D6GUVU",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "GVTZ7ZS9",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "X2CN4LXW",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "G9IAR36M",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "4GZKP5PQ",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "6MNV7ICD",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "7DTQXW6R",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "HZDFZ9KJ",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "A6X2QJHH",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "N8RJ8RRV",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "PB25WR2Q",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "99RE8WKY",
   "tags": [
    "ML"
   ]
  },
  {
   "key": "5X66JKX8",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "SYGK42DW",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "YH3KTZNU",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "UQ2R6XZ2",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "3EWI37TP",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "ISQ6XWTZ",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "WQ3VXVIP",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "CI82HJLC",
   "tags": [
    "BUN"
   ]
  },
  {
   "key": "QRA69VDI",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "XTP9LG7Q",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "95MHW8QA",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "7P4P6KTG",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "PK9SPM38",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "8M4M4FDM",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "WFM8XD7Q",
   "tags": [
    "VBSC"
   ]
  },
  {
   "key": "85RVARXN",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "QU2B2PXD",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "VBPB4ULQ",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "S4R4I29V",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "3EVNA5R3",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "YUIIP3AC",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "V5GXV5TQ",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "MRTT7KL7",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "W4QU2UD9",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "IYEJXJT7",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "D67PT333",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "45T4PNBF",
   "tags": [
    "RC"
   ]
  },
  {
   "key": "QB9RKDWS",
   "tags": [
    "RC"
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
   "key": "TWS8TZUD",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "8GPNL9C4",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "L2K6BNX5",
   "tags": [
    "CRED"
   ]
  },
  {
   "key": "V4FWHC4J",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "69WN2IPZ",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "A37W2UTC",
   "tags": [
    "VAL"
   ]
  },
  {
   "key": "FT9EGAPB",
   "tags": [
    "VAL"
   ]
  }
 ],
 "manual": [],
 "pdfurls": {
  "10.1257/002205106776162717": [
   "https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID870788_code202660.pdf?abstractid=870788&mirid=1"
  ],
  "10.1073/pnas.1525002113": [
   "https://www.pnas.org/content/pnas/113/6/1462.full.pdf"
  ],
  "10.1002/pan3.10531": [
   "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/pan3.10531"
  ],
  "10.5304/jafscd.2011.014.014": [
   "https://foodsystemsjournal.org/index.php/fsj/article/download/61/59"
  ],
  "10.5304/jafscd.2011.014.013": [
   "https://foodsystemsjournal.org/index.php/fsj/article/download/60/pdf"
  ],
  "10.5304/jafscd.2011.014.007": [
   "https://foodsystemsjournal.org/index.php/fsj/article/download/55/54"
  ],
  "10.3390/agriculture6030036": [
   "https://www.mdpi.com/2077-0472/6/3/36/pdf?version=1470736129"
  ],
  "10.1038/s41598-019-54086-1": [
   "https://www.nature.com/articles/s41598-019-54086-1.pdf"
  ],
  "10.1186/s40066-021-00321-w": [
   "https://agricultureandfoodsecurity.biomedcentral.com/track/pdf/10.1186/s40066-021-00321-w"
  ],
  "10.1098/rstb.2007.2169": [
   "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2610169/pdf/"
  ]
 },
 "pdfpages": {
  "10.1016/j.tree.2008.11.011": [
   "http://hdl.handle.net/10161/15185"
  ],
  "10.1016/j.fcr.2009.06.017": [
   "https://research.wur.nl/en/publications/conservation-agriculture-and-smallholder-farming-in-africa-the-he"
  ],
  "10.1016/0148-2963(90)90019-a": [
   "https://research.wur.nl/en/publications/a-conceptual-model-of-the-quality-perception-process"
  ],
  "10.1093/eurrag/jbi011": [
   "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=914792"
  ],
  "10.1038/s43016-020-0114-x": [
   "https://resolver.sub.uni-goettingen.de/purl?gro-2/130787"
  ]
 }
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
    const doi = (item.getField("DOI") || "").toLowerCase();
    const urls = (DATA.pdfurls[doi] || []), pgs = (DATA.pdfpages[doi] || []);
    if (A.addFileFromURLs && (urls.length || pgs.length)) {
      try {
        const att = await A.addFileFromURLs(item, [...urls.map(u => ({ url: u })), ...pgs.map(p => ({ pageURL: p }))]);
        if (att && att.attachmentContentType === "application/pdf" && await att.fileExists()) { nPDF++; say(`PDF found (OA link): ${item.getField("title").slice(0, 70)}`); continue; }
        if (att) await att.eraseTx();
      } catch (e) { say(`   (OA link error for ${doi}: ${e})`); }
    }
    try {
      const att = await findAvailable.call(A, item);
      if (att && att.attachmentContentType === "application/pdf" && await att.fileExists()) { nPDF++; say(`PDF found: ${item.getField("title").slice(0, 70)}`); }
      else { if (att) await att.eraseTx(); noPDF.push(item.getField("title").slice(0, 70)); }
    } catch (e) { noPDF.push(item.getField("title").slice(0, 70)); }
    await Zotero.Promise.delay(800);
  }
}

// 6. Check: every touched item must sit in at least one folder
const unfiled = touched.filter(i => i.isTopLevelItem() && !i.deleted && i.getCollections().length === 0);
if (!DRY_RUN && unfiled.length) say(`WARNING, not in any folder (${unfiled.length}):\n  ` + unfiled.map(i => i.getField("title").slice(0, 70)).join("\n  "));
else if (!DRY_RUN) say("Check passed: every item touched is in at least one folder.");

say(`\n${DRY_RUN ? "DRY RUN — nothing changed. " : ""}Imported ${nImp}, already in library ${nSkip}, failed ${nFail}, existing items filed ${nFiled}, items created ${nMan}, PDFs added ${nPDF}.`);
if (noPDF.length) say(`Still without PDF (${noPDF.length}):\n  ` + noPDF.join("\n  "));
if (nFail) say("Failed DOIs: add them by hand with the magic wand (Add Item by Identifier).");
return log.join("\n");
