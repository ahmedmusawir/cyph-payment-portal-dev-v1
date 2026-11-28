from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import json
q=Path(__file__).resolve().parents[2]
e=q/'evidence/Q4/A3'
now=datetime.now(ZoneInfo('Asia/Dhaka'))
summary=json.loads((e/'automation-summary.json').read_text())
live=json.loads((e/'served-walkthrough.json').read_text())
ob,pp=live['apps']
doc=f"""# ABM007_FINAL · Director walkthrough sheet 05 · A3

Prepared {now:%d %B %Y at %H:%M BDT}. Use desktop Chrome. Sign in to OwedBook as **Owner B** with the password from the private cast. Keep passwords, sign-in details and screenshots of private data out of this sheet. JARVIS guides. The observations and results are Tony’s.

| Before starting | Verified candidate |
|---|---|
| OwedBook Help | http://localhost:3100/help |
| Account & Billing, serving on 3101 | No page visit needed |
| Branch and target | qa/abm007-final · SCRATCH · ihgcsrypblqkwommrkgj |
| OwedBook manifest SHA-256 | `{ob['manifest']}` |
| Account & Billing manifest SHA-256 | `{pp['manifest']}` |

Candidate and browser confirmation, date and start time: __________________

## W-09 · Desktop Help

1. Set the viewport to 1440 CSS pixels wide. Open Help and check the 13 articles. Each should end with its own **Go to the Top** link. The left menu should contain only the 13 article links.
2. Scroll down and click one article’s return link. The page should reach the very top with the header visible and stay there for at least two seconds.
3. Use Tab to reach an article’s return link and press Enter. Check the top and header again after two seconds. Describe how the **Help** heading looks immediately after Enter.

My words:

Result (PASS / FAIL / BLOCKED):

Time and time zone:

## W-10 · Phone-width Help in desktop Chrome

1. Set the viewport to 375 CSS pixels wide. Scroll to a middle article and use its **Go to the Top** link.
2. Scroll to the last article and use its link. Both links should be inside their articles. After each activation the top and header should remain visible.

My words:

Result (PASS / FAIL / BLOCKED):

Time and time zone:

Save after each check. Sign out at the end. Return your words, result and time for each check.
"""
p=q/'HANDOFFS/DIRECTOR_WALKTHROUGH_SHEET_05_A3.md'
with p.open('x') as f:f.write(doc)
dest=Path('/home/moose/Downloads')/f'ABM007_FINAL_DIRECTOR_WALKTHROUGH_SHEET_05_A3_{now:%Y-%m-%d_%H%M%S}_BDT.md'
with dest.open('xb') as f:f.write(p.read_bytes())
assert dest.read_bytes()==p.read_bytes()
print(dest)
