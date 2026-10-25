// Concept catalogue → Zotero: fix one all-caps title (built by Claude, 25 Oct 2026)
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript.
//   Tick "Run as async function", paste this whole file, press Run.
//   This file is LIVE: it changes one title when you press Run. Nothing else is touched.
// Item: Kilelu, Klerkx & Leeuwis (2017), Experimental Agriculture, DOI 10.1017/S0014479716000375

const KEY = "8A8D355Q";
const NEW_TITLE = "Supporting smallholder commercialisation by enhancing integrated coordination in agrifood value chains: Experiences with dairy hubs in Kenya";

const lib = Zotero.Libraries.userLibraryID;
const item = Zotero.Items.getByLibraryAndKey(lib, KEY);
if (!item) return `Item ${KEY} not found.`;
const old = item.getField("title");
if (old === NEW_TITLE) return "Title already fixed; nothing changed.";
if (old.toUpperCase() !== old) return `Title is no longer all caps, so it was left as is:\n${old}`;
item.setField("title", NEW_TITLE);
await item.saveTx();
return `Fixed title of ${KEY}.\nOld: ${old}\nNew: ${NEW_TITLE}`;
