#!/usr/bin/env python3
"""Zotero helper for the concept catalogue (read-only).

Run on the laptop shell (device_bash):
  python3 "$HOME/mnt/concept-catalogue/Claude setup/scripts/zcat.py" <command> ...

Commands
  search PATTERN [--abs]        regex on titles (and abstracts with --abs): parent key, year, first author, title, PDF keys
  apa KEY [KEY ...]             APA 7 reference line(s) + Zotero link, for Key sources (sorted A-Z)
  pdf KEY                       PDF path(s) and attachment key(s) for a parent key
  page ATTKEY N                 text of PDF page N (1-based index), with a guess of the printed page number
  quote ATTKEY N "QUOTE"        check that QUOTE occurs on PDF page N (normalised match); prints OK or NOT FOUND
  check FILE.md                 check every Zotero key in a concept page: exists, parent vs attachment, PDF pages in range

The database is copied to ~/zt first (Zotero locks the live file); the copy is refreshed when older than 1 hour.
"""
import os, re, sys, shutil, sqlite3, subprocess, time, unicodedata

ZDIR = os.path.expanduser("~/mnt/Zotero")
COPY = os.path.expanduser("~/zt")
DB = os.path.join(COPY, "zotero.sqlite")


def db():
    os.makedirs(COPY, exist_ok=True)
    if not os.path.exists(DB) or time.time() - os.path.getmtime(DB) > 3600:
        for f in ("zotero.sqlite", "zotero.sqlite-wal"):
            src = os.path.join(ZDIR, f)
            if os.path.exists(src):
                shutil.copy2(src, os.path.join(COPY, f))
        os.utime(DB, None)
    return sqlite3.connect(DB)


C = None


def con():
    global C
    if C is None:
        C = db()
    return C


def item(key):
    r = con().execute("select i.itemID, t.typeName from items i join itemTypes t using(itemTypeID) "
                      "where i.key=? and i.itemID not in (select itemID from deletedItems)", (key,)).fetchone()
    return r


def fields(iid):
    return {f: v for f, v in con().execute(
        "select f.fieldName, v.value from itemData d join fields f using(fieldID) "
        "join itemDataValues v using(valueID) where d.itemID=?", (iid,))}


def creators(iid, kinds=("author",)):
    rows = con().execute(
        "select cr.lastName, cr.firstName, cr.fieldMode, ct.creatorType from itemCreators ic "
        "join creators cr using(creatorID) join creatorTypes ct using(creatorTypeID) "
        "where ic.itemID=? order by ic.orderIndex", (iid,)).fetchall()
    out = [r for r in rows if r[3] in kinds]
    return out


def attachments(iid):
    return con().execute(
        "select a2.key, a.path from itemAttachments a join items a2 on a2.itemID=a.itemID "
        "where a.parentItemID=? and a.contentType='application/pdf'", (iid,)).fetchall()


def pdfpath(attkey):
    r = con().execute("select a.path from itemAttachments a join items i on i.itemID=a.itemID where i.key=?",
                      (attkey,)).fetchone()
    if not r or not r[0]:
        return None
    p = r[0]
    if p.startswith("storage:"):
        return os.path.join(ZDIR, "storage", attkey, p[len("storage:"):])
    return p


# ---------- APA 7 ----------
def initials(first):
    parts = re.split(r"\s+", first.strip())
    out = []
    for p in parts:
        if not p:
            continue
        sub = [s for s in p.split("-") if s]
        out.append("-".join(s[0].upper() + "." for s in sub if s[0].isalpha()))
    return " ".join(x for x in out if x)


def name(c):
    last, first, mode = c[0], c[1], c[2]
    if mode == 1 or not first:
        return last
    return f"{last}, {initials(first)}"


def authors_apa(cs):
    n = [name(c) for c in cs]
    if not n:
        return ""
    if len(n) == 1:
        return n[0]
    if len(n) == 2:
        return f"{n[0]}, & {n[1]}"
    if len(n) <= 20:
        return ", ".join(n[:-1]) + ", & " + n[-1]
    return ", ".join(n[:19]) + ", . . . " + n[-1]


def editors_apa(cs):
    n = []
    for c in cs:
        n.append(c[0] if (c[2] == 1 or not c[1]) else f"{initials(c[1])} {c[0]}")
    if not n:
        return ""
    s = n[0] if len(n) == 1 else (" & ".join(n) if len(n) == 2 else ", ".join(n[:-1]) + ", & " + n[-1])
    return s + (" (Ed.)" if len(n) == 1 else " (Eds.)")


def dash(p):
    return p.replace("--", "–").replace("-", "–") if p else p


def end(s):
    s = s.strip()
    return s if s.endswith((".", "?", "!")) else s + "."


def link(f):
    if f.get("DOI"):
        d = re.sub(r"^https?://(dx\.)?doi\.org/", "", f["DOI"].strip())
        return f"https://doi.org/{d}"
    return f.get("url", "")


def apa(key):
    r = item(key)
    if not r:
        return None, f"[{key}: not found]"
    iid, typ = r
    if typ in ("attachment", "note"):
        p = con().execute("select parentItemID from itemAttachments where itemID=?", (iid,)).fetchone()
        return None, f"[{key} is an attachment key; use the parent key]"
    f = fields(iid)
    au = authors_apa(creators(iid, ("author", "presenter", "programmer", "artist", "contributor")))
    if not au:
        au = f.get("institution") or f.get("publisher") or ""
    yr = re.search(r"\d{4}", f.get("date", ""))
    yr = yr.group(0) if yr else "n.d."
    title = f.get("title", "").strip()
    L = link(f)
    warn = ""
    words = [w for w in re.findall(r"[A-Za-z][A-Za-z'-]+", title) if len(w) > 3]
    if words and sum(w[0].isupper() for w in words) / len(words) > 0.6:
        warn = "  <!-- check: title may need sentence case -->"
    if typ == "journalArticle":
        j = f.get("publicationTitle", "")
        vol, iss, pg = f.get("volume", ""), f.get("issue", ""), dash(f.get("pages", ""))
        src = f"*{j}*"
        if vol:
            src = f"*{j}, {vol}*" + (f"({iss})" if iss else "")
        if pg:
            src += f", {pg}"
        ref = f"{end(au)} ({yr}). {end(title)} {end(src)}"
    elif typ == "book":
        ed = f" ({f['edition']} ed.)" if f.get("edition") else ""
        ref = f"{end(au)} ({yr}). *{title}*{ed}. {end(f.get('publisher', ''))}"
    elif typ == "bookSection":
        eds = editors_apa(creators(iid, ("editor",)))
        pg = dash(f.get("pages", ""))
        inn = f"In {eds + ', ' if eds else ''}*{f.get('bookTitle', '')}*" + (f" (pp. {pg})" if pg else "")
        ref = f"{end(au)} ({yr}). {end(title)} {end(inn)} {end(f.get('publisher', ''))}"
    elif typ == "report":
        num = f" ({f['reportNumber']})" if f.get("reportNumber") else ""
        inst = f.get("institution", "")
        ref = f"{end(au)} ({yr}). *{title}*{num}." + (f" {end(inst)}" if inst and inst != au else "")
    elif typ == "thesis":
        kind = f.get("thesisType", "Doctoral dissertation")
        ref = f"{end(au)} ({yr}). *{title}* [{kind}, {f.get('university', '')}]."
    elif typ == "conferencePaper":
        ref = f"{end(au)} ({yr}). {end(title)} {end('*' + f.get('proceedingsTitle', f.get('conferenceName', '')) + '*')}"
    else:
        site = f.get("websiteTitle") or f.get("publisher") or f.get("publicationTitle") or ""
        ref = f"{end(au)} ({yr}). *{title}*." + (f" {end(site)}" if site else "")
    ref = re.sub(r"\.\.+", ".", ref).replace(" .", ".").strip()
    if L:
        ref += f" {L}"
    sortkey = unicodedata.normalize("NFKD", (au or title)).lower() + yr
    return sortkey, f"- {ref} — ROLE — [Zotero](zotero://select/library/items/{key}){warn}"


# ---------- PDF text ----------
def pagetext(path, n):
    return subprocess.run(["pdftotext", "-layout", "-f", str(n), "-l", str(n), path, "-"],
                          capture_output=True, text=True).stdout


def npages(path):
    out = subprocess.run(["pdfinfo", path], capture_output=True, text=True).stdout
    m = re.search(r"Pages:\s+(\d+)", out)
    return int(m.group(1)) if m else None


def norm(s):
    s = unicodedata.normalize("NFKC", s)
    s = s.replace("­", "")
    s = re.sub(r"-\s*\n\s*", "", s)
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", " ", s).strip().lower()


def page_range(attkey):
    r = con().execute("select a.parentItemID from itemAttachments a join items i on i.itemID=a.itemID where i.key=?",
                      (attkey,)).fetchone()
    if not r or not r[0]:
        return None
    pg = fields(r[0]).get("pages", "")
    m = re.match(r"\s*(\d+)\s*[-–]+\s*(\d+)", pg)
    return (int(m.group(1)), int(m.group(2))) if m else None


def printed_guess(t, rng=None, n=None):
    """Printed page number: a number in the page header/footer lines that falls inside the article's page range.
    Without a match, estimate start + n - 1 and mark it (est.). Always confirm by eye before citing."""
    lines = [l.strip() for l in t.splitlines() if l.strip()]
    cand = lines[:4] + lines[-4:]
    nums = [int(x) for l in cand for x in re.findall(r"\b\d{1,4}\b", l)]
    if rng:
        hits = [x for x in nums if rng[0] <= x <= rng[1]]
        if hits:
            return str(hits[0])
        if n:
            est = rng[0] + n - 1
            return f"{est} (est.)" if est <= rng[1] else "?"
    return "?"


def main():
    if len(sys.argv) < 2:
        print(__doc__); return
    cmd, a = sys.argv[1], sys.argv[2:]
    if cmd == "search":
        rx = re.compile(a[0], re.I)
        rows = con().execute("""select i.key, i.itemID from items i join itemTypes t using(itemTypeID)
            where t.typeName not in ('attachment','note','annotation') and i.itemID not in (select itemID from deletedItems)""").fetchall()
        for key, iid in rows:
            f = fields(iid)
            t = f.get("title", "")
            if rx.search(t) or ("--abs" in a and rx.search(f.get("abstractNote", ""))):
                au = creators(iid)
                yr = (re.search(r"\d{4}", f.get("date", "")) or [None])
                yr = yr.group(0) if hasattr(yr, "group") else "n.d."
                att = ",".join(k for k, _ in attachments(iid)) or "-"
                print(f"{key}\t{yr}\t{au[0][0] if au else '-'}\t{t[:110]}\tPDF:{att}")
    elif cmd == "apa":
        out = [apa(k) for k in a]
        for s, line in sorted(out, key=lambda x: x[0] or ""):
            print(line)
    elif cmd == "pdf":
        r = item(a[0])
        for k, p in attachments(r[0]):
            print(k, pdfpath(k))
    elif cmd == "page":
        p = pdfpath(a[0]); t = pagetext(p, int(a[1]))
        print(f"[PDF page {a[1]} of {npages(p)}; printed page guess: {printed_guess(t, page_range(a[0]), int(a[1]))}]\n{t}")
    elif cmd == "quote":
        p = pdfpath(a[0]); n = int(a[1]); q = a[2]
        t = pagetext(p, n)
        ok = norm(q) in norm(t)
        words = len(q.split())
        print(("OK" if ok else "NOT FOUND") + f" | {words} words" + (" | TOO LONG (must be < 15)" if words >= 15 else "")
              + f" | printed page guess: {printed_guess(t, page_range(a[0]), n)}")
        if not ok:
            for m in (n - 1, n + 1):
                if m >= 1 and norm(q) in norm(pagetext(p, m)):
                    print(f"  found on PDF page {m} instead")
    elif cmd == "check":
        txt = open(a[0], encoding="utf-8").read()
        for kind, key, page in re.findall(r"zotero://(select|open-pdf)/library/items/([A-Z0-9]{8})(?:\?page=(\d+))?", txt):
            r = item(key)
            if not r:
                print(f"MISSING  {kind} {key}"); continue
            typ = r[1]
            if kind == "select" and typ == "attachment":
                print(f"WARN     select link uses attachment key {key}")
            elif kind == "open-pdf" and typ != "attachment":
                print(f"WRONG    open-pdf link uses parent key {key} (needs attachment key)")
            elif kind == "open-pdf":
                n = npages(pdfpath(key)) if pdfpath(key) else None
                if page and n and int(page) > n:
                    print(f"WRONG    {key} page {page} > {n} pages")
        print("check done")
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
