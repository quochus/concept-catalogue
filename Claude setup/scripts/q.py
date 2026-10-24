import sys,subprocess,re,os
sys.path.insert(0,os.path.expanduser('~/mnt/concept-catalogue/Claude setup/scripts'))
import zcat
for arg in sys.argv[1:]:
    att,pages,rx=arg.split(':',2); rx=re.compile(rx,re.I)
    p=zcat.pdfpath(att)
    if not p: print('NOPDF',att); continue
    n=zcat.npages(p); a,b=(pages.split('-')+[pages])[:2]; a=int(a); b=min(int(b),n)
    rng=zcat.page_range(att)
    print(f'===== {att} ({n}pp, range {rng})')
    for i in range(a,b+1):
        t=zcat.pagetext(p,i,layout=False)
        t=re.sub(r'­\s*','',t); t=re.sub(r'-\n(?=[a-z])','',t); t=re.sub(r'\s+',' ',t)
        pg=zcat.printed_guess(zcat.pagetext(p,i),rng,i)
        for s in re.split(r'(?<=[.!?])\s+',t):
            if rx.search(s) and 30<len(s)<330: print(f"[{i}|{pg}] {s}")
