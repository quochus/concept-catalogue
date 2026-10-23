// Concept catalogue → find and attach PDFs, plus small fixes (built by Claude, 23 Oct 2026)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   THIS IS A LIVE RUN: it adds PDF attachments and makes the fixes listed below.
//   Takes ~5–10 minutes. The result box ends with a list of items still without a PDF.
// What it does (additive only; never deletes or edits your existing attachments):
//   A. Small fixes from the first import:
//      - tags Westermann et al. 2018 (imported but untagged),
//      - files German et al. 2020 into "Inclusive value chains & business models",
//      - sets Downing et al. market systems resilience report to 2019 + PDF URL,
//      - retries the 2 DOIs that failed (creates them by hand if the DOI lookup fails again).
//   B. For each item below that has no PDF yet:
//      1) Zotero's own "Find Available PDF" (Unpaywall, publisher page, your library proxy/IP access),
//      2) then the open-access links Claude found in OpenAlex (direct PDFs and landing pages).
//      Anything that is not a real PDF is not kept.

const TAG = "_cc-import 2026-10-23";
const DELAY_MS = 1500;
const FOLDERS = {
  IVC: ["WMC8FS8W", "Inclusive value chains & business models"],
  MSD: ["WMC8FS8W", "Market systems & market systems development (M4P)"],
};

const DATA = {
 "items": [
  {
   "key": "69SLQCNV",
   "label": "Sands 2023",
   "urls": [
    "https://scholarworks.uvm.edu/context/calsfac/article/1204/viewcontent/Moving_towards_an_anti_colonial_definition_for_regenerative_agriculture_with_figs.pdf"
   ],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "R6GQLHDI",
   "label": "Tan 2023",
   "urls": [],
   "pages": [
    "https://doi.org/10.1016/j.agee.2023.108450"
   ],
   "oa": "hybrid"
  },
  {
   "key": "CTQZMB8X",
   "label": "Gosnell 2019",
   "urls": [],
   "pages": [
    "https://doi.org/10.1016/j.gloenvcha.2019.101965"
   ],
   "oa": "bronze"
  },
  {
   "key": "J3ZXLW5N",
   "label": "Lal 2020",
   "urls": [
    "https://www.jswconline.org/content/jswc/75/5/123A.full.pdf"
   ],
   "pages": [],
   "oa": "bronze"
  },
  {
   "key": "85RVARXN",
   "label": "Kassam 2009",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "QU2B2PXD",
   "label": "Giller 2009",
   "urls": [],
   "pages": [
    "https://research.wur.nl/en/publications/conservation-agriculture-and-smallholder-farming-in-africa-the-he"
   ],
   "oa": "green"
  },
  {
   "key": "VBPB4ULQ",
   "label": "Pittelkow 2015",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "S4R4I29V",
   "label": "Corbeels 2020",
   "urls": [
    "http://oar.icrisat.org/11564/1/Corbeels_etal_CA_SSA_NatureFood_2020.pdf"
   ],
   "pages": [
    "https://resolver.sub.uni-goettingen.de/purl?gro-2/130787"
   ],
   "oa": "green"
  },
  {
   "key": "3EVNA5R3",
   "label": "Brouder 2014",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "YUIIP3AC",
   "label": "Knowler 2007",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "V5GXV5TQ",
   "label": "Hobbs 2008",
   "urls": [],
   "pages": [
    "https://www.ncbi.nlm.nih.gov/pmc/articles/2610169"
   ],
   "oa": "green"
  },
  {
   "key": "MRTT7KL7",
   "label": "Kassam 2019",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "B64YQBZA",
   "label": "Husson 2016",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "38TLZI4L",
   "label": "Lestrelin 2012",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "4FBQ3BG3",
   "label": "Sumner 2017",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "PSRGCPN8",
   "label": "Uvin 1995",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "CI82HJLC",
   "label": "Sartas 2020",
   "urls": [
    "https://www.sciencedirect.com/science/article/pii/S0308521X19314477/pdf"
   ],
   "pages": [],
   "oa": "hybrid"
  },
  {
   "key": "NJKWQ837",
   "label": "Coe 2014",
   "urls": [],
   "pages": [
    "https://doi.org/10.1016/j.cosust.2013.10.013"
   ],
   "oa": "hybrid"
  },
  {
   "key": "XBQZR9I8",
   "label": "Lichtfouse 2012",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "EUG2JVL6",
   "label": "Millar 2010",
   "urls": [],
   "pages": [
    "https://researchoutput.csu.edu.au/en/publications/79456101-a5cb-4c47-bc08-fe163b55825f"
   ],
   "oa": "green"
  },
  {
   "key": "7HQGR4GT",
   "label": "Connor 2021",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "N4PI4WRE",
   "label": "Low 2020",
   "urls": [
    "https://www.sciencedirect.com/science/article/pii/S0308521X19301519/pdf"
   ],
   "pages": [],
   "oa": "hybrid"
  },
  {
   "key": "89PMZ2WK",
   "label": "Glover 2019",
   "urls": [
    "https://journals.sagepub.com/doi/pdf/10.1177/0030727019864978"
   ],
   "pages": [],
   "oa": "hybrid"
  },
  {
   "key": "F8LLR24L",
   "label": "Feder 1982",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "3P4QLRXX",
   "label": "Klerkx 2009",
   "urls": [],
   "pages": [
    "https://research.wur.nl/en/publications/establishment-and-embedding-of-innovation-brokers-at-different-in"
   ],
   "oa": "green"
  },
  {
   "key": "99NDXHDX",
   "label": "Intarakumnerd 2013",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "QFNPK3CG",
   "label": "Szogs 2011",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "DXULTBP3",
   "label": "Darnhofer 2012",
   "urls": [],
   "pages": [
    "https://research.wur.nl/en/publications/evolution-of-systems-approaches-to-agricultural-innovation-concep"
   ],
   "oa": "green"
  },
  {
   "key": "AG3V4HTS",
   "label": "Poncet 2010",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "N8RJ8RRV",
   "label": "Ton 2018",
   "urls": [],
   "pages": [
    "https://research.wur.nl/en/publications/contract-farming-for-improving-smallholder-incomes-what-can-we-le"
   ],
   "oa": "green"
  },
  {
   "key": "A6X2QJHH",
   "label": "Fischer 2012",
   "urls": [
    "https://www.econstor.eu/bitstream/10419/90498/1/CRC-PEG_DP_48.pdf",
    "http://www2.vwl.wiso.uni-goettingen.de/courant-papers/CRC-PEG_DP_48.pdf"
   ],
   "pages": [],
   "oa": "green"
  },
  {
   "key": "H6AZJJ2F",
   "label": "Barrett 2012",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "RLKWMFVV",
   "label": "Bellemare 2012",
   "urls": [
    "https://mpra.ub.uni-muenchen.de/23638/1/MPRA_paper_23638.pdf",
    "https://mpra.ub.uni-muenchen.de/27259/1/MPRA_paper_27259.pdf"
   ],
   "pages": [
    "https://doi.org/10.2139/ssrn.1595977"
   ],
   "oa": "green"
  },
  {
   "key": "GVTZ7ZS9",
   "label": "Ma 2024",
   "urls": [],
   "pages": [
    "https://doi.org/10.1016/j.eap.2024.05.005"
   ],
   "oa": "hybrid"
  },
  {
   "key": "PRUQPP9N",
   "label": "Touch 2024",
   "urls": [],
   "pages": [
    "https://doi.org/10.1016/j.jenvman.2024.122536"
   ],
   "oa": "hybrid"
  },
  {
   "key": "6MNV7ICD",
   "label": "Markelova 2010",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "AZ9N9PSE",
   "label": "Harald Bekkers 2008",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "P65A4CEK",
   "label": "Linda Jones 2009",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "ZN9CSI9N",
   "label": "Prudence Beignet 2019",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "7YWB7RJ3",
   "label": "David Elliot 2008",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "SX8JXAKR",
   "label": "Kuhl 2018",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "6IRUMET5",
   "label": "Humphrey 2010",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "9TLPPFVM",
   "label": "Blowfield 2014",
   "urls": [],
   "pages": [
    "https://soas-repository.worktribe.com/output/368822"
   ],
   "oa": "green"
  },
  {
   "key": "BTMEPXFJ",
   "label": "Devaux 2018",
   "urls": [
    "https://www.emerald.com:443/insight/content/doi/10.1108/JADEE-06-2017-0065/full/pdf?title=agricultural-innovation-and-inclusive-value-chain-development-a-review"
   ],
   "pages": [],
   "oa": "hybrid"
  },
  {
   "key": "74AC98AC",
   "label": "Mishra 2023",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "X5ULBBFR",
   "label": "Westermann 2018",
   "urls": [],
   "pages": [],
   "oa": "closed"
  },
  {
   "key": "AYIFYHAG",
   "label": "Ruffer & Wach 2013",
   "urls": [
    "https://www.itad.com/wp-content/uploads/2013/05/M4P-Evaluation-Review_ITAD_Final-Copy.pdf"
   ],
   "pages": [
    "https://www.itad.com/reports/review-of-m4p-evaluation-methods-and-approaches/"
   ],
   "oa": "report"
  },
  {
   "key": "N742DC4V",
   "label": "Hilton 2024 BEAM",
   "urls": [
    "https://alcp.ge/assets/pdf/2025-01/1737710601_1993_beam_evidence_review_2024_final.pdf"
   ],
   "pages": [],
   "oa": "report"
  },
  {
   "key": "LT66YJRC",
   "label": "Downing et al. 2019",
   "urls": [
    "https://2017-2020.usaid.gov/sites/default/files/documents/1866/Market-Systems-Resilience-Measurement-Framework-Report-Final_public-August-2019.pdf"
   ],
   "pages": [],
   "oa": "report"
  },
  {
   "key": "6HXQP8GM",
   "label": "Springfield Centre 2015",
   "urls": [
    "https://www.alcp.ge/assets/pdf/old/23d48d6a10a0aca4fe5466fbc81431eb.pdf"
   ],
   "pages": [
    "https://www.susana.org/en/knowledge-hub/resources-and-publications/library/details/2241"
   ],
   "oa": "report"
  },
  {
   "key": "7BAYY8R5",
   "label": "Hartmann & Linn 2008",
   "urls": [
    "https://www.brookings.edu/wp-content/uploads/2016/06/10_scaling_up_linn.pdf"
   ],
   "pages": [
    "https://www.brookings.edu/articles/scaling-up-a-framework-and-lessons-for-development-effectiveness-from-literature-and-practice/"
   ],
   "oa": "report"
  },
  {
   "key": "L47966Y5",
   "label": "Fukugawa et al. 2018 ERIA",
   "urls": [
    "https://www.eria.org/uploads/media/ERIA_DP_2018_06.pdf"
   ],
   "pages": [],
   "oa": "report"
  }
 ],
 "fileExisting": [
  {
   "key": "JPNHITRP",
   "folder": "IVC",
   "label": "German et al. 2020"
  }
 ],
 "tagOnly": [
  "X5ULBBFR"
 ],
 "setFields": [
  {
   "key": "LT66YJRC",
   "fields": {
    "date": "2019",
    "extra": "USAID, August 2019 (public version).",
    "url": "https://2017-2020.usaid.gov/sites/default/files/documents/1866/Market-Systems-Resilience-Measurement-Framework-Report-Final_public-August-2019.pdf"
   }
  }
 ],
 "retry": [
  {
   "doi": "10.1016/j.landusepol.2023.106676",
   "folder": "IVC",
   "label": "Schoneveld & Weng 2023",
   "manual": {
    "title": "Smallholder value creation in agrifood chains: Value network approach",
    "publicationTitle": "Land Use Policy",
    "volume": "131",
    "pages": "106676",
    "date": "2023-08",
    "creators": [
     [
      "George C.",
      "Schoneveld"
     ],
     [
      "Xiaoxue",
      "Weng"
     ]
    ]
   }
  },
  {
   "doi": "10.3362/0957-1329.2006.041",
   "folder": "MSD",
   "label": "Meyer-Stamer 2006",
   "manual": {
    "title": "Making market systems work? For the poor?",
    "publicationTitle": "Enterprise Development & Microfinance",
    "volume": "17",
    "issue": "4",
    "pages": "21-32",
    "date": "2006-12",
    "creators": [
     [
      "Jörg",
      "Meyer-Stamer"
     ]
    ]
   }
  }
 ]
};

// ---------------------------------------------------------------------------
const lib = Zotero.Libraries.userLibraryID;
const log = [];
const say = (s) => { log.push(s); Zotero.debug("[cc-pdf] " + s); };
const A = Zotero.Attachments;
const findAvailable = A.addAvailableFile || A.addAvailablePDF;   // Zotero 7 / Zotero 6

function folderID(code) {
  const [pkey, name] = FOLDERS[code];
  const parent = Zotero.Collections.getByLibraryAndKey(lib, pkey);
  const col = parent && parent.getChildCollections().find(c => c.name === name);
  if (!col) throw new Error(`Folder "${name}" not found`);
  return col.id;
}
async function hasPDF(item) {
  for (const id of item.getAttachments()) {
    const a = Zotero.Items.get(id);
    if (a && !a.deleted && a.attachmentContentType === "application/pdf" && await a.fileExists()) return true;
  }
  return false;
}
async function keepIfPDF(att) {
  if (!att) return false;
  if (att.attachmentContentType === "application/pdf" && await att.fileExists()) return true;
  await att.eraseTx();             // downloaded something that is not a PDF: remove it
  return false;
}
async function tryURLs(item, urls, pages) {
  // Preferred: Zotero's own resolver chain (checks the content is a PDF).
  if (A.addFileFromURLs) {
    const resolvers = [...urls.map(u => ({ url: u })), ...pages.map(p => ({ pageURL: p }))];
    if (!resolvers.length) return null;
    try { const att = await A.addFileFromURLs(item, resolvers); if (await keepIfPDF(att)) return "OA link"; } catch (e) { say(`   (OA link error: ${e})`); }
    return null;
  }
  // Fallback for older Zotero: direct PDF links only.
  for (const u of urls) {
    try {
      const att = await A.importFromURL({ libraryID: lib, url: u, parentItemID: item.id, title: "Full Text PDF", contentType: "application/pdf" });
      if (await keepIfPDF(att)) return "OA link";
    } catch (e) { say(`   (download error ${u}: ${e})`); }
  }
  return null;
}

// A. Fixes ------------------------------------------------------------------
for (const k of DATA.tagOnly) {
  const it = Zotero.Items.getByLibraryAndKey(lib, k);
  if (it && !it.hasTag(TAG)) { it.addTag(TAG); await it.saveTx(); say(`Tagged ${k}`); }
}
for (const x of DATA.fileExisting) {
  const it = Zotero.Items.getByLibraryAndKey(lib, x.key);
  if (!it) { say(`MISSING ${x.key} (${x.label})`); continue; }
  const id = folderID(x.folder);
  if (!it.inCollection(id)) it.addToCollection(id);
  if (!it.hasTag(TAG)) it.addTag(TAG);
  await it.saveTx();
  say(`Filed ${x.label} into ${FOLDERS[x.folder][1]}`);
}
for (const x of DATA.setFields) {
  const it = Zotero.Items.getByLibraryAndKey(lib, x.key);
  if (!it) continue;
  for (const [f, v] of Object.entries(x.fields)) it.setField(f, v);
  await it.saveTx();
  say(`Updated fields of ${x.key}`);
}
for (const r of DATA.retry) {
  const s = new Zotero.Search(); s.libraryID = lib; s.addCondition("DOI", "contains", r.doi);
  if ((await s.search()).length) { say(`Already in library: ${r.label}`); continue; }
  const colID = folderID(r.folder);
  let item = null;
  try {
    const tr = new Zotero.Translate.Search();
    tr.setIdentifier({ DOI: r.doi });
    const ts = await tr.getTranslators();
    if (ts.length) { tr.setTranslator(ts); item = (await tr.translate({ libraryID: lib, collections: [colID], saveAttachments: true }))[0]; }
  } catch (e) { say(`   DOI lookup failed again for ${r.label}: ${e}`); }
  if (!item) {
    item = new Zotero.Item("journalArticle");
    item.libraryID = lib;
    const m = r.manual;
    for (const f of ["title", "publicationTitle", "volume", "issue", "pages", "date"]) if (m[f]) item.setField(f, m[f]);
    item.setField("DOI", r.doi);
    item.setCreators(m.creators.map(([f, l]) => ({ firstName: f, lastName: l, creatorType: "author" })));
    item.addToCollection(colID);
    say(`Created ${r.label} by hand`);
  } else say(`Imported ${r.label}`);
  item.addTag(TAG); await item.saveTx();
  DATA.items.push({ key: item.key, label: r.label, urls: [], pages: [], oa: "retry" });
}

// B. PDFs -------------------------------------------------------------------
const got = [], missing = [];
for (const x of DATA.items) {
  const item = Zotero.Items.getByLibraryAndKey(lib, x.key);
  if (!item) { say(`MISSING item ${x.key} (${x.label})`); continue; }
  if (await hasPDF(item)) { say(`Has PDF already: ${x.label}`); continue; }
  let how = null;
  if (findAvailable && (item.getField("DOI") || item.getField("url"))) {
    try { const att = await findAvailable.call(A, item); if (await keepIfPDF(att)) how = "Find Available PDF"; }
    catch (e) { say(`   (Find Available error for ${x.label}: ${e})`); }
  }
  if (!how) how = await tryURLs(item, x.urls || [], x.pages || []);
  if (how) { got.push(x.label); say(`PDF added (${how}): ${x.label}`); }
  else {
    const doi = item.getField("DOI");
    missing.push(`${x.label} [${x.oa}] ${doi ? "https://doi.org/" + doi : (item.getField("url") || "")}`);
  }
  await Zotero.Promise.delay(DELAY_MS);
}

say(`\nPDFs added: ${got.length}. Still without PDF: ${missing.length}.`);
if (missing.length) say("Still without PDF (download via CIAT/WUR access, then drag onto the item):\n- " + missing.join("\n- "));
return log.join("\n");
