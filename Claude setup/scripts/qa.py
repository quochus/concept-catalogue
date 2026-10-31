import re,sys,os,subprocess
sys.path.insert(0,os.path.expanduser('~/mnt/concept-catalogue/Claude setup/scripts'))
import zcat
f=sys.argv[1]; s=open(f,encoding='utf-8').read()
ev=s[s.index('## Evidence'):]
rows=[r for r in ev.split('\n') if re.match(r'\| E\d+ \|',r)]
bad=0; evq=set()
for r in rows:
    c=[x.strip() for x in r.split('|')[1:-1]]
    q=c[4].strip().strip('*').strip('"'); evq.add(zcat.norm(q))
    m=re.search(r'items/([A-Z0-9]{8})\?page=(\d+)',c[6])
    if not m: print('NOLINK',c[0]); bad+=1; continue
    p=zcat.pdfpath(m.group(1)); n=int(m.group(2))
    ok=zcat.norm(q) in zcat.norm(zcat.pagetext(p,n)) or zcat.norm(q) in zcat.norm(zcat.pagetext(p,n,layout=False))
    if not ok or len(q.split())>=15: print('FAIL',c[0],len(q.split()),q); bad+=1
# quotes in body not in evidence
body=s[s.index('## Definitions'):s.index('## Key sources')]
body=re.sub(r'## Own works.*?## Comparison','## Comparison',body,flags=re.S)
for q in [x for x in re.findall(r"\"([^\"]+)\"",body) if len(x.split())>2 and "Discuss" not in x]:
    if zcat.norm(q) not in evq and not any(zcat.norm(q) in e or e in zcat.norm(q) for e in evq): print('BODY-QUOTE-NOT-IN-EVIDENCE:',q); bad+=1
# cited authors in body vs key sources
ks=s[s.index('## Key sources'):s.index('## Evidence')]
surn=set(re.findall(r'^- ([^,]+),',ks,re.M))
cites=set(re.findall(r'([A-ZÀ-Ž][\w\-À-ž]+)(?: et al\.| & [A-ZÀ-Ž][\w\-À-ž]+)?,? \(?\d{4}',body))
print('rows',len(rows),'bad',bad,'keysources',len(re.findall(r'^- ',ks,re.M)))
print('cited surnames not in key sources:',sorted(c for c in cites if not any(c in k for k in surn)))
print('links:',sorted(set(re.findall(r'\[\[([^\]|]+)',s))))
