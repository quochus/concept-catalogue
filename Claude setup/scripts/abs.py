import sys,subprocess,re,os
sys.path.insert(0,os.path.expanduser('~/mnt/concept-catalogue/Claude setup/scripts'))
import zcat
for arg in sys.argv[1:]:
    att,pages,rx=arg.split(':',2); rx=re.compile(rx,re.I)
    p=zcat.pdfpath(att); a,b=(pages.split('-')+[pages])[:2]
    print('=====',att, zcat.printed_guess(zcat.pagetext(p,int(a)),zcat.page_range(att),int(a)))
    for i in range(int(a),int(b)+1):
        t=subprocess.run(["pdftotext","-f",str(i),"-l",str(i),p,"-"],capture_output=True,text=True).stdout
        t=re.sub(r'­\s*','',t); t=re.sub(r'-\n(?=[a-z])','',t); t=re.sub(r'\s+',' ',t)
        for s in re.split(r'(?<=[.!?])\s+',t):
            if rx.search(s) and 30<len(s)<380: print(f"[p{i}] {s}")
