# Claude setup

Everything Claude-side, so the setup can move to another Claude account (for example a CIAT work account).

- `.claude/skills/concept-catalogue/SKILL.md` (at the vault root) is the one vault copy of the skill. Claudian reads it inside Obsidian; to set up a new account, upload that folder under Settings > Skills.
- `CLAUDE.md` at the vault root points Claude to the skill.
- `scripts/zcat.py` is the Zotero helper (search, APA references, quote checks). It only reads Zotero.
