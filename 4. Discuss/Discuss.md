# Discuss

Where we talk through concepts. Each discussion is one dated page here: `YYYY-MM-DD <topic>.md`.

- Start a page here, or just chat with Claude about a concept. When a chat is worth keeping, ask Claude to **save it**: it becomes a page here with the question, main points, where you landed (your conclusions), open questions and new sources.
- Each page lists its concepts in the `concepts` property, so it shows up automatically under **Discussions** on those concept pages.
- Set `status` to `open` or `settled`.

## Open
```dataview
TABLE WITHOUT ID file.link AS Discussion, concepts AS Concepts, date AS Date
FROM "4. Discuss" WHERE type = "discussion" AND status != "settled" SORT date DESC
```

## Settled
```dataview
TABLE WITHOUT ID file.link AS Discussion, concepts AS Concepts, date AS Date
FROM "4. Discuss" WHERE type = "discussion" AND status = "settled" SORT date DESC
```
