# New literature

Papers found by the daily literature check (around 11:00 Hanoi time), with Claude's key takeaways. Read them on the phone in the Reading Desk page: https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU

- One note per paper in `Papers/`. Change `status` (to read, reading, read, not relevant) here or on the Reading Desk page; the next sync copies it across.
- Papers are also added to Zotero, in the collection **_Daily new articles**.
- A paper worth keeping for a concept entry can be turned into a proper source note in `Sources/` (ask Claude).

## To read
```dataview
TABLE WITHOUT ID file.link AS Paper, venue AS Venue, found_on AS Found, top_pick AS "Top pick"
FROM "New literature/Papers"
WHERE status = "to read" OR status = "reading"
SORT found_on DESC, top_pick DESC
```

## Read
```dataview
TABLE WITHOUT ID file.link AS Paper, venue AS Venue, found_on AS Found
FROM "New literature/Papers"
WHERE status = "read"
SORT found_on DESC
```
