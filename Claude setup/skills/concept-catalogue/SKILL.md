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
Home.md                                       start page
1. Daily/YYYY-MM-DD.md                        daily notes: raw notes, ideas
2. New literature/                            daily literature check (index: New literature.md)
    Papers/                                   papers to read / reading
    Archive/YYYY-MM/                          papers read or not relevant
    Concept updates/YYYY-MM-DD.md             suggested edits to concept pages
3. Concepts/0. Dictionary.md                  A-Z index of all concepts (bookmarked, always on top)
3. Concepts/<Concept name>.md                 one page per concept
4. Discuss/YYYY-MM-DD <topic>.md              one page per discussion (index: Discuss.md)
Templates/                                    Concept, Discussion, Daily note
Attachments/                                  images and files
Claude setup/                                 skill copies, setup notes
```

The numbers follow the workflow. Concept pages link out to their discussions: a discussion page lists its concepts in `concepts:` and appears automatically under that concept's Discussions. Evidence sits in the concept page itself; there is no Sources folder, and Zotero is the only library. `2. New literature/` is filled and kept in step by a scheduled sync with the Reading Desk page (https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU); don't reorganise it by hand. A paper there is used in a concept only when Quoc asks.

The Dictionary (`3. Concepts/0. Dictionary.md`) is a Dataview table grouped by first letter, showing each concept's `short` definition, type, `related` concepts and status. It updates itself; keep every concept page's `short` (one line) and `related` frontmatter filled so the Dictionary reads well.

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

Search Quoc's Zotero library first (when reachable), then the Consensus connector, OpenAlex, Semantic Scholar, and web search. Note any source not in Zotero so he can add it.

Aim for 5–12 sources per entry. Quality over quantity.

## Step 3: Draft the entry

Use this structure (also in `Templates/Concept.md`):

```markdown
---
type: concept | framework | method | approach
short: "<one-line definition for the Dictionary>"
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
Where Quoc has used, applied or contributed to the concept (publications, manuscripts, reports, projects). Link CIAT projects with obsidian:// URIs to the ciat-work vault (e.g. obsidian://open?vault=ciat-work&file=2. Work/<Name>).

## Comparison with my first take
Where the literature agrees with, extends, or challenges Quoc's first take. Specific and short.

## In my words
<Left blank for Quoc to write a one-sentence takeaway. Prompt him to fill it.>

## Discussions
(Dataview: LIST FROM [[]] AND "4. Discuss")

## Key sources
- Author (Year). Title. — seminal / highly cited / review / distinct perspective / recent — [Zotero](zotero://select/library/items/<ITEMKEY>)

## Evidence
- Claim — "short quote" (p. N) [open](zotero://open-pdf/library/items/<ITEMKEY>?page=N)
```

## Evidence rules

- Every substantive claim in a concept page cites its source inline: `(Author Year, p. 12)`. The page ends with a **Key sources** list (5–12 works, each with why it is included and a Zotero link) and an **Evidence** list that records, for each claim, a **short** exact quote (under 15 words), the precise locator (page, section, figure or table) and a Zotero link that opens the PDF at that page: `zotero://open-pdf/library/items/<ITEMKEY>?page=<N>` (or `zotero://select/library/items/<ITEMKEY>` when no PDF is attached).
- No Sources folder and no note per paper. Do **not** create Zotero collections or tags for the catalogue; Zotero already has its own folders. Find the item key in Zotero for each link.
- Figures and images: reference and describe them with figure number and page; do not copy them into the vault.
- Never invent quotes, page numbers or citation counts. If a locator can't be verified, say so.

## Discussions

Discussions live in `4. Discuss/`, one page each: `YYYY-MM-DD <topic>.md` (template `Templates/Discussion.md`, frontmatter `type: discussion`, `concepts: ["[[Concept]]"]`, `date`, `status: open | settled`). When Quoc chats about a concept, offer to save the discussion there with: question explored, main points, where Quoc landed (his own conclusions, attributed to him), open questions, and new sources. Because the page lists its concepts, it shows up under Discussions on each concept page; also add the link in the concept's text where it matters. Distinguish Quoc's conclusions from Claude's suggestions.

In discussions, actively support learning: offer a critical view, compare framings, or test the concept against his contexts (Son La, Laos, Cambodia, etc.) when useful.

## Daily notes and filing

When asked to "file my notes": read `1. Daily/` and `4. Discuss/`, move concept material into a discussion page in `4. Discuss/` (linked to its concepts) or a new concept page in `3. Concepts/`, and log one line per item under "Filed" in that day's daily note. Never edit or delete Quoc's raw text. CIAT project material goes to the ciat-work vault's `1. Notes/` instead. Ask when unsure where something belongs.

## Concept updates

Suggested changes to existing concept pages are written to `2. New literature/Concept updates/YYYY-MM-DD.md`, drawn from papers already in New literature (no separate search): grouped by concept, each with the paper, what it adds, and the proposed edit. **Never rewrite Definitions, Features, Implications or My first take automatically.** Change a page only when Quoc asks after reviewing, then update `last_reviewed`.

## Finishing

When writing to the local vault, leave committing to Obsidian Git (auto-sync every 10 minutes). When working in the GitHub repo instead, commit with a clear message (e.g. `Add entry: Food environment`). Then tell Quoc in one or two lines what was added, and prompt him to write the "In my words" line.