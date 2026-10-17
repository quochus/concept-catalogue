# Concept catalogue

A place to explore relevant concepts and their implications.

## How it works
1. **Note freely** in today's daily note or in `Inbox/`. No structure needed.
2. **Pick one concept a day**, ideally one your current work needs. Ask Claude to start an entry; Claude asks for your first take before drafting.
3. **Discuss** a concept with Claude; conclusions are saved under that concept's `Discussions/`.
4. **Review updates** in `Updates/`. Nothing changes in an entry until you ask.
5. **Write "In my words"** for every entry. Only you write that line.

## Folders
- `Concepts/` one folder per concept, with its main note and discussions
- `Sources/` one note per paper or report, with quotes, page numbers and Zotero links
- `Updates/` weekly suggestions from new literature
- `New literature/` papers from the daily literature check, with takeaways ([[New literature]])
- `Inbox/` and `Daily/` raw notes waiting to be filed
- `Templates/` note templates
- `Claude setup/` the skill and setup notes, kept so they move with you

## Entries
```dataview
TABLE type, fields, status, last_reviewed
FROM "Concepts"
WHERE type
SORT file.name ASC
```
*(The table above needs the Dataview community plugin. Without it, browse `Concepts/` directly.)*

## Workspace links
- [Reading Desk (phone)](https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU)
- [CIAT work vault](obsidian://open?vault=ciat-work&file=Home)
