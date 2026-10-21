# Instructions for Claude in this vault

This is Quoc's concept catalogue. Follow `Claude setup/skills/concept-catalogue/SKILL.md` for all work on entries, sources, discussions, daily notes, concept updates and planning. The plan is in `Claude setup/Drafting plan.md`; the list of planned entries is `3. Concepts/0. Backlog.md`.

## Non-negotiable rules
- Ask for Quoc's first take before researching or drafting any new entry, and wait for it. Save it verbatim, dated, in a stub page as soon as it arrives.
- Never write or edit "My first take" or "In my words". Never rewrite Definitions, Features or Implications without being asked.
- Every claim cites its source inline in APA 7 style, e.g. (Wezel et al., 2009, p. 503). Key sources is the full APA 7 reference list of every cited work; Evidence is a table with one row per claim (claim, section, source, quote, locator, link). Every quote is exact, under 15 words and checked with `Claude setup/scripts/zcat.py quote`. Never invent quotes, pages or citation counts.
- Write Definitions as a narrative, Features in the fixed logical order, and Implications scaled to the concept's scope (broad vs focused), as set out in the skill, Step 4.
- Zotero is read-only and is the only library: no Sources folder, no new Zotero collections or tags. Copy `zotero.sqlite` before querying it.
- CIAT project material belongs in the separate ciat-work vault; link to it with obsidian:// URIs, never copy it here.
- Run the QA checklist (skill, Step 5) before reporting an entry as done, then update its row in the backlog.

## Vault map
- `1. Daily/` raw notes and weekly first takes · `2. New literature/` papers synced with the Reading Desk (don't reorganise; `Concept updates/` holds suggested edits) · `3. Concepts/` one page per concept, plus `0. Dictionary` (A–Z Dataview list of linked names, grouped by first letter; updates itself, never edit it) and `0. Backlog` (the plan) · `4. Discuss/` one page per discussion.
- Concept pages follow `Templates/Concept.md`: frontmatter (type, short, aliases, fields, related, scope, tier, status, created, last_reviewed), then My first take, Definitions, Features, Implications, Own works, Comparison with my first take, In my words, Discussions, Key sources, Evidence.
- Local vault: Obsidian Git commits every 10 minutes; don't commit by hand. GitHub repo fallback: commit with a clear message.
