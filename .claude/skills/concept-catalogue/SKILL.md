---
name: concept-catalogue
description: Use when Quoc asks to add, draft, discuss, review or update an entry in his Obsidian concept catalogue (concepts, frameworks, methods in food systems, NRM, supply chains).
---

# Concept catalogue

Quoc keeps a personal catalogue of concepts, frameworks, methods and approaches as an Obsidian vault (D:\Vaults\concept-catalogue, synced to the private GitHub repo quochus/concept-catalogue). It is both a reference for his writing and a learning tool. Entries are built one at a time, usually one per day, ideally chosen from what his current work needs.

## Where things are

- Vault: D:\Vaults\concept-catalogue (or the GitHub repo when the laptop is not linked).
- Zotero: C:\Users\QMNguyen\Zotero (zotero.sqlite + storage/ PDFs). Zotero locks the database while open, so copy zotero.sqlite (and -wal) before reading it. Citation keys come from Better BibTeX.
- CIAT work is a separate vault (D:\Vaults\ciat-work). Never write catalogue content there, and never copy CIAT project material into the catalogue. Link across vaults with obsidian://open?vault=<vault>&file=<path> URIs, since [[ ]] links do not cross vaults.

## Vault structure

    Home.md                                              start page
    1. Daily/YYYY-MM-DD.md                               daily notes: raw notes, ideas
    2. New literature/                                   daily literature check (New literature.md index)
        Papers/                                          papers to read / reading
        Archive/YYYY-MM/                                 papers read or not relevant
    3. Concepts/<Concept name>/<Concept name>.md         main entry
    3. Concepts/<Concept name>/Discussions/YYYY-MM-DD <topic>.md   saved discussions (sub-pages)
    4. Discuss/                                          discussions in progress (Discuss.md index)
    5. Sources/<citekey>.md                              one note per source used as evidence
    6. Updates/YYYY-MM-DD.md                             weekly update suggestions
    Templates/                                           Concept, Source, Discussion, Daily note
    Attachments/                                         images and files
    Claude setup/                                        skill copies, setup notes

The numbered folders are the workflow order. `2. New literature/` is filled and kept in step by a scheduled sync with the Reading Desk page (https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU); do not reorganise it by hand beyond what Quoc asks. A paper there becomes a `5. Sources/` note only when Quoc asks to use it for an entry.

## Step 1: Ask for Quoc's first take (always, before drafting)

Before researching or drafting a new entry, ask Quoc in one short message:

> Before I draft it: how do you understand **<concept>** right now? Two or three sentences is enough: what it is, and where you've used it.

Wait for the answer. If he says to skip it, proceed and leave "My first take" empty. Never write his first take for him.

## Step 2: Gather sources

Priority order:
1. Seminal / originating works (the paper that coined or formalized the concept).
2. Highly cited works and major reviews or syntheses (citation counts via OpenAlex or Semantic Scholar; Google Scholar has no API).
3. Authoritative institutional framings (HLPE, FAO, IFPRI, CGIAR) where they shape policy use.
4. At least one distinct perspective: a critical, Global South, or alternative framing.
5. Recent work (last ~3 years) that extends or contests the concept.

Search Quoc's Zotero library first, then Consensus, OpenAlex, Semantic Scholar and the web. Note any source not in Zotero so he can add it. Aim for 5-12 sources.

## Step 3: Draft the entry

Use Templates/Concept.md. Sections: My first take (his words, verbatim, dated, never edited later); Definitions; Features; Implications; Own works; Comparison with my first take; In my words (left blank for Quoc); Sources (each with why it is included).

## Evidence rules

- Every substantive claim cites a source note: ([[citekey]], p. 12).
- In the source note record, per claim: a short exact quote (under 15 words), the precise locator (page, section, figure or table), and a Zotero link: zotero://open-pdf/library/items/<ITEMKEY>?page=<N> (or zotero://select/library/items/<ITEMKEY> without a PDF).
- Figures: reference and describe them with figure number and page; do not copy them into the vault.
- Never invent quotes, page numbers or citation counts. If a locator can't be verified, say so in the note.

## Discussions

When Quoc chats about a concept, offer to save it as a dated note in Concepts/<Concept>/Discussions/ (Templates/Discussion.md): question explored, main points, where Quoc landed (attributed to him), open questions, new sources. Link it from the main entry. Keep his conclusions apart from Claude's suggestions. Offer a critical view, compare framings, or test the concept against his contexts (Son La, Laos, Cambodia) when useful.

## Daily notes and filing

When asked to "file my notes": read `1. Daily/` and `4. Discuss/`, move concept material into the right concept's `Discussions/` page or a new concept stub in `3. Concepts/`, and log one line per item under "Filed" in that day's daily note. Never edit or delete Quoc's raw text. CIAT project material goes to the ciat-work vault's `1. Notes/` instead. Ask when unsure where something belongs.

## Updates

A weekly scheduled task writes suggestions to Updates/YYYY-MM-DD.md, grouped by concept: source, what it adds, suggested change. Never rewrite Definitions, Features, Implications or My first take automatically. Change an entry only when Quoc asks after reviewing, then update last_reviewed.

## Finishing

Obsidian Git commits and syncs every 10 minutes. Tell Quoc in one or two lines what was added, and prompt him to write the "In my words" line.
