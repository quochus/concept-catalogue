// Concept catalogue → Zotero metadata fix (built by Claude, 13 Nov 2026).
// HOW TO RUN: Zotero > Tools > Developer > Run JavaScript. Tick "Run as async function", paste, press Run.
// This file is LIVE (DRY_RUN = false): it changes one item in your library when you press Run.
// What it does: fixes the shallot paper (key THIA8H7M, DOI 10.61602/jdi.2025.81.09) imported on 13 Nov.
//   - removes the two bogus creators "Tra Vinh University, Vietnam" and keeps the five real authors in order;
//   - sets issue 81 and the sentence-case title.
// Nothing else is changed. The item keeps its tag "_cc-import 2026-11-13".
const DRY_RUN = false;
const lib = Zotero.Libraries.userLibraryID;
const item = Zotero.Items.getByLibraryAndKey(lib, "THIA8H7M");
if (!item) return "Item THIA8H7M not found: tell Claude.";
if ((item.getField("DOI") || "").toLowerCase() !== "10.61602/jdi.2025.81.09") return "DOI does not match: nothing changed.";
const before = item.getCreators().map(c => c.lastName + (c.firstName ? ", " + c.firstName : "")).join("; ");
const authors = [
  { firstName: "Dung My", lastName: "Ho", creatorType: "author" },
  { firstName: "Thanh Tung", lastName: "Diep", creatorType: "author" },
  { firstName: "Thi My Lan", lastName: "Lam", creatorType: "author" },
  { firstName: "Thi Cam Xuyen", lastName: "Pham", creatorType: "author" },
  { firstName: "Thien Thuan", lastName: "Nguyen", creatorType: "author" },
];
const title = "Causes and solutions for agricultural product loss: A study of the shallot supply chain in Tra Vinh province";
if (DRY_RUN) return `WOULD CHANGE creators from [${before}] to the five authors, set issue 81 and title.`;
item.setCreators(authors);
item.setField("issue", "81");
item.setField("title", title);
await item.saveTx();
return `Fixed THIA8H7M.\nCreators before: ${before}\nCreators now: ${authors.map(a => a.lastName + ", " + a.firstName).join("; ")}\nIssue: 81\nTitle: ${title}`;
