# New literature

The daily literature check (about 6:00 Hanoi time) puts new papers on the Reading Desk page: https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU

You decide on the page which papers to keep (Must read, Later, Done). Each time you tap **Sync to laptop**, the papers you kept since the last sync are added to **one new page** in `New papers/`, named `New papers YYYY-MM-DD` (the sync date), as a table: full reference (APA 7), one-line summary, relevant concepts (links to existing concept pages) and DOI/link, sorted A–Z by first author. There is no note per paper.

- Papers marked Not relevant, or left New, are never written here.
- Status, relevance and key takeaways stay on the Reading Desk page. Kept papers also go to Zotero (collection **_Daily new articles**).
- A paper is used in a concept entry only when you ask. Its evidence then goes into that concept page's Key sources and Evidence lists.
- Suggested changes to concept pages go to `Concept updates/`.
- `_old paper notes/` holds the per-paper notes from before 24 Oct 2026. Nothing in it is used any more; delete it when you are happy.

## Sync pages
```dataview
TABLE WITHOUT ID file.link AS Page, papers AS Papers
FROM "2. New literature/New papers"
SORT synced DESC
```
