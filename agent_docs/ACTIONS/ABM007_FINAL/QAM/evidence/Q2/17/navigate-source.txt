// Portal — leaving the app (Stripe-hosted pages, the handoff routes). One seam so views stay testable.
export function externalRedirect(url: string): void {
  window.location.assign(url);
}
