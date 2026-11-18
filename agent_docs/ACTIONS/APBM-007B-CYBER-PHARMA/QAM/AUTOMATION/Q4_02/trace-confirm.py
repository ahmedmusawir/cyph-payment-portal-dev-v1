from pathlib import Path
import zipfile,json,sys,urllib.parse
rows=[]
for p in Path(sys.argv[1]).rglob('trace.zip'):
 with zipfile.ZipFile(p) as z:
  for name in z.namelist():
   if not name.endswith('.network'):continue
   for line in z.read(name).decode().splitlines():
    try:r=json.loads(line).get('snapshot',{});req=r.get('request',{});path=urllib.parse.urlsplit(req.get('url','')).path
    except:continue
    if path!='/api/stores/add/confirm':continue
    rows.append({'method':req.get('method'),'path':path,'started_at':r.get('startedDateTime'),'duration_ms':r.get('time'),'response_status':r.get('response',{}).get('status'),'failure':r.get('_failureText'),'trace_private':True,'request_body_or_credentials_exported':False})
print(json.dumps(rows))
