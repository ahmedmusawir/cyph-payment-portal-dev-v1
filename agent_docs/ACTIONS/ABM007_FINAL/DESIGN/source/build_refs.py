"""Builds the ABM007_FINAL design reference pages (style tile + sample screens).
Usage: python3 -I build_refs.py <DESIGN dir>. Pages link ../assets/brand.css; all color comes from the token file."""
import sys, pathlib
OUT = pathlib.Path(sys.argv[1])

def page(title, body, cls=""):
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — ABM007_FINAL design reference</title><link rel="stylesheet" href="../assets/brand.css"></head>
<body class="{cls}">
{body}
</body></html>
"""

IMG = '<img src="../assets/Pharmacy-Books-Logo-Primary.png" alt="Pharmacy Books">'
LOGO = f'<div class="logo-tile">{IMG}</div>'
LOGO_SM = f'<div class="logo-tile sm">{IMG}</div>'
REF = '<div class="refbar">Design reference for approval · fictional data · static page: states and the menu are illustrations, not live controls · {}</div>'

def appbar(product, links, active, name, role):
    nav = "".join(f'<a class="{"on" if l == active else ""}" href="#">{l}</a>' for l in links)
    drawer = "".join(f'<a class="{"on" if l == active else ""}" href="#">{l}</a>' for l in links)
    return f"""<header class="appbar on-navy">
  <div class="brand">{LOGO_SM}<div><b>Pharmacy Books</b><span>{product}</span></div></div>
  <nav>{nav}</nav>
  <div class="who"><span>{name}</span><span class="role">{role}</span></div>
  <span class="menu-btn" role="button" aria-controls="drawer" aria-label="Menu"><i></i><i></i><i></i><b>Menu</b></span>
</header>
<div class="drawer" id="drawer"><p class="h-sub">Menu (illustrated open state)</p>{drawer}
  <div class="drawer-id"><span>{name}</span><span class="role">{role}</span></div><a href="#">My Profile</a><a href="#">Sign out</a></div>"""

FOOT = '<div class="foot"><span>Pharmacy Books</span><span>Support: support@pharmacybooks.com · Terms (link not yet published) · Privacy (link not yet published)</span></div>'

# ---------------------------------------------------------------- style tile
def sw(var, name, note):
    return f'<div><div class="swatch" style="background:hsl(var({var}))"></div><div class="cap"><b>{name}</b><br>{note}</div></div>'

tile = REF.format("style tile") + f"""
<div class="wrap stack">
  <div><p class="eyebrow navy">ABM007_FINAL · Style tile · light only</p>
  <h1 class="page-title">Pharmacy Books — brand applied to OwedBook and Account &amp; Billing</h1>
  <p class="muted body-sm">Every value on this page is read from <code>tokens/abm007_final_tokens.css</code>. Status: proposed, awaiting the Director's visual approval.</p></div>

  <section class="card"><h2 class="h2">Palette and what each color does</h2>
    <div class="grid4">
      {sw("--brand-navy","Navy #154474","Headings, header, masthead, focus ring. White on navy 9.95:1")}
      {sw("--primary","Dark green #288472","Every button and link. White text 4.53:1")}
      {sw("--primary-hover","Hover green #247767","Button hover. White text 5.37:1")}
      {sw("--brand-green","Green #32A38D","Fills and large type only. 3.11:1 on white")}
      {sw("--brand-ice","Ice #EAF3FA","Page surface, hover surface, text on navy 8.86:1")}
      {sw("--card","White","Cards, shell, fields")}
      {sw("--foreground","Charcoal #393B38","Body text. 11.31:1 on white")}
      {sw("--muted-foreground","Gray #515151","Labels, help text, field borders. 7.94:1")}
    </div>
    <div class="grid4" style="margin-top:14px">
      {sw("--success","Success #288639","Status only. Text on white 4.61:1")}
      {sw("--warning","Warning #9D6D06","Status only. Text on white 4.54:1")}
      {sw("--destructive","Destructive #AA2622","Errors, money lost. 6.98:1")}
      {sw("--info","Info #2173DE","Neutral notices. 4.59:1")}
    </div>
  </section>

  <section class="card"><h2 class="h2">Type — Inter only</h2>
    <p class="headline navy">Headline 36 Bold</p>
    <p class="h2">Headline 2 — 18 Medium, card titles and step titles</p>
    <p class="h-sub">Headline sub — 14 medium caps</p>
    <p class="eyebrow navy">Eyebrow — 12 semibold caps</p>
    <p>Body 16 Regular. Running text sits in charcoal on white cards.</p>
    <p class="body-sm">Body small 15 Regular. Field values, list items, descriptions.</p>
    <p class="label">Label 13 Regular. Field labels and helper text.</p>
    <p class="body-sm"><em>Italic is for disclaimer lines and single-word emphasis only.</em></p>
  </section>

  <section class="card"><h2 class="h2">Buttons — Title Case, Regular 16, flat, 8px corners</h2>
    <div class="row">
      <span class="btn btn-primary">Save Changes</span>
      <span class="btn btn-primary is-hover">Hover</span>
      <span class="btn btn-primary is-focus">Focus</span>
      <span class="btn is-disabled">Disabled</span>
      <span class="btn btn-primary"><span class="spin"></span>Saving…</span>
    </div>
    <div class="row" style="margin-top:12px">
      <span class="btn btn-outline">Cancel</span>
      <span class="btn btn-outline is-hover">Hover</span>
      <span class="btn btn-outline is-focus">Focus</span>
      <span class="btn btn-danger">Remove Access</span>
      <span class="btn btn-quiet">Back to My Stores</span>
    </div>
    <p class="cap" style="margin-top:10px">The old hover (90 percent opacity) puts white text at 3.80:1 and is replaced by the darker hover. Disabled is neutral gray, not faded green (white on half-faded green is 1.98:1). Busy keeps its spinner and progress wording.</p>
  </section>

  <section class="grid2">
    <div class="card"><h2 class="h2">Links</h2>
      <p>On white: <a class="link" href="#">Open in OwedBook</a> — dark green, underlined, 4.53:1.</p>
      <p class="cap">Dark green text is not used on ice (4.04:1) or on navy (2.20:1).</p>
      <div class="on-navy navy-demo" style="margin-top:10px;padding:12px;border-radius:8px;background:hsl(var(--brand-navy))">
        <span style="color:#fff">On navy: </span><a class="link" href="#">Back to OwedBook</a>
        <span class="btn btn-outline is-focus on-dark" style="margin-left:12px;min-height:36px;padding:4px 12px">Focus on navy</span>
      </div>
    </div>
    <div class="card"><h2 class="h2">Form field</h2>
      <div class="grid2">
        <label class="field"><span class="label">Pharmacy name</span><span class="input">Example Main Street Pharmacy</span><span class="help">Shown to your staff.</span></label>
        <label class="field"><span class="label">NPI</span><span class="input is-focus tnum">1234567893</span><span class="help">10 digits.</span></label>
        <label class="field"><span class="label">Email</span><span class="input is-error">owner@example</span><span class="err">Enter a complete email address.</span></label>
        <div class="field"><span class="label">Agreement</span><span class="check"><span class="box on"></span>I agree to the recurring monthly charge.</span></div>
      </div>
    </div>
  </section>

  <section class="card"><h2 class="h2">Button, status and role side by side</h2>
    <p class="cap" style="margin:0 0 10px">Brand green and success green are close in shade, so status is carried by the word, a border and a tint, never by hue alone.</p>
    <div class="row">
      <span class="btn btn-primary">Add a Pharmacy</span>
      <span class="pill success">Active</span><span class="pill warning">Pending</span>
      <span class="pill destructive">Payment failed</span><span class="pill info">Removal scheduled</span><span class="pill">Not required</span>
      <span class="role">Owner</span><span class="role">Store admin</span><span class="role">Member</span>
    </div>
    <div class="grid2" style="margin-top:14px">
      <div class="notice success"><b>Your pharmacy is active.</b>Riverside Pharmacy now appears in OwedBook.</div>
      <div class="notice destructive"><b>Do not upload patient identifiers.</b>Remove names and dates of birth before uploading.</div>
      <div class="notice warning"><b>Your last payment did not go through.</b>Update your card to keep access.</div>
      <div class="notice"><b>Riverside Pharmacy is scheduled for removal.</b>Access continues until the date shown.</div>
    </div>
  </section>

  <section class="grid2">
    <div class="card"><h2 class="h2">Card, step badges, logo tile</h2>
      <div class="stack">
        <div class="step"><span class="badge">1</span><div><p class="h2">Choose the pharmacy</p><p class="body-sm">Open My Stores and pick the pharmacy.</p></div></div>
        <div class="step"><span class="badge">2</span><div><p class="h2">Enter the email and role</p><p class="body-sm">Select Member or Store admin before sending.</p></div></div>
        <div class="step"><span class="badge todo">3</span><div><p class="h2">Send the invitation</p></div></div>
      </div>
    </div>
    <div class="masthead"><div class="top eyebrow"><span>Pharmacy Books</span><span>OwedBook</span></div>
      <div class="row">{LOGO}<h2 class="headline" style="font-size:28px">Masthead on navy</h2></div>
      <p class="body-sm">Ice text on the navy gradient, logo in a white tile.</p><em class="body-sm">Disclaimer lines are italic.</em></div>
  </section>

  <section class="card"><h2 class="h2">OwedBook summary tiles and table figures</h2>
    <div class="grid4">
      <div class="card kpi bad"><p class="label">Commercial underpaid</p><p class="n tnum">$12,669.63</p></div>
      <div class="card kpi"><p class="label">Commercial scripts</p><p class="n tnum">2,631</p></div>
      <div class="card kpi good"><p class="label">Updated difference</p><p class="n tnum">$41.86</p></div>
      <div class="card kpi brand"><p class="label">Owed</p><p class="n tnum">$12,627.77</p></div>
    </div>
    <p class="cap" style="margin-top:10px">Proposed: white tiles with navy figures and a status rule, replacing the solid color blocks. Colored figures in tables: <span class="neg tnum">-$10.00</span> and <span class="pos tnum">$16.23</span>, on white only.</p>
  </section>
</div>"""

# ---------------------------------------------------------------- portal sign-in (literal)
signin = f"""<div class="backdrop">
  <div class="shell narrow stack">
    <div class="masthead"><div class="top eyebrow"><span>Pharmacy Books</span><span>Account &amp; Billing</span></div>
      <div class="row">{LOGO}<h1 class="headline" style="font-size:30px">Sign in</h1></div>
      <p class="body-sm">Manage your subscription and pharmacies.</p></div>
    <section class="card stack"><h2 class="h2">Email me a sign-in link</h2>
      <label class="field"><span class="label">Email address</span><span class="input">jordan@example-pharmacy.com</span><span class="help">We send a link to this address. It can be used once.</span></label>
      <span class="btn btn-primary btn-block">Send Sign-In Link</span>
      <p class="body-sm">Prefer a password? <a class="link" href="#">Sign in with a password</a></p>
    </section>
    <section class="card"><h2 class="h2">New to Pharmacy Books?</h2>
      <p class="body-sm">Create an account and add your first pharmacy. <a class="link" href="#">Get started</a></p></section>
  </div>
  <div class="foot" style="max-width:560px;margin:20px auto 0"><span>Pharmacy Books</span><span>Support: support@pharmacybooks.com</span></div>
</div>"""

# ---------------------------------------------------------------- portal register plan (literal)
plan = f"""<div class="backdrop">
  <div class="shell stack">
    <div class="masthead"><div class="top eyebrow"><span>Pharmacy Books</span><span>Step 1 of 4</span></div>
      <div class="row">{LOGO}<h1 class="headline">Choose your plan</h1></div>
      <p class="body-sm">One subscription covers your pharmacy account. You can add more pharmacies later.</p>
      <em class="body-sm">You are not charged until the final step.</em></div>
    <div class="row" style="gap:20px">
      <div class="step"><span class="badge">1</span><p class="h2">Plan</p></div>
      <div class="step"><span class="badge todo">2</span><p class="h2 muted">Pharmacy</p></div>
      <div class="step"><span class="badge todo">3</span><p class="h2 muted">Owner</p></div>
      <div class="step"><span class="badge todo">4</span><p class="h2 muted">Review &amp; pay</p></div>
    </div>
    <section class="card" style="border:2px solid hsl(var(--brand-navy))"><div class="row between"><h2 class="h2">Standard</h2><span class="pill info">Selected</span></div>
      <p><span class="headline navy tnum" style="font-size:30px">$99.00</span> <span class="muted">/ month for your first pharmacy</span></p>
      <p class="body-sm" style="margin-top:6px">Each additional pharmacy is <b class="tnum">$49.00</b> / month.</p></section>
    <section class="card"><h2 class="h2">What you pay each month</h2>
      <table><thead><tr><th>Pharmacies</th><th class="num">Monthly total</th></tr></thead><tbody>
        <tr><td>1 pharmacy</td><td class="num">$99.00</td></tr><tr><td>2 pharmacies</td><td class="num">$148.00</td></tr><tr><td>3 pharmacies</td><td class="num">$197.00</td></tr></tbody></table>
      <p class="help" style="margin-top:8px">Before any tax or approved discount. Payment is handled on Stripe's secure checkout page.</p></section>
    <div class="row between"><p class="body-sm">Already have an account? <a class="link" href="#">Sign in</a></p><span class="btn btn-primary btn-m-block">Continue</span></div>
  </div>
  <div class="foot" style="max-width:1100px;margin:20px auto 0"><span>Pharmacy Books</span><span>Support: support@pharmacybooks.com</span></div>
</div>"""

# ---------------------------------------------------------------- owedbook dashboard (translated)
rows = [("2025-07-25","824008-00","$6.92","$23.15",'<span class="pos">$16.23</span>'),
        ("2025-07-21","821271-00","$31.32","$21.32",'<span class="neg">-$10.00</span>'),
        ("2025-07-15","747066-09","$5.13","$23.15",'<span class="pos">$18.02</span>'),
        ("2025-07-14","813187-02","$12.88","$12.77",'<span class="neg">-$0.11</span>'),
        ("2025-07-05","800176-03","$21.99","$21.12",'<span class="neg">-$0.87</span>')]
tr = "".join(f'<tr><td data-l="Date">{a}</td><td data-l="Script">{b}</td><td class="num" data-l="Original paid">{c}</td><td class="num" data-l="New paid">{d}</td><td class="num" data-l="Updated difference">{e}</td></tr>' for a,b,c,d,e in rows)
owed = REF.format("OwedBook dashboard, translated layout, full table width") + appbar("OwedBook", ["Dashboard","My Stores","Help"], "Dashboard", "Jordan Ellis", "Owner") + f"""
<main class="wide"><div class="with-rail">
  <aside class="card stack" style="align-self:start"><h2 class="h2">Filters</h2>
    <label class="field"><span class="label">Pharmacy</span><span class="input">Example Main Street Pharmacy</span></label>
    <label class="field"><span class="label">From</span><span class="input muted">mm/dd/yyyy</span></label>
    <label class="field"><span class="label">To</span><span class="input muted">mm/dd/yyyy</span></label>
    <label class="field"><span class="label">PBM</span><span class="input">All</span></label>
    <div class="row"><span class="btn btn-primary">Apply</span><span class="btn btn-outline">Clear Filters</span></div>
  </aside>
  <div class="stack">
    <div><p class="eyebrow navy">OwedBook</p><h1 class="page-title">Ledger-level clarity on what's still owed</h1></div>
    <div class="notice warning"><b>Your last payment did not go through.</b>The account owner can update the card in Account &amp; Billing.</div>
    <div class="grid4">
      <div class="card kpi bad"><p class="label">Commercial underpaid</p><p class="n tnum">$12,669.63</p></div>
      <div class="card kpi"><p class="label">Commercial scripts</p><p class="n tnum">2,631</p></div>
      <div class="card kpi good"><p class="label">Updated difference</p><p class="n tnum">$41.86</p></div>
      <div class="card kpi brand"><p class="label">Owed</p><p class="n tnum">$12,627.77</p></div>
    </div>
    <div class="row between"><div class="row"><span class="pill info">Updated commercial payments</span><span class="pill">Commercial dollars</span><span class="pill">Federal dollars</span><span class="pill">Summary</span></div>
      <span class="label">Page 1 of 148 · 7,395 rows</span></div>
    <section class="card tablecard"><table class="stackable"><thead><tr><th>Date</th><th>Script</th><th class="num">Original paid</th><th class="num">New paid</th><th class="num">Updated difference</th></tr></thead><tbody>{tr}</tbody></table></section>
    <div class="row"><span class="btn btn-outline">Previous</span><span class="btn btn-outline">Next</span></div>
  </div>
</div>{FOOT}</main>"""

# ---------------------------------------------------------------- portal dashboard (translated)
dash = REF.format("Account & Billing dashboard, translated layout") + appbar("Account &amp; Billing", ["Dashboard","Billing","Add a Pharmacy"], "Dashboard", "Jordan Ellis", "Owner") + f"""
<main class="wrap stack">
  <div class="row between"><div><p class="eyebrow navy">Account &amp; Billing</p><h1 class="page-title">Your subscription</h1></div>
    <a class="link-on-navy" style="color:hsl(var(--heading))" href="#">Back to OwedBook</a></div>
  <section class="card"><div class="row between"><div class="row"><h2 class="h2" style="margin:0">Standard · monthly</h2><span class="pill success">Active</span></div>
      <div class="row"><span class="btn btn-primary">Add a Pharmacy</span><span class="btn btn-outline">Manage Billing in Stripe</span></div></div>
    <div class="grid3" style="margin-top:14px">
      <div><p class="h-sub">Access now</p><p class="headline navy tnum" style="font-size:28px">3</p><p class="label">pharmacies</p></div>
      <div><p class="h-sub">At next renewal</p><p class="headline navy tnum" style="font-size:28px">2</p><p class="label">1 removal scheduled</p></div>
      <div><p class="h-sub">Monthly total</p><p class="headline navy tnum" style="font-size:28px">$197.00</p><p class="label">before tax or discounts</p></div>
    </div></section>
  <div class="notice"><b>Riverside Pharmacy is scheduled for removal at the end of this billing period.</b>Access continues until then. You can keep the pharmacy any time before that date.</div>
  <section class="card tablecard"><table class="stackable"><thead><tr><th>Pharmacy</th><th>Store admin</th><th class="num">Monthly</th><th>Status</th><th></th></tr></thead><tbody>
    <tr><td data-l="Pharmacy"><b>Example Main Street Pharmacy</b><br><span class="label">NPI 1234567893</span></td><td data-l="Store admin">Jordan Ellis <span class="role">Owner</span></td><td class="num" data-l="Monthly">$99.00</td><td data-l="Status"><span class="pill success">Active</span></td><td data-l=""><a class="link" href="#">Open in OwedBook</a></td></tr>
    <tr><td data-l="Pharmacy"><b>Example Riverside Pharmacy</b><br><span class="label">NPI 1234567901</span></td><td data-l="Store admin">Sam Ortiz <span class="role">Store admin</span></td><td class="num" data-l="Monthly">$49.00</td><td data-l="Status"><span class="pill info">Removal scheduled</span></td><td data-l=""><span class="btn btn-outline" style="min-height:36px;padding:4px 12px">Keep This Store</span></td></tr>
    <tr><td data-l="Pharmacy"><b>Example Lakeside Pharmacy</b><br><span class="label">NPI 1234567919</span></td><td data-l="Store admin">Jordan Ellis <span class="role">Owner</span></td><td class="num" data-l="Monthly">$49.00</td><td data-l="Status"><span class="pill success">Active</span></td><td data-l=""><span class="btn btn-danger" style="min-height:36px;padding:4px 12px">Remove at Period End</span></td></tr>
  </tbody></table></section>
  {FOOT}
</main>"""

# ---------------------------------------------------------------- owedbook help (masthead + steps inside app nav)
helpp = REF.format("OwedBook Help, masthead and numbered steps inside the signed-in navigation") + appbar("OwedBook", ["Dashboard","My Stores","Help"], "Help", "Sam Ortiz", "Store admin") + f"""
<main class="wrap"><div class="with-rail">
  <aside class="card side" style="align-self:start"><p class="h-sub" style="margin-bottom:6px">On this page</p>
    <a class="on" href="#">Invite a staff member</a><a href="#">Getting around</a><a href="#">Who can do what</a><a href="#">My Stores</a><a href="#">Billing</a><a href="#">Audit log</a><a href="#">Sign-in help</a></aside>
  <div class="stack">
    <div class="masthead"><div class="top eyebrow"><span>Pharmacy Books</span><span>Help</span></div>
      <div class="row"><h1 class="headline" style="font-size:30px">How to use OwedBook</h1></div>
      <p class="body-sm">Short answers for owners, store admins and members.</p></div>
    <section class="card stack"><div><h2 class="h2">Invite a staff member</h2>
      <p class="body-sm"><b>Who can do this:</b> the Owner, or the Store admin of that pharmacy.</p></div>
      <div class="step"><span class="badge">1</span><div><p class="h2">Open the pharmacy</p><p class="body-sm">Go to My Stores and open the pharmacy the person will work in.</p></div></div>
      <div class="step"><span class="badge">2</span><div><p class="h2">Enter their email and choose a role</p><p class="body-sm">Pick Member or Store admin. The role you pick decides what they can do.</p></div></div>
      <div class="step"><span class="badge">3</span><div><p class="h2">Send the invitation</p><p class="body-sm">They get an email with a sign-in link. They show as Pending until they accept.</p></div></div>
      <div class="notice success"><b>What should happen:</b>Once they accept, they appear in the pharmacy's people list and see only that pharmacy.</div>
    </section>
    <section class="card"><h2 class="h2">Uploading claims</h2><p class="body-sm muted">Guidance for claims and uploads will be added here in a later release.</p></section>
    {FOOT}
  </div>
</div></main>"""

pages = {"style-tile/style-tile.html": ("Style tile", tile), "samples/01-portal-sign-in.html": ("Portal sign-in", signin),
         "samples/02-portal-register-plan.html": ("Portal choose plan", plan), "samples/03-owedbook-dashboard.html": ("OwedBook dashboard", owed),
         "samples/04-portal-dashboard.html": ("Portal dashboard", dash), "samples/05-owedbook-help.html": ("OwedBook Help", helpp)}
for rel, (t, b) in pages.items():
    p = OUT / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(page(t, b)); print("wrote", rel)
p = OUT / "samples/04b-portal-dashboard-menu-open.html"
p.write_text(page("Portal dashboard, menu open (illustration)", dash, "menu-open")); print("wrote", p.name)
