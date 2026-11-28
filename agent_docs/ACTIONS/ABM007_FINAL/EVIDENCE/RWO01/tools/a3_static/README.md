# Static-copy probes (RWO-01 add-on A3)

Test tooling only. These probes open a file copy of the Help page in a browser, with no server, no sign-in and none of the app's scripts. They exist to answer one question: is the Firefox defect caused by the app's scripts, or by the page's own HTML and the browser?

## How the file copy was made

1. In the scratchpad copy of the OwedBook working tree (A2 state), a throwaway unit test rendered `HelpPage` and wrote its HTML to a file.
2. That HTML was placed inside a plain page with a stand-in header (a navy bar, 64px tall, with two links and a button) and the app's built stylesheet from the same copy's production build.
3. The page was opened by its `file://` address.

The copy is not in this folder: it is the product's own page and style sheet, and it stays in the scratchpad. The Help content is in the product source.

## The probes

| File | What it does |
|---|---|
| `probe.mjs` | Articles 1, 7 and 13, mouse and keyboard, three sizes: scroll position at 0, 100, 300, 800 and 2,000 ms |
| `probe2.mjs` | Firefox. Tab from the last contents menu link onto article 1's link, then one of four ways of scrolling (script centre, `scrollTo`, mouse wheel, none), then mouse or Enter |
| `probe2_h1.mjs` | The same with the candidate change applied to the page first |
| `probe3.mjs` | Any engines, both step orders, with or without the candidate change; also reports where focus is and where the next Tab goes |

The candidate change, applied to the copy by script before a run: the "Help" heading gets `id="top"`, `tabindex="-1"` and a scroll margin of one window height. This is the change later made in `HelpPage.tsx`.

Outputs are in `measure/a3_static/`.
