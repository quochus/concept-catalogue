# Concept catalogue: handover (23 Oct 2026)

How to use this file: open a new chat in the new account, connect the folders below, and say: *"Read `Claude setup/HANDOVER.md` and `.claude/skills/concept-catalogue/SKILL.md` in my concept-catalogue vault, then continue the work."*

## 1. What this project is

Quoc's Obsidian concept catalogue: a dictionary of about 250 concepts, approaches, frameworks and methods in food systems, agriculture, value chains, transitions, governance and research methods. Each concept page is drafted by Claude from Quoc's Zotero library under strict evidence rules, then reviewed by Quoc. The current priority is concepts that the IP1+ project uses (Laos and Cambodia: agroecology, scaling, intermediaries, markets).

## 2. Where things live

| Item | Location |
|---|---|
| Vault | `D:\Vaults\concept-catalogue`. Obsidian Git auto-commits every 10 min. |
| Concept pages | `3. Concepts/<Concept name>.md` |
| Plan and full list (source of truth) | `3. Concepts/0. Backlog.md` |
| Dictionary index | `0. Dictionary.md`: Dataview list grouped by first letter, `WHERE type`. **Never edit.** |
| Workflow rules (the skill) | `.claude/skills/concept-catalogue/SKILL.md` (§§1–9) and the pointer file `CLAUDE.md` at the vault root |
| Page template | `Templates/Concept.md` |
| Zotero library | `C:\Users\QMNguyen\Zotero`: `zotero.sqlite` plus `storage/<ATTKEY>/*.pdf`. **Read-only for Claude.** |
| Helper scripts | `Claude setup/scripts/`: `zcat.py` (Zotero) plus `qa.py`, `common_head.py`, `abs.py`, `grep_pdf.py` (copied there with this handover) |
| Papers to import | `Claude setup/Papers to add to Zotero (thin pages).md` |

**Not transferring (old CIAT account only):**

- **Account-level copy of the skill:** re-save it in the new account from the vault copy (ask Claude to propose it as a skill).
- **Backlog review page (artifact):** its decisions database is empty, and all Y/N decisions are already in the Backlog's Review column, so nothing is lost. If wanted, ask Claude to rebuild the review page from the Backlog.
- **Links to the `ciat-work` vault:** "Own works" sections link to CIAT project notes through `obsidian://open?vault=ciat-work&file=...` URIs. Those links only open on a machine with that vault. **Never copy CIAT project material into this vault.**

## 3. Hard rules (also in SKILL.md)

1. Never write or edit **My first take** or **In my words**. Those sections are Quoc's. For the IP1+ batch, first takes were skipped by Quoc. The skipped text reads "*Skipped by Quoc (2026-10-22) to save time; can be added later. Never edited by Claude.*", followed by "(skipped)".
2. Never invent quotes, page numbers or citation counts. Every quote must be verified against its PDF page and be **under 15 words**.
3. Zotero is read-only: no new items, collections or tags. Quoc imports papers himself.
4. Never edit `0. Dictionary.md`. Never renumber concept IDs.
5. Use APA 7 citations.

## 4. Page standard

**Frontmatter fields:**

- `type`: concept, approach, framework or method
- `short`: a one-line definition
- `aliases`
- `fields`: from a controlled list
- `related`: `[[links]]`
- `scope`: broad or focused
- `tier`: full or compact
- `status`: first take, draft or reviewed
- `created` and `last_reviewed`

**Section order:**

1. My first take
2. Definitions
3. Features
4. Implications
5. Own works
6. Comparison with my first take
7. In my words
8. Discussions (Dataview block)
9. Key sources
10. Evidence

**What each section contains:**

- **Definitions:** a narrative in logical order: origin → how the meaning shifted → current core definition → where definitions diverge → what it is not → a bold **Working definition used here**, marked as Claude's synthesis.
- **Features:** components → mechanisms → conditions → measurement → debates, in logical order.
- **Implications:** scaled to scope. Broad concepts get an overview of the evidence, a case table of 5–8 cases (Case | Where, when | Pathway/type | What was done | Outcomes | Source) and lessons. Focused concepts get a short version.
- **Key sources:** a full APA 7 list. Each entry ends with a role tag (seminal, review, recent, Viet Nam/ASEAN, case, critique…) and a `[Zotero](zotero://select/library/items/PARENTKEY)` link.
- **Evidence:** a table with columns `ID | Claim | Section | Source | Quote | Locator | Open`. The Open link is `zotero://open-pdf/library/items/ATTKEY?page=N`, where N is always the PDF page index. Locator gives the printed page (`p. 974`), or `PDF p. N` for article-number journals and reports. Every quote that appears in the body must have a row.

**Target sizes (set by Quoc, 25 Oct 2026):**

| Tier | Sources |
|---|---|
| Full, broad | 12–20 |
| Full, focused | 8–12 |
| Compact | 5–8 |

Words: every page has **at least 1,000 words**; the ideal is **1,200–2,000**, and longer is fine. There is no upper limit, so never cut sourced material to shorten a page. If a page falls short on sources or words, it says so in a gap note.

## 5. Concept IDs and clusters

IDs are a cluster letter plus 2 digits (e.g. H06). They are fixed: new concepts take the next free number in their cluster, and retired IDs are not reused. There are 248 concepts in 11 clusters:

- A: Food systems concepts and frameworks
- B: Production and sustainable agriculture
- C: Supply chains and markets
- D: Alternative food networks, trust and standards
- E: Food environments, consumption and diets
- F: Food security, nutrition and health
- G: Sustainability transitions and transformation
- H: Innovation, scaling and learning
- I: Governance, institutions and policy
- J: Livelihoods, equity, resilience and natural resources
- K: Research and assessment methods

Backlog table columns: `ID | Concept | Type | Wave | Scope | Tier | Zotero | Anchors (verify) | Review | Status`. Review values start with "Y — …" or "Suggested by Claude — mark N on the review page if not wanted".

## 6. Drafting workflow (per concept)

1. Find sources: `python3 zcat.py search "regex"`. `zcat.py pdf PARENTKEY` gives the attachment key and PDF path. `abs.py "ATT:pages:regex"` prints candidate sentences.
2. Get APA entries: `zcat.py apa KEY...`. Fix sentence case, missing volume and issue, and role tags by hand.
3. Write the page with a small builder script that calls `common_head.write(name, fm, body, own, comparison, refs)`. The script refuses to overwrite an existing file.
4. QA: run `python3 qa.py FILE.md` and `zcat.py check FILE.md`.
   - qa.py checks every quote against its PDF page, the under-15-word rule, that each body quote is in Evidence, that cited surnames are in Key sources, and the links.
   - Expected false positives: "My first take", "Oct", country names, and second-author surnames.
5. Update the Backlog row: make the name a `[[link]]`, set the status to `draft (date)`, and update the progress line.

**Gotchas:**

- **Two-column PDFs and soft hyphens:** zcat has a raw-text fallback for these.
- **Taylor & Francis cover pages:** PDF p. 2 is printed page 1, so check the page header.
- **Work in place:** edit vault files on the computer with scripts (python read-modify-write or `sed -i`), not by retyping a page.
- **Old account's copy problem:** committing a cloud copy back could write stale content, so it verified the md5 afterwards.

## 7. Status (23 Oct 2026)

Progress: 248 concepts · 13 drafted, awaiting Quoc's review · 0 reviewed · 235 to do.

**Drafted earlier, upgraded to the new standard 22 Oct:**

| ID | Page | Sources |
|---|---|---|
| B08 | Agroecology | 20 |
| B09 | Scaling agroecology | 12 |
| D05 | Connectivity | 12 |
| D09 | Values of sustainable agri-food products | 12 |

**IP1+ week 1, drafted 22 Oct (first takes skipped):**

| ID | Page | Tier | Sources | Note |
|---|---|---|---|---|
| B10 | Regenerative agriculture | full | 8 | |
| B19 | Conservation agriculture | compact | 5 | has a gap note |
| H06 | Scaling | full, broad | 14 | |
| H05 | Innovation bundling | compact | 5 | |
| G18 | Intermediaries | full | 9 | |
| C25 | Market linkages | compact | 6 | |
| C26 | Market systems | compact | 5 | thin |
| C27 | Market systems development | full | 5 | below the 8–12 target; gap note |
| C29 | Inclusive value chains | compact | 7 | |

**Plan (Backlog "Plan" table):**

| Wave | Concepts | Due |
|---|---|---|
| 0 | started | |
| 1a: IP1+ priority | 26 (10 full, 16 compact) | 13 Nov 2026 |
| 1b: thesis core | 31 | 29 Dec 2026 |
| 2 | 76 | 5 Mar 2027 |
| 3 | 94 | 14 May 2027 |
| 4 | 17 | 27 May 2027 |

The realistic finish is late June 2027.

**Weekly batches:**

| Week | Concepts | Status |
|---|---|---|
| 22 Oct | B10, B19, H06, H05, G18, C25, C26, C27, C29 | done |
| 26 Oct | C14, C16, D11, D08, D18, D16 | next |
| 2 Nov | D10, J15, I24, E01, E11 | |
| 9 Nov | E25, E08, E26, I27, K02, K18 | |
| 16 Nov | A01, A04, A02, G03, G02 | |
| 23 Nov | G01, G05, G06, G07, G08 | |
| 30 Nov | G11, G10, G19, G20, A08 | |
| 7 Dec | C18, C19, C20, C09, D01 | |
| 14 Dec | D02, D06, I06, I07, I09 | |
| 21 Dec | I10, G22, I01, I02, I05, F08 | |

## 8. Open items, in order

1. **Literature search for thin pages.** Pages: C27 MSD, C26 Market systems, B19 Conservation agriculture.
   - The OpenAlex/paper-search route was blocked on the CIAT network; try it in the new account.
   - A candidate list with DOIs is in `Claude setup/Papers to add to Zotero (thin pages).md`.
   - Quoc imports the papers and attaches the PDFs; then Claude updates the three pages and reruns QA.
   - Also add the two Vankeerberghen papers already in Zotero (QB9RKDWS, 45T4PNBF) to B19.
2. **Quoc reviews the 13 drafts.** He adds first takes if wanted; Claude then fills "Comparison with my first take" and sets status to reviewed after his OK.
3. **Draft the 26 Oct batch:** C14, C16, D11, D08, D18, D16.
4. **Minor housekeeping:**
   - SKILL.md still says "~210 concepts" and "K20"; update it to 248 concepts.
   - Mark the 22 Oct week as done in the Backlog week table.
   - Check that the vault's `Claude setup/README.md` mentions the scripts added with this handover.

## 9. Useful Zotero keys (parent → attachment)

| Source | Parent | Attachment |
|---|---|---|
| Moore et al. 2015 (scaling out/up/deep) | Z8IEL5Z8 | DC7X2734 |
| Hermans et al. 2013 | RGJTU7TB | RG6HVZRC |
| Kohl 2023 | YH3KTZNU | LVY7JLLT |
| IWMI 2021 adaptive scaling | SYGK42DW | BZQ77AQ8 |
| Kihoro et al. 2025 | PIPNYET8 | 4YGNAXLY |
| Castella et al. 2022 (Laos) | IYEJXJT7 | J6WTB2NH |
| À Hauariki et al. 2026 (Cambodia) | W4QU2UD9 | BABXQILN |
| Barrett et al. 2020 bundling | 5X66JKX8 | A6RWYDZ3 |
| Kivimaa et al. 2019 | AUY4TVTA | YCZRVKF7 |
| Howells 2006 | KYRZM33F | QK9MD3US |
| Springfield Centre 2008 M4P | 4ZHE6PMM | L2AT87VI |
| Shepherd 2007 | NHYG7IYC | XLZNVU4Q |
