#!/usr/bin/env python3
import os,json,getpass,datetime,urllib.parse,re,html
from pathlib import Path
os.umask(0o077)
root=Path(__file__).resolve().parent
if not str(root).startswith('/home/moose/.apbm007b/') or (root.stat().st_mode & 0o077):
 raise SystemExit('Run only the installed helper in the private0700QA directory.')
p=root/'q402_transfer_input.json'
print('Use the newest Payment Portal email for QA role NEW_ADMIN. Copy its sign-in link; do not click it.')
while True:
 value=getpass.getpass('Paste the copied link here (hidden), or type skip: ').strip()
 if value.lower()=='skip':data={'observer':'Tony','observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'declined':True,'link':''};break
 value=html.unescape(value.strip('<> '));u=urllib.parse.urlsplit(value);v=urllib.parse.parse_qs(u.query)
 if u.scheme=='http' and u.hostname=='localhost' and u.port==3101 and u.path=='/api/auth/confirm' and re.fullmatch(r'[A-Za-z0-9_-]{20,200}',v.get('token_hash',[''])[0]) and v.get('type',[''])[0] in ['email','magiclink']:
  data={'observer':'Tony','observed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'declined':False,'link':value};break
 print('Copy the newest Portal QA confirmation link. It was not saved or echoed; try again, or type skip.')
fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_TRUNC|os.O_NOFOLLOW,0o600)
with os.fdopen(fd,'w') as f:json.dump(data,f,indent=2);f.write('\n')
p.chmod(0o600)
print('Filled: observed_at, declined'+(', link' if data['link'] else '')+'. Link value was not printed.')
