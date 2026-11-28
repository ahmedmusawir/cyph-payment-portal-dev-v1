"""Pin A2 working trees, prove the repair delta, and verify served or committed files."""
from pathlib import Path
import argparse
import hashlib
import json
import runpy
import shutil
import sys

qa=Path(__file__).resolve().parents[2]
prior=runpy.run_path(str(qa/'AUTOMATION/Q4/manifest.py'))
roots=prior['ROOTS']
base=prior['BASE']
git=prior['git']
names=prior['git_names']
excluded=prior['excluded']
file_data=prior['data_for']
branch=prior['BRANCH']
eng=prior['ENG']
old_dir=qa/'evidence/Q4/01'
out=qa/'evidence/Q4/A2'
clean=Path('/tmp/abm007-final-cody-q4-a2')
expected_src={'ob':{'src/components/help/HelpPage.tsx','src/__tests__/abm007/help-page.test.tsx'},'pp':set()}
old_hashes={'ob':'f229d7a129138af7cc97e1fdb5acadf885c1907ad7cd3c140f4bad5334a4d22d',
            'pp':'ba726f5ea3f5bf2cdd8156a16360e7674be2da500be48c81cacac19ba682c4b9'}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def lists(app):
    if app=='ob':
        paths=['STAGING_LIST_owedbook.txt']
    else:
        paths=['STAGING_LIST_portal.txt','STAGING_LIST_portal_optional.txt']
    return {line.strip() for p in paths for line in (eng/p).read_text().splitlines() if line.strip()}

def working(app):
    root=roots[app]
    assert git(root,'branch','--show-current').decode().strip()==branch
    assert git(root,'rev-parse','HEAD').decode().strip()==base[app]
    assert not names(root,'diff','--cached','--name-only','-z')
    changed=names(root,'diff','--name-only','-z','HEAD')|names(root,'ls-files','--others','--exclude-standard','-z')
    changed={name for name in changed if not any(part=='QAM' for part in Path(name).parts)}
    want=lists(app)
    assert changed==want, {'app':app,'unlisted':sorted(changed-want),'listedButAbsent':sorted(want-changed)}
    include=sorted(name for name in names(root,'ls-files','--cached','-z')|changed if not excluded(name))
    return {'app':app,'branch':branch,'base':base[app],'changedPaths':sorted(changed),
            'files':{p:file_data(root/p) for p in include}}

def is_record(path):
    return (path=='CHANGELOG.md' or path.startswith('session_2026-11-')
            or path.startswith('agent_docs/SESSIONS/session_2026-11-')
            or path in {'agent_docs/ACTIONS/ABM007_FINAL/ABM_STATE.md','agent_docs/ACTIONS/ABM007_FINAL/ABM_RULINGS.md',
                        'agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/CHANGED_LABELS.md'}
            or path.startswith(('agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/',
                                'agent_docs/RESPONSES/response_2026-11-27_')))

def compare_old(app, doc):
    raw=(old_dir/f'{app}-manifest.json').read_bytes()
    assert digest(raw)==old_hashes[app]
    old=json.loads(raw)['files']
    new=doc['files']
    delta={p for p in old.keys()|new.keys() if old.get(p)!=new.get(p)}
    src={p for p in delta if p.startswith('src/')}
    non_records={p for p in delta if not p.startswith('src/') and not is_record(p)}
    unchanged=sorted(p for p in old.keys()&new.keys() if p.startswith('src/') and old[p]==new[p])
    assert src==expected_src[app] and not non_records, {'app':app,'src':sorted(src),'unruled':sorted(non_records)}
    assert old['RECOVERY.md']==new['RECOVERY.md']
    return {'app':app,'oldManifest':old_hashes[app],'changedPaths':len(doc['changedPaths']),
            'unchangedProductOrTestCount':len(unchanged),'unchangedProductOrTestPaths':unchanged,
            'delta':[{'path':p,'kind':'product/test' if p in src else 'record','before':old.get(p),'after':new.get(p)} for p in sorted(delta)],
            'protectedDelta':[], 'recovery':'unchanged from Q4, including the existing AM-22 (3) Portal record insertion'}

def verify_copy(app,doc):
    target=clean/app
    wrong=[p for p,want in doc['files'].items() if not (target/p).is_file() and not (target/p).is_symlink()
           or file_data(target/p)!=want]
    for folder in ('src','public','supabase'):
        for p in (target/folder).rglob('*'):
            if (p.is_file() or p.is_symlink()) and p.relative_to(target).as_posix() not in doc['files']:
                wrong.append(p.relative_to(target).as_posix())
    wrong.extend(p.name for p in target.glob('.env*'))
    return sorted(wrong)

def freeze():
    docs={app:working(app) for app in roots}
    review={app:compare_old(app,doc) for app,doc in docs.items()}
    clean.mkdir(exist_ok=False)
    for app,doc in docs.items():
        payload=json.dumps(doc,sort_keys=True,indent=2).encode()+b'\n'
        with (out/f'{app}-manifest.json').open('xb') as f:
            f.write(payload)
        target=clean/app
        target.mkdir()
        for p in doc['files']:
            to=target/p
            to.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(roots[app]/p,to,follow_symlinks=False)
        assert verify_copy(app,doc)==[]
        review[app]['newManifest']=digest(payload)
        review[app]['fileCount']=len(doc['files'])
    with (out/'entry-comparison.json').open('x') as f:
        json.dump(review,f,indent=2)
    for app,row in review.items():
        print(app,row['newManifest'],'paths',row['changedPaths'],'all files',row['fileCount'],
              'unchanged src',row['unchangedProductOrTestCount'],
              'changed src',[d['path'] for d in row['delta'] if d['kind']=='product/test'],
              'record delta',sum(d['kind']=='record' for d in row['delta']))

def check(app,commit):
    raw=(out/f'{app}-manifest.json').read_bytes()
    doc=json.loads(raw)
    if commit:
        root=roots[app]
        assert git(root,'rev-parse',commit).decode().strip()!=doc['base']
        git(root,'merge-base','--is-ancestor',doc['base'],commit)
        entries=git(root,'ls-tree','-r','-z',commit).decode().strip('\0').split('\0')
        modes={n.split('\t',1)[1]:n.split()[0] for n in entries if not excluded(n.split('\t',1)[1])}
        wrong=set(modes)^set(doc['files'])
        for name in set(modes)&set(doc['files']):
            row=doc['files'][name]
            want='120000' if row.get('kind')=='symlink' else '100755' if row['executable'] else '100644'
            if modes[name]!=want or digest(git(root,'show',commit+':'+name))!=row['sha256']:
                wrong.add(name)
    else:
        actual=working(app)
        rows=doc['files']
        wrong={p for p in actual['files'].keys()|rows.keys() if actual['files'].get(p)!=rows.get(p)}
        wrong.update(verify_copy(app,doc))
        assert actual['changedPaths']==doc['changedPaths']
    print(json.dumps({'app':app,'manifest':digest(raw),'files':len(doc['files']),'commit':commit,'mismatches':sorted(wrong)}))
    if wrong:
        sys.exit(1)

parser=argparse.ArgumentParser()
parser.add_argument('action',choices=('freeze','check','post-commit'))
parser.add_argument('app',nargs='?',choices=tuple(roots))
parser.add_argument('--copy')
parser.add_argument('--commit',default='HEAD')
args=parser.parse_args()
if args.action=='freeze':
    freeze()
else:
    assert args.app and (not args.copy or args.copy==args.app)
    check(args.app,args.commit if args.action=='post-commit' else None)
