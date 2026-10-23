import sys,os
def head(fm, first="*Skipped by Quoc (2026-10-22) to save time; can be added later. Never edited by Claude.*\n\n(skipped)"):
    return fm.strip()+"\n\n## My first take\n"+first+"\n\n"
TAIL='''## In my words
*One sentence, written by me.*



## Discussions
```dataview
LIST FROM [[]] AND "4. Discuss" SORT file.name DESC
```

'''
def write(name, fm, body, own, comparison, refs):
    p=os.path.expanduser(f'~/mnt/concept-catalogue/3. Concepts/{name}.md')
    assert not os.path.exists(p), 'exists: '+p
    page=head(fm)+body.strip()+"\n\n## Own works\n"+own.strip()+"\n\n## Comparison with my first take\n"+comparison.strip()+"\n\n"+TAIL+refs.strip()+"\n"
    open(p,'w',encoding='utf-8').write(page); print('written',p)
