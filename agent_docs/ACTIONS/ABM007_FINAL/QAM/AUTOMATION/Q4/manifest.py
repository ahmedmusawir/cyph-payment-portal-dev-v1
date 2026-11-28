"""Pin working-tree candidates, make isolated copies, and verify a later Director commit read-only."""
import argparse
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
from pathlib import Path, PurePosixPath

PORTAL = Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1')
ROOTS = {'ob': PORTAL.parent / 'cyph-v1-dev', 'pp': PORTAL}
BASE = {'ob': '2e91e90905b2d9907577a64985e643f7827019ac',
        'pp': 'fc1fa6c2a90ebf59987287ad765e2e65cf635549'}
MODULE = PORTAL / 'agent_docs/ACTIONS/ABM007_FINAL'
ENG = MODULE / 'EVIDENCE/RWO01'
EVIDENCE = MODULE / 'QAM/evidence/Q4/01'
CLEAN = Path('/tmp/abm007-final-cody-q4')
BRANCH = 'qa/abm007-final'

def git(root, *args):
    return subprocess.check_output(['git', '--no-optional-locks', '-C', str(root), *args])

def git_names(root, *args):
    return set(git(root, *args).decode().rstrip('\0').split('\0')) - {''}

def sha(data):
    return hashlib.sha256(data).hexdigest()

def excluded(name):
    path = PurePosixPath(name)
    return (any(part in {'QAM', 'node_modules', '.next', '.git', '.turbo'} or part.startswith('.env')
                for part in path.parts) or path.suffix.lower() in {'.pem', '.key', '.p12', '.pfx'})

def paths_from_list(name):
    return set((ENG / name).read_text().splitlines()) - {''}

def repair_set(app, repo):
    actual = git_names(repo, 'diff', '--name-only', '-z', 'HEAD') | git_names(repo, 'ls-files', '--others', '--exclude-standard', '-z')
    actual = {p for p in actual if not p.startswith('agent_docs/ACTIONS/ABM007_FINAL/QAM/')}
    expected = paths_from_list('STAGING_LIST_owedbook.txt' if app == 'ob' else 'STAGING_LIST_portal.txt')
    if app == 'pp':
        expected |= paths_from_list('STAGING_LIST_portal_optional.txt')
    assert actual == expected, {'app':app,'unexpected': sorted(actual-expected),'missing':sorted(expected-actual)}
    assert not git_names(repo, 'diff', '--cached', '--name-only', '-z')
    assert all(not excluded(p) for p in expected)
    return expected

def protected_review(app, repo, paths):
    rec = {'CHANGELOG.md', 'agent_docs/SESSIONS/session_2026-11-26.md'} if app=='ob' else {
        'CHANGELOG.md', 'RECOVERY.md', 'session_2026-11-26.md',
        'agent_docs/ACTIONS/ABM007_FINAL/ABM_RULINGS.md',
        'agent_docs/ACTIONS/ABM007_FINAL/ABM_STATE.md',
        'agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/CHANGED_LABELS.md'}
    prod = ({'src/app/(public)/HomePageContent.tsx','src/app/profile/ProfileForm.tsx',
        'src/components/admin-portal/ScreenHeader.tsx','src/components/auth/LoginForm.tsx',
        'src/components/global/MobileNav.tsx','src/components/global/Navbar.tsx','src/components/global/UserMenu.tsx',
        'src/components/help/HelpPage.tsx','src/components/owedbook/OwedBookScreen.tsx',
        'src/components/ui/input.tsx','src/components/ui/password-input.tsx'} if app=='ob' else {
        'src/components/portal/Footer.tsx','src/components/portal/FormField.tsx','src/components/portal/PublicShell.tsx',
        'src/components/portal/account/StoreRemovalControl.tsx','src/components/ui/input.tsx'})
    changed_doc = (ENG/'CHANGED_FILES.md').read_text()
    for p in paths:
        if p.startswith('src/'):
            assert (p in prod or p.startswith('src/__tests__/')) and ('`'+p+'`') in changed_doc,p
        else:
            assert p in rec or (app=='pp' and p.startswith(('agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/', 'agent_docs/RESPONSES/response_2026-11-26_'))),p
    if app=='pp':
        old=git(repo,'show',BASE[app]+':RECOVERY.md')
        new=(repo/'RECOVERY.md').read_bytes()
        marker=b'## \xe2\x96\xb6 PAYMENT PORTAL ALPHA'
        before,after=old.split(marker,1)
        a,b=new.split(marker,1)
        assert after==b and a.startswith(before)
        block=a[len(before):].decode()
        assert block.startswith('## ▶ ABM007_FINAL') and block.count('\n## ')==0 and block.count('\n')==10
    return {'sourceAndTests':sorted(p for p in paths if p.startswith('src/')),
            'recordsAndEvidence':sorted(p for p in paths if not p.startswith('src/')),
            'recovery':'AM-22 (3), one inserted record block with all prior bytes preserved' if app=='pp' else 'unchanged',
            'noRulingOutsideAllowedPaths':True}

def data_for(path):
    info=path.lstat()
    if stat.S_ISLNK(info.st_mode):
        raw=os.fsencode(os.readlink(path))
        return {'sha256':sha(raw),'size':len(raw),'executable':False,'kind':'symlink'}
    if not stat.S_ISREG(info.st_mode):
        raise ValueError('Non-regular tracked path: '+str(path))
    raw=path.read_bytes()
    return {'sha256':sha(raw),'size':len(raw),'executable':bool(info.st_mode & 0o111)}

def pinned(app):
    path=EVIDENCE/f'{app}-manifest.json'
    content=path.read_bytes()
    return json.loads(content),sha(content)

def freeze(app):
    repo=ROOTS[app]
    assert git(repo,'branch','--show-current').decode().strip()==BRANCH
    assert git(repo,'rev-parse','HEAD').decode().strip()==BASE[app]
    changes=repair_set(app,repo)
    review=protected_review(app,repo,changes)
    include=sorted({p for p in git_names(repo, 'ls-files', '--cached', '-z') | changes if not excluded(p)})
    rows={p:data_for(repo/p) for p in include}
    doc={'app':app,'branch':BRANCH,'base':BASE[app],'changedPaths':sorted(changes),'files':rows}
    path=EVIDENCE/f'{app}-manifest.json'
    with path.open('x') as f:
        json.dump(doc,f,sort_keys=True,indent=2); f.write('\n')
    root=CLEAN/app
    root.mkdir(parents=True,exist_ok=False)
    for p in include:
        target=root/p
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(repo/p,target,follow_symlinks=False)
    assert all(data_for(root/p)==row for p,row in rows.items())
    actual={p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_symlink() or p.is_file()}
    assert actual==set(include)
    for p in changes:
        assert data_for(repo/p)==rows[p]
    (EVIDENCE/f'{app}-path-review.json').write_text(json.dumps(review,indent=2)+'\n')
    # Record the independent review of tracked changes. New record artifacts are hashed in the manifest.
    diff=git(repo,'diff','--no-ext-diff','--binary',BASE[app],'--','.',':(exclude)agent_docs/ACTIONS/ABM007_FINAL/QAM/**')
    (EVIDENCE/f'{app}-tracked-repair.diff').write_bytes(diff)
    print(json.dumps({'app':app,'manifestSha256':sha(path.read_bytes()),'files':len(rows),'changedPaths':len(changes),'copyMatches':True}))

def compare(app, copy_name=None, commit=None):
    doc,manifest=pinned(app)
    repo=ROOTS[app]
    if commit:
        result=subprocess.run(['git','--no-optional-locks','-C',str(repo),'merge-base','--is-ancestor',doc['base'],commit])
        assert result.returncode==0 and git(repo,'rev-parse',commit).decode().strip()!=doc['base']
        listed=git(repo,'ls-tree','-r','-z',commit).decode().split('\0')
        runtime={x.split('\t',1)[1]:x.split()[0] for x in listed if x and not excluded(x.split('\t',1)[1])}
        wrong=set(runtime)^set(doc['files'])
        for p, row in doc['files'].items():
            if p in wrong: continue
            b=git(repo,'show',commit+':'+p)
            if sha(b)!=row['sha256'] or runtime[p]!=('120000' if row.get('kind')=='symlink' else '100755' if row['executable'] else '100644'): wrong.add(p)
    else:
        assert git(repo,'branch','--show-current').decode().strip()==BRANCH
        assert git(repo,'rev-parse','HEAD').decode().strip()==doc['base']
        assert repair_set(app,repo)==set(doc['changedPaths'])
        target=CLEAN/(copy_name or app)
        wrong={p for p,row in doc['files'].items() if not ((repo/p).is_symlink() or (repo/p).is_file()) or not ((target/p).is_symlink() or (target/p).is_file())
               or data_for(repo/p)!=row or data_for(target/p)!=row}
        # Generated build/dependency output may exist. Source excludes cannot appear in the served copy.
        for folder in ('src','public','supabase'):
            for p in (target/folder).rglob('*'):
                if p.is_file() and p.relative_to(target).as_posix() not in doc['files']:
                    wrong.add(p.relative_to(target).as_posix())
        wrong.update(p.name for p in target.glob('.env*'))
    print(json.dumps({'app':app,'manifest':manifest,'files':len(doc['files']),'commit':commit,'mismatches':sorted(wrong)}))
    if wrong:
        raise SystemExit(1)

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('action',choices=['freeze','check','post-commit'])
    parser.add_argument('app',choices=list(ROOTS))
    parser.add_argument('--copy')
    parser.add_argument('--commit',default='HEAD')
    args=parser.parse_args()
    if args.action=='freeze':
        freeze(args.app)
    else:
        compare(args.app,args.copy,args.commit if args.action=='post-commit' else None)
