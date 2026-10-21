---
name: concept-catalogue
description: Use when Quoc asks to add, draft, discuss, review or update an entry in his Obsidian concept catalogue (concepts, frameworks, methods in food systems, NRM, supply chains), or to plan or pick the next entries from its backlog.
---

# Concept catalogue

Quoc keeps a personal catalogue of concepts, frameworks, methods and approaches as an Obsidian vault. It is a reference for his writing and a learning tool. Entries are built one at a time from a planned backlog of ~140 concepts, ideally in the order his current work needs them.

## 1. Where things are

| What | Where |
|---|---|
| Vault (preferred) | `D:\Vaults\concept-catalogue` on the laptop, when linked. Work there with device_bash (`$HOME/mnt/concept-catalogue`). Obsidian Git commits and pushes every 10 minutes; never commit by hand there. |
| Vault (fallback) | GitHub repo `quochus/concept-catalogue` (attach with add_repo). Commit with a clear message, e.g. `Add entry: Food environment`. |
| Zotero | `C:\Users\QMNguyen\Zotero` (`zotero.sqlite`, `storage/<ATTACHMENTKEY>/<file>.pdf`; ~21,800 items, ~8,000 PDFs). Read-only for this work. |
| CIAT work | Separate vault `D:\Vaults\ciat-work`. Never write catalogue content there; never copy CIAT project material into the catalogue. Link with `obsidian://open?vault=ciat-work&file=<URL-encoded path>` (`[[ ]]` links don't cross vaults). |
| Instructions | `CLAUDE.md` at the vault root. Copies of this skill: `Claude setup/skills/concept-catalogue/SKILL.md` and `.claude/skills/concept-catalogue/SKILL.md`. When the skill changes, update both copies so all three match. |

If the laptop is not linked, say so, work from the GitHub repo, and use external sources only; mark Zotero links as `(Zotero link pending)` and list those sources for Quoc to add.

## 2. Vault structure

```
Home.md                                  start page
CLAUDE.md                                standing instructions
1. Daily/YYYY-MM-DD.md                   daily notes: raw notes, ideas, first takes
2. New literature/                       daily literature check, synced with the Reading Desk
                                         (https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU); don't reorganise by hand
    Papers/  Archive/YYYY-MM/            paper notes
    Concept updates/YYYY-MM-DD.md        suggested edits to concept pages
3. Concepts/0. Dictionary.md             A–Z list of linked concept names (Dataview LIST; updates itself; never edit; see §3)
3. Concepts/0. Backlog.md                the planned list: cluster, type, wave, tier, status
3. Concepts/<Concept name>.md            one page per concept
4. Discuss/YYYY-MM-DD <topic>.md         one page per discussion (index: Discuss.md)
Templates/                               Concept, Discussion, Daily note
Attachments/                             images and files
Claude setup/                            skill copies, Drafting plan.md, setup notes
```

Evidence lives in each concept page (Key sources + Evidence). There is no Sources folder; Zotero is the only library. Do not create Zotero collections or tags for the catalogue. A paper in `2. New literature/` is used in a concept only when Quoc asks.

## 3. Conventions

- **File name = concept name**, sentence case, singular unless the plural is the term ("Food systems approach", "Institutions"), no abbreviation in the name. Put abbreviations and synonyms in `aliases` (e.g. `aliases: [MLP]`).
- **Frontmatter** (every concept page):
  ```yaml
  type: concept | framework | method | approach
  short: "<one sentence, ≤ 30 words, no citations>"
  aliases: []
  fields: [<1–3 from the list below>]
  related: ["[[A]]", "[[B]]"]        # 3–6 links
  tier: full | compact
  status: first take | draft | reviewed
  created: YYYY-MM-DD
  last_reviewed: YYYY-MM-DD
  ```
- **type**: *concept* = an idea or phenomenon; *framework* = a structured scheme of components or levels; *method* = a procedure for collecting or analysing data; *approach* = a way of acting or intervening that combines principles and practice.
- **fields** (controlled list): food systems · sustainability transitions · innovation and scaling · agroecology · sustainable agriculture · value chains and markets · consumption and nutrition · food security and safety · governance and policy · institutions · natural resource management · research methods.
- **related**: link only to pages that exist or to names in `0. Backlog.md`. If a needed concept is in neither, add it under "Proposed additions" in the backlog and tell Quoc.
- **Tiers**: *full* = 8–12 sources, ~900–1,300 words of body text; *compact* = 5–7 sources, ~500–700 words. The backlog sets the tier.
- **Language**: plain, short sentences, British spelling except in quotes and titles, "Viet Nam" in prose. No headings inside sections; bold lead-ins are fine.
- **Claude's own synthesis** (a grouping, typology or proxy not taken from a source) is allowed but must be labelled in the text: *(Claude's grouping, not from a source)*.

### The Dictionary (`3. Concepts/0. Dictionary.md`)
Its current format (since 21 Oct 2026) is a plain A–Z list of linked concept names, grouped by first letter, with no definitions or other columns:
````markdown
---
cssclasses: [dictionary]
---
# Dictionary

```dataview
LIST rows.file.link
FROM "3. Concepts"
WHERE type AND file.name != this.file.name
SORT file.name ASC
GROUP BY upper(substring(file.name, 0, 1)) AS Letter
SORT Letter ASC
```
````
- **Never edit this file** (no tables, definitions, extra columns or hand-written entries). It updates itself. If its format looks wrong or Quoc wants it changed, ask first; when he changes it, update this section to match.
- A page is listed **only if** it sits in `3. Concepts/` (keep concept pages in the folder root, no subfolders) **and** has a non-empty `type`. So every concept page needs `type`, and no other file in `3. Concepts/` may have a `type` property (`0. Backlog.md` has none on purpose).
- The letter group comes from the **first character of the file name**, so file names must start with a letter: no leading digits, quotes, brackets or "The"/"A" (write "Commons", not "The commons").
- Stub pages (`status: first take`) have a `type`, so they appear in the Dictionary as soon as they are created. That is intended.
- `short` and `related` are not shown in the Dictionary, but keep them filled anyway: they describe the page and link it to its neighbours.

## 4. Workflow for a new entry

### Step 0. Choose the concept
1. If Quoc names a concept, use it. If it is not in `0. Backlog.md`, add it to the right cluster (with type, wave, tier) and tell him.
2. Otherwise read `0. Backlog.md` and propose the next one: lowest wave with `status: todo`, preferring what his current work needs (a concept named in today's daily note, or a missing `related` link). Propose, don't start.
3. Check the Dictionary and backlog for overlap. If the concept is close to an existing page, ask whether to merge, narrow, or keep both, and note the boundary.

### Step 1. Get Quoc's first take (always, before any research)
Ask in one short message:

> Before I draft it: how do you understand **<concept>** right now? Two or three sentences is enough — what it is, and where you've used it.

For a week's batch (the Monday routine in `Drafting plan.md`), list up to 5 concepts in that day's daily note under `## First takes this week` and ask once.

Wait for the answer. As soon as it arrives, create the page from `Templates/Concept.md` with `status: first take`, the frontmatter filled from the backlog, and his words pasted **verbatim** under "My first take" with the date. Set the backlog status to `first take`. If he says skip, leave the section empty and note "(skipped)". Never write or paraphrase his first take.

### Step 2. Gather sources
Required mix (full tier; compact needs the first three plus either 4 or 5):
1. the **seminal** or originating work;
2. at least one **highly cited** work or major **review/synthesis**;
3. an **institutional framing** (HLPE, FAO, IFPRI, CGIAR, UN) where one shapes policy use;
4. at least one **distinct perspective**: critical, Global South or alternative framing;
5. at least one **recent** work (last 3 years);
6. **Viet Nam / ASEAN** evidence when it exists (search for it; say so if none is found).

Search order: (a) Zotero, (b) OpenAlex (`paper-search` skill) for seminal works and citation counts (Google Scholar has no API), (c) Consensus or Semantic Scholar, (d) web search for institutional reports. Prefer sources that are in Zotero with a PDF. Any source not in Zotero goes in a "To add to Zotero" list in the final message.

**Zotero lookup** (on the laptop, device_bash). Zotero locks the database, so copy first, then query the copy:
```bash
mkdir -p ~/zt && cp "$HOME/mnt/Zotero/zotero.sqlite" "$HOME/mnt/Zotero/zotero.sqlite-wal" ~/zt/ 2>/dev/null
```
```python
import sqlite3, re, os
c = sqlite3.connect(os.path.expanduser('~/zt/zotero.sqlite'))
F = lambda f: f"(select v.value from itemData d join fields x using(fieldID) join itemDataValues v using(valueID) where d.itemID=i.itemID and x.fieldName='{f}')"
rows = c.execute(f"""select i.key, {F('title')}, {F('date')}, {F('DOI')},
  (select group_concat(a2.key||'|'||coalesce(a.path,''),';') from itemAttachments a join items a2 on a2.itemID=a.itemID
     where a.parentItemID=i.itemID and a.contentType='application/pdf')
  from items i where i.itemID not in (select itemID from deletedItems)""").fetchall()
hits = [r for r in rows if r[1] and re.search(PATTERN, r[1], re.I)]
```
- `i.key` (parent item key) → `zotero://select/library/items/<PARENTKEY>` (Key sources).
- attachment key → `zotero://open-pdf/library/items/<ATTACHMENTKEY>?page=<N>` (Evidence). If the item has no PDF, use `zotero://select/library/items/<PARENTKEY>` in Evidence too and give the locator in words. The PDF is at `$HOME/mnt/Zotero/storage/<ATTACHMENTKEY>/<path without "storage:">`.
- Also search abstracts (`abstractNote`), creators (`creators.lastName`) and the relevant collection (`collections`, `collectionItems`); the `3. Food systems` and `4. Research methodology` collections match the backlog clusters.
- Delete `~/zt` copies only if asked; never write to Zotero.

### Step 3. Extract evidence
For each claim you intend to make:
1. Open the PDF page text: `pdftotext -layout -f N -l N "<pdf>" -` (N = PDF page index, 1-based).
2. Find the passage and copy a **short exact quote** (under 15 words). Confirm it with a normalised match (collapse whitespace, rejoin hyphenated line breaks, replace ligatures). If it doesn't match exactly, don't use it as a quote.
3. Record two locators: the **printed page** (from the page header/footer) and the **PDF page index**. Cite the printed page in text, `(Author Year, p. 503)`; if the document has no printed numbers, use `(Author Year, PDF p. 6)`; for author manuscripts, `AAM p.`. The link's `?page=` is always the PDF page index.
4. Figures and tables: cite as `Fig. 2, p. 9` or `Table 1, p. 7`, describe in words; never copy images into the vault.
5. For sources outside Zotero, quote only from text you have actually read; give the section or page you read it on.

Never invent quotes, page numbers or citation counts. If a locator can't be verified, write `(locator not verified)`.

### Step 4. Draft the page
Follow `Templates/Concept.md` exactly (no H1; sections in this order):

| Section | What goes in | Size (full / compact) |
|---|---|---|
| My first take | Quoc's words from Step 1. Never edited later. | — |
| Definitions | Who defined it, how, when; main components; where definitions differ and why; boundary with neighbouring concepts ("not to be confused with"); `[[links]]`. | 150–350 / 100–200 words |
| Features | Scope (includes/excludes), how it is measured or operationalised, key debates and critiques. Bold lead-in bullets. | 4–7 / 3–4 bullets |
| Implications | Cases and uses from the literature; Viet Nam/ASEAN first where evidence exists. | 3–5 / 2–3 bullets |
| Own works | Quoc's publications, manuscripts, reports, projects that use the concept. Find them in Zotero (author Nguyen, Q.) and, for CIAT work, link with obsidian:// URIs. Titles and links only; no CIAT content. Leave "None yet" if none. | list |
| Comparison with my first take | Three bullets: **Agrees** / **Extends** / **Challenges**, each specific and citing a source. Address Quoc as "you". | 3 bullets |
| In my words | Leave the placeholder. Never write it. | — |
| Discussions | Keep the Dataview block from the template. | — |
| Key sources | `- Author (Year). Title. — role (seminal / highly cited / review / institutional / distinct perspective / recent / Viet Nam) — [Zotero](zotero://select/library/items/PARENTKEY)` | 8–12 / 5–7 |
| Evidence | `- Claim — "exact quote" (p. N) [open](zotero://open-pdf/library/items/ATTACHMENTKEY?page=PDFINDEX)` — one line per quoted claim, in the order claims appear. | — |

Every substantive claim carries an inline citation `(Author Year, p. N)`, and every direct quote in the body also appears in Evidence.

Set `status: draft`, `created` (keep the first-take date) and `last_reviewed` to today, and fill `short` and `related`.

### Step 5. QA checklist (run before finishing; fix, don't report)
- [ ] Frontmatter complete; `type`, `fields`, `tier`, `status` use allowed values; `short` ≤ 30 words.
- [ ] Every `[[link]]` resolves to an existing page or a backlog name.
- [ ] The page will show in the Dictionary under the right letter: it is in the root of `3. Concepts/`, has `type`, and its file name starts with a letter.
- [ ] Source mix from Step 2 is met (or the gap is stated in the page).
- [ ] Every quote is < 15 words, matches the PDF text, and has a printed page + correct `?page=` index.
- [ ] Key sources use parent keys; Evidence links use attachment keys; no placeholder keys left.
- [ ] Claude's own synthesis is labelled.
- [ ] Word count within the tier range (body sections only).
- [ ] My first take and In my words untouched.

A quick check of keys and links (run on the laptop):
```bash
cd "$HOME/mnt/concept-catalogue"; f="3. Concepts/<Name>.md"
grep -o 'items/[A-Z0-9]\{8\}' "$f" | sort -u            # keys used, then confirm each exists in ~/zt/zotero.sqlite
grep -o '\[\[[^]|]*' "$f" | sort -u                      # links, then confirm each is a page or in 0. Backlog.md
```

### Step 6. Finish
1. Update the concept's row in `0. Backlog.md`: status `draft`, and the progress line at the top.
   Make the backlog name a link (`[[Name]]`) once the page exists, spelled exactly like the file name. Don't touch `0. Dictionary.md`; it picks the page up by itself.
2. Add any newly needed concepts under "Proposed additions" in the backlog.
3. Reply to Quoc in two or three lines: what was added, any gaps (e.g. no Viet Nam evidence, sources to add to Zotero), and a prompt to write "In my words".
4. Local vault: leave committing to Obsidian Git. GitHub fallback: commit (`Add entry: <Name>`).

## 5. Review of a draft

When Quoc has read a draft and asks for changes, make only those changes. When he says it is reviewed (or writes "In my words"), set `status: reviewed`, update `last_reviewed`, and mark it `reviewed` in the backlog.

## 6. Discussions

Discussions live in `4. Discuss/`, one page each: `YYYY-MM-DD <topic>.md` (template `Templates/Discussion.md`; frontmatter `type: discussion`, `concepts: ["[[Concept]]"]`, `date`, `status: open | settled`). When Quoc chats about a concept, offer to save the discussion with: question explored, main points, where Quoc landed (his conclusions, attributed to him), open questions, and new sources. Keep Quoc's conclusions and Claude's suggestions clearly apart. The page shows up under Discussions on each listed concept; add a link in the concept's text only where it matters.

In discussions, support learning: offer a critical view, compare framings, or test the concept against his contexts (Son La, Dong Thap, Mekong Delta, Laos, Cambodia) when useful.

## 7. Daily notes and filing

When asked to "file my notes": read `1. Daily/` and `4. Discuss/`; move concept material into a discussion page (linked to its concepts) or a new concept page (via Steps 0–1), and log one line per item under "Filed" in that day's daily note. Never edit or delete Quoc's raw text. CIAT project material goes to the ciat-work vault's `1. Notes/` instead. Ask when unsure.

## 8. Concept updates

Suggested changes to existing pages go to `2. New literature/Concept updates/YYYY-MM-DD.md`, drawn only from papers already in New literature: grouped by concept, each with the paper, what it adds, and the proposed edit (section + exact text). **Never rewrite Definitions, Features, Implications or My first take automatically.** Change a page only when Quoc asks after reviewing, then update `last_reviewed`.

## 9. Planning

The plan and pace are in `Claude setup/Drafting plan.md`; the list is `3. Concepts/0. Backlog.md`. When Quoc asks what's next, or every ~4 weeks, compare the backlog with his current work (daily notes, Reading Desk relevance tags) and propose a reorder. Change the backlog order only with his OK; status updates after drafting don't need asking.
