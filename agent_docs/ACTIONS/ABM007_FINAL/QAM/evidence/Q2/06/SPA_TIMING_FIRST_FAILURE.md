# First instrument failure: Help click sampled before SPA navigation

Chromium v1 recorded /help immediately after clicking both app links. The helper waited for the old document’s load state rather than the expected terminal pathname. These readings are INCOMPLETE for H03, not product redirect failures or passes. Anchor/menu results remain separately inspectable. Original source and output retained.

Before diagnostic repetition, classified as instrument issue. V2 explicitly waits for the ruled role-specific terminal URL. It also waits for the owner-only message, uses the candidate’s actual access-denied marker, and bounds audit paging by observed row growth instead of a fixed 300ms sleep. No business effect or failed sign-in is retried.

V2 still advanced from a terminal URL before destination content was stable. It recorded one Chromium Admin timeout and three Firefox NS_BINDING_ABORTED interruptions (Member, Admin, Owner). V3 requires the destination heading/selector/owner-only/Manage billing content and 500ms stable path before the next navigation. Chromium targeted content-stable diagnostic passed; original interrupted records remain. Firefox v3 skips its already completed anchor walks. WebKit v3 is its first supplemental run. No result is silently replaced.
