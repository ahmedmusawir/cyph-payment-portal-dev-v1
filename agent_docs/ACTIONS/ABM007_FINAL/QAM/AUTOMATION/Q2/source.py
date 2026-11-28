from pathlib import Path
import re,json,hashlib,subprocess,shutil
q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM');out=q/'evidence/Q2/03';out.mkdir(parents=True,exist_ok=True)
patterns={'hex':r'(?<![\w&/])#(?:[\da-fA-F]{8}|[\da-fA-F]{6}|[\da-fA-F]{3})(?![\w-])','rgb':r'\brgba?\(','hsl':r'\bhsla?\((?!\s*var\()','utility':r'\b(?:bg|text|border|ring|fill|stroke|outline|divide|shadow|decoration|placeholder|accent|caret|from|via|to)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?![\w-])','arbitrary':r'\b(?:bg|text|border|ring|fill|stroke|outline|decoration)-\[(?:#|rgb|hsl(?!\(var))'}
def scan(s):
 return [{'line':i,'kind':k,'match':m.group()} for i,l in enumerate(s.splitlines(),1) for k,rx in patterns.items() for m in re.finditer(rx,l)]
def protected(p):return p.startswith(('src/server/','src/app/api/','src/utils/supabase/','src/services/auth/','supabase/migrations/','scripts/')) or p in ['RECOVERY.md','package.json','package-lock.json','pnpm-lock.yaml','src/proxy.ts','src/lib/appIdentity.ts','supabase/setup.sql','deploy.sh','Dockerfile','cloudbuild.yaml'] or p.startswith('.env')
def forbidden(s):return bool(re.search(r'4242(?:[ -]?4242){3}|ENGINEERING_|tester[_ -]?alias|\bQA\b|cyber\s*pharma',s,re.I))
controls={'color_fail':len(scan('#123456 rgb(1,2,3) text-white bg-red-500'))>=4,'color_pass':not scan('text-foreground bg-card hsl(var(--primary))'),'anchor_color_same_line':bool(scan('<a href="#main" className="text-white">')),'protected_fail':protected('src/app/api/seed/route.ts'),'protected_pass':not protected('src/components/ui/button.tsx'),'help_bad_card':forbidden('4242 4242 4242 4242'),'help_bad_alias':forbidden('ENGINEERING_TESTER'),'help_clean':not forbidden('Who can do what')}
logo_expected='e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd'
controls['logo_mutation_fails']=hashlib.sha256(b'seeded changed logo').hexdigest()!=logo_expected
(out/'source-controls.json').write_text(json.dumps(controls,indent=2));assert all(controls.values())
token=(q.parent/'DESIGN/tokens/abm007_final_tokens.css').read_text()
def declarations(s):
 b=re.search(r':root\s*\{(.*?)\}',s,re.S).group(1);b=re.sub(r'/\*.*?\*/','',b,flags=re.S);return re.findall(r'(--[\w-]+)\s*:\s*([^;]+);',b)
report={}
for app,name,base,sha in [('ob','cyph-v1-dev','9597699b404afdbcd792a9b4da61c21abb10cdf8','2e91e90905b2d9907577a64985e643f7827019ac'),('pp','cyph-payment-portal-dev-v1','cb4decde9adc9ab75d0dcb15556c64a3bdbfe075','fc1fa6c2a90ebf59987287ad765e2e65cf635549')]:
 repo=Path('/home/moose/NEXTJS/CYBER_PHARMA')/name;copy=Path('/tmp/abm007-final-cody-q2')/app
 git=lambda *a:subprocess.check_output(['git','-C',str(repo),*a],text=True)
 assert git('rev-parse','HEAD').strip()==sha
 paths=git('diff','--name-only',base,sha).splitlines();(out/f'{app}-changed-paths.txt').write_text('\n'.join(paths)+'\n')
 hits=[];fonts=[];oldrefs=[];files=[]
 for p in sorted((copy/'src').rglob('*')):
  if not p.is_file() or p.suffix not in ['.ts','.tsx','.css','.scss'] or '__tests__' in p.parts:continue
  text=p.read_text();rel=str(p.relative_to(copy));files.append(rel)
  # Remove comments with line count preserved; no line-wide anchor exclusions.
  s=re.sub(r'/\*.*?\*/',lambda m:'\n'*m.group().count('\n'),text,flags=re.S)
  if p.name.startswith('globals.'):
   s=re.sub(r'\.dark\s*\{[^}]*\}',lambda m:'\n'*m.group().count('\n'),s,flags=re.S)
  for h in scan(s):hits.append({'path':rel,**h})
  for i,l in enumerate(text.splitlines(),1):
   if re.search(r'\bSaira\b|weight.*300|font-(?:thin|extralight|light)\b',l):fonts.append({'path':rel,'line':i,'source':l.strip()})
   if re.search(r'(?:src|href|url|import).*?(?:logo-?red|favicon-512|next\.svg|vercel\.svg|cyber.*logo)',l,re.I):oldrefs.append({'path':rel,'line':i,'source':l.strip()})
 assert files
 logos=[{'path':str(p.relative_to(copy)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in (copy/'public').rglob('*') if p.is_file() and 'brand' in p.parts]
 sty=(copy/('src/app/globals.css' if app=='ob' else 'src/app/globals.scss')).read_text()
 rec={'sha':sha,'files_scanned':len(files),'token_declarations_equal':declarations(sty)==declarations(token),'color_candidates':hits,'font_candidates':fonts,'old_logo_candidates':oldrefs,'logo_files':logos,'derived_icons':{s:(copy/'src/app'/s).exists() for s in ['icon.png','apple-icon.png','favicon.ico']},'protected_changed':[p for p in paths if protected(p)],'candidate_to_head_diff':git('diff',sha,'HEAD'),'dependency_diff':git('diff',base,sha,'--','package.json','package-lock.json'),'source_limit':'Matches require semantic review; frozen dark token block excluded by D-01. No behavior inferred from names.'}
 if app=='ob':rec['preserved_RECOVERY_engineering_diff']=git('diff','c335671',sha,'--','RECOVERY.md')
 report[app]=rec
(out/'source-results.json').write_text(json.dumps(report,indent=2))
for name in ['install-ob.log','install-pp.log','build_ob_scratch.log','build_pp_scratch.log','build-result.json']:
 shutil.copyfile(Path('/tmp/abm007-final-cody-q2')/name,q/'evidence/Q2/01'/name)
print(json.dumps({k:{'files':v['files_scanned'],'tokens_equal':v['token_declarations_equal'],'color_candidates':len(v['color_candidates']),'protected':v['protected_changed'],'logo_matches':[x['path'] for x in v['logo_files'] if x['sha256']==logo_expected]} for k,v in report.items()},indent=2))
