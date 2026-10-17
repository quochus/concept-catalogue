---
name: "concept-catalogue"
description: "Use when Quoc asks to add, draft, discuss, review or update an entry in his Obsidian concept catalogue (concepts, frameworks, methods in food systems, NRM, supply chains)."
---

# Concept catalogue

Quoc keeps a personal catalogue of concepts, frameworks, methods and approaches as an Obsidian vault at `D:\Vaults\concept-catalogue` on his laptop, synced by the Obsidian Git plugin to the private GitHub repo `quochus/concept-catalogue`. It is both a reference for his writing and a learning tool. Entries are built one at a time, usually one per day, ideally chosen from what his current work needs.

## Where things are

- **Vault**: `D:\Vaults\concept-catalogue` when the laptop is linked (preferred: write files there; Obsidian Git commits and pushes every 10 minutes). Otherwise the GitHub repo `quochus/concept-catalogue` (attach with add_repo).
- **Zotero**: `C:\Users\QMNguyen\Zotero` (`zotero.sqlite` + `storage/` PDFs; ~13,600 items, ~8,100 PDFs). Zotero locks the database while open, so copy `zotero.sqlite` and `zotero.sqlite-wal` before reading. Citation keys come from Better BibTeX.
- **CIAT work** is a separate vault (`D:\Vaults\ciat-work`). Never write catalogue content there, and never copy CIAT project material into the catalogue. Link across vaults with `obsidian://open?vault=<vault>&file=<path>` URIs, since `[[ ]]` links do not cross vaults.
- Vault-level instructions: `CLAUDE.md` at the vault root; a copy of this skill sits in `Claude setup/skills/` and `.claude/skills/` (for Claudian).

## Vault structure

```
Home.md                                                   start page
1. Daily/YYYY-MM-DD.md                                    daily notes: raw notes, ideas
2. New literature/                                        daily literature check (index: New literature.md)
    Papers/                                               papers to read / reading
    Archive/YYYY-MM/                                      papers read or not relevant
3. Concepts/<Concept name>/<Concept name>.md              main entry
3. Concepts/<Concept name>/Discussions/YYYY-MM-DD <topic>.md   saved discussions (sub-pages)
4. Discuss/                                               discussions in progress (index: Discuss.md)
5. Sources/<citekey>.md                                   one note per source used as evidence
6. Updates/YYYY-MM-DD.md                                  weekly update suggestions
Templates/                                                Concept, Source, Discussion, Daily note
Attachments/                                              images and files
Claude setup/                                             skill copies, setup notes
```

The numbers follow the workflow. `2. New literature/` is filled and kept in step by a scheduled sync with the Reading Desk page (https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU); don't reorganise it by hand beyond what Quoc asks. A paper there becomes a `5. Sources/` note only when Quoc asks to use it for an entry.

## Step 1: Ask for Quoc's first take (always, before drafting)

Before researching or drafting a new entry, ask Quoc in one short message:

> Before I draft it: how do you understand **<concept>** right now? Two or three sentences is enough — what it is, and where you've used it.

Wait for the answer. If he says to skip it, proceed and leave the "My first take" section empty. Do not write his first take for him.

## Step 2: Gather sources

Priority order:
1. Seminal / originating works (the paper that coined or formalized the concept).
2. Highly cited works and major reviews or syntheses (check citation counts via OpenAlex or Semantic Scholar; Google Scholar has no API).
3. Authoritative institutional framings (e.g. HLPE, FAO, IFPRI, CGIAR) where they shape policy use.
4. At least one **distinct perspective**: a critical, Global South, or alternative framing that differs from the mainstream.
5. Recent work (last ~3 years) that extends or contests the concept.

Sources: Quoc's Zotero library first (when reachable), then the Consensus connector, OpenAlex, Semantic Scholar, and web search. Note any source not in Zotero so he can add it.

Aim for 5–12 sources per entry. Quality over quantity.

## Step 3: Draft the entry

Use this structure (also in `Templates/Concept.md`):

```markdown
---
type: concept | framework | method | approach
fields: [food systems, ...]
related: ["[[Concept A]]", "[[Concept B]]"]
status: draft | reviewed
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
---

# <Concept name>

## My first take
<Quoc's words from Step 1, verbatim and dated. Never edited later.>

## Definitions
Key definitions (who defined it, how, when), main components, and how it links to other concepts via [[links]]. Note where definitions differ and why.

## Features
Key findings that characterize the concept: what it includes and excludes, how it is measured, debates.

## Implications
Cases from the literature and how the concept is understood or applied, including in Vietnam and ASEAN where evidence exists.

## Own works
Where Quoc has used, applied or contributed to the concept (publications, manuscripts, reports, projects). Link CIAT projects with obsidian:// URIs to the ciat-work vault (e.g. obsidian://open?vault=ciat-work&file=Work/<Name>).

## Comparison with my first take
Where the literature agrees with, extends, or challenges Quoc's first take. Specific and short.

## In my words
<Left blank for Quoc to write a one-sentence takeaway. Prompt him to fill it.>

## Discussions
(Dataview list of the Discussions folder)

## Sources
- [[citekey]] — one line on why it's included (seminal / highly cited / review / distinct perspective / recent)
```

## Evidence rules

- Every substantive claim cites a source note: `([[citekey]], p. 12)`.
- In the source note, record for each claim used: a **short** exact quote (under 15 words), the precise locator (page, section, figure or table number), and a Zotero link that opens the PDF at that page: `zotero://open-pdf/library/items/<ITEMKEY>?page=<N>`. Use `zotero://select/library/items/<ITEMKEY>` when no PDF is attached.
- Figures and images: reference and describe them with figure number and page; do not copy them into the vault.
- Never invent quotes, page numbers or citation counts. If a locator can't be verified, say so in the note.

## Source note template

```markdown
---
citekey: <citekey>
zotero: zotero://select/library/items/<ITEMKEY>
citations: <count> (source, date checked)
why_included: seminal | highly cited | review | distinct perspective | recent
---
# <Author (Year). Title.>

Full reference.

## Used for
- [[Concept]]: claim — "short quote" (p. N) [open](zotero://open-pdf/library/items/<ITEMKEY>?page=N)
```

## Discussions

Discussions start in `4. Discuss/` (a note there, or a chat). When Quoc chats about a concept, offer to save the discussion as a sub-page of that concept. Save a dated note in `3. Concepts/<Concept>/Discussions/` (template `Templates/Discussion.md`) with: question explored, main points, where Quoc landed (his own conclusions, attributed to him), open questions, and new sources. Link it from the main entry; if it started as a note in `4. Discuss/`, leave that note in place and add a link to the saved sub-page at its top. Distinguish Quoc's conclusions from Claude's suggestions.

In discussions, actively support learning: offer a critical view, compare framings, or test the concept against his contexts (Son La, Laos, Cambodia, etc.) when useful.

## Daily notes and filing

When asked to "file my notes": read `1. Daily/` and `4. Discuss/`, move concept material into the right concept's `Discussions/` page or a new concept stub in `3. Concepts/`, and log one line per item under "Filed" in that day's daily note. Never edit or delete Quoc's raw text. CIAT project material goes to the ciat-work vault's `1. Notes/` instead. Ask when unsure where something belongs.

## Updates

A weekly scheduled task scans for new influential or distinct work on existing entries and writes suggestions to `6. Updates/YYYY-MM-DD.md`, grouped by concept, each with the source, what it adds, and the suggested change. **Never rewrite Definitions, Features, Implications or My first take automatically.** Change an entry only when Quoc asks after reviewing the suggestions, then update `last_reviewed`.

## Finishing

When writing to the local vault, leave committing to Obsidian Git (auto-sync every 10 minutes). When working in the GitHub repo instead, commit with a clear message (e.g. `Add entry: Food environment`). Then tell Quoc in one or two lines what was added, and prompt him to write the "In my words" line.