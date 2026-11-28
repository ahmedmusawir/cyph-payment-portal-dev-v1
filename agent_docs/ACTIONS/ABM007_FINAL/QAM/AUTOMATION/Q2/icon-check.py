from PIL import Image, ImageChops
from pathlib import Path
import hashlib,json,io
q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM');master=Path('agent_docs/ACTIONS/ABM007_FINAL/DESIGN/assets/Pharmacy-Books-Logo-Primary.png');im=Image.open(master).convert('RGBA');assert hashlib.sha256(master.read_bytes()).hexdigest()=='e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd'
def square(n):
 a=im.copy();a.thumbnail((n,n),Image.Resampling.LANCZOS);b=Image.new('RGBA',(n,n),'white');b.alpha_composite(a,((n-a.width)//2,(n-a.height)//2));return b.convert('RGB')
def equal(a,b):return a.size==b.size and ImageChops.difference(a.convert('RGB'),b.convert('RGB')).getbbox() is None
control=square(32);bad=control.copy();bad.putpixel((0,0),(0,0,0));controls={'clean':equal(control,control.copy()),'mutatedRejected':not equal(control,bad)};(q/'evidence/Q2/03/icon-controls.json').write_text(json.dumps(controls,indent=2));assert all(controls.values());rows=[]
for app in ['ob','pp']:
 root=Path('/tmp/abm007-final-cody-q2')/app/'src/app'
 for name,n in [('icon.png',512),('apple-icon.png',180)]:
  file=root/name;actual=Image.open(file);rows.append({'app':app,'file':name,'size':actual.size,'fullCanvasScaleAndWhitePadPixelsEqual':equal(actual,square(n)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest()})
 buffer=io.BytesIO();square(48).convert('RGBA').save(buffer,format='ICO',sizes=[(16,16),(32,32),(48,48)]);recreated=Image.open(io.BytesIO(buffer.getvalue()));ico=Image.open(root/'favicon.ico');rows.append({'app':app,'file':'favicon.ico','sizes':sorted(ico.ico.sizes()),'sha256':hashlib.sha256((root/'favicon.ico').read_bytes()).hexdigest(),'frames':[{'size':list(size),'opaque':ico.ico.getimage(size).convert('RGBA').getextrema()[3]==(255,255),'wholeCanvas48ThenResizePixelsEqual':equal(ico.ico.getimage(size),recreated.ico.getimage(size))}for size in sorted(ico.ico.sizes())]})
(q/'evidence/Q2/03/icon-results.json').write_text(json.dumps({'rows':rows,'note':'Independent whole-canvas Lanczos scaling and white padding, pixel comparison for PNGs. ICO frames reconstructed from a whole-canvas 48px square, then resized to 16/32 by Pillow; RGB pixels and opacity compared. First 512-square assumption retained separately; visual master comparison performed separately.'},indent=2));print(json.dumps(rows))
