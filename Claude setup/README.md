# Claude setup

Everything Claude-side, so the setup can move to another Claude account (for example a CIAT work account).

- `.claude/skills/concept-catalogue/SKILL.md` (at the vault root) is the one vault copy of the skill. Claudian reads it inside Obsidian; to set up a new account, upload that folder under Settings > Skills.
- `CLAUDE.md` at the vault root points Claude to the skill.
- `scripts/zcat.py` is the Zotero helper (search, APA references, quote checks). It only reads Zotero.

## Added 23 Oct 2026
- `HANDOVER.md`: full state of the project and how to continue (start here in a new account or chat).
- `scripts/qa.py FILE.md`: checks Evidence quotes against PDF pages, the <15-word rule, body quotes vs Evidence, cited names vs Key sources.
- `scripts/common_head.py`: `write(name, fm, body, own, comparison, refs)` builds a new concept page (never overwrites).
- `scripts/abs.py "ATT:pages:regex"`: prints matching sentences from a Zotero PDF.
- `scripts/grep_pdf.py`: search text in a PDF.
- `Papers to add to Zotero (thin pages).md`: DOIs to import for C26, C27, B19.
