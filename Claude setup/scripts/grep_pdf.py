import sys,subprocess,re,sqlite3,os
sys.path.insert(0,os.path.expanduser('~/mnt/concept-catalogue/Claude setup/scripts'))
import zcat
att=sys.argv[1]; rx=re.compile(sys.argv[2],re.I); maxp=int(sys.argv[3]) if len(sys.argv)>3 else 40
p=zcat.pdfpath(att); n=zcat.npages(p) or 1
for i in range(1,min(n,maxp)+1):
    t=subprocess.run(["pdftotext","-f",str(i),"-l",str(i),p,"-"],capture_output=True,text=True).stdout
    t=re.sub(r'-\n(?=[a-z])','',t); t=re.sub(r'\s+',' ',t)
    for s in re.split(r'(?<=[.!?])\s+',t):
        if rx.search(s) and len(s)<450: print(f"[p{i}] {s}")
