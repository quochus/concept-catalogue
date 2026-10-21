# New literature

Papers found by the daily literature check (every morning around 6:00 Hanoi time), with Claude's key takeaways. Read them on the phone in the Reading Desk page: https://claude.ai/artifact/TzXTkjTBsdnVk45P7hzpaU

- One note per paper in `Papers/` while it is to read or reading. Change `status` (to read, reading, read, not relevant) here or on the Reading Desk page; the next sync copies it across.
- Papers marked read or not relevant are moved to `Archive/YYYY-MM/` (month found). Nothing is deleted.
- Each note carries Claude's `relevance` (high/medium/low), `relates_to` (your projects) and your own `my_relevance`.
- Papers are also added to Zotero, in the collection **_Daily new articles**.
- A paper is used in a concept entry only when you ask; its evidence then goes into that concept page's Key sources and Evidence lists.

## To read
```dataview
TABLE WITHOUT ID file.link AS Paper, venue AS Venue, found_on AS Found, top_pick AS "Top pick"
FROM "2. New literature/Papers"
WHERE status = "to read" OR status = "reading"
SORT found_on DESC, top_pick DESC
```

## Read
```dataview
TABLE WITHOUT ID file.link AS Paper, venue AS Venue, found_on AS Found
FROM "2. New literature/Archive"
WHERE status = "read"
SORT found_on DESC
```

## Relevant to my work
```dataview
TABLE WITHOUT ID file.link AS Paper, relevance AS Relevance, relates_to AS "Relates to", status AS Status
FROM "2. New literature"
WHERE type = "paper" AND (my_relevance = "yes" OR (relevance = "high" AND my_relevance != "no"))
SORT found_on DESC
```
