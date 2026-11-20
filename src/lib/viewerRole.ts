// Manual QA 20 Nov 2026 (navbar identity): the signed-in person's store role, from tenant_stores (read with their own
// session: ownership from the account, admin from the membership). Same wording as OwedBook. Never inferred from an email
// address. The summary states the scope so one badge does not imply authority over stores where the role is lesser.
export type Capability = 'owner' | 'admin' | 'member';
export type ViewerRole = { label: 'Owner' | 'Store admin' | 'Member'; scope: string };

export function viewerRole(stores: { capability: Capability }[]): ViewerRole | null {
  const count = (c: Capability) => stores.filter((s) => s.capability === c).length;
  const label = count('owner') ? 'Owner' : count('admin') ? 'Store admin' : count('member') ? 'Member' : null;
  if (!label) return null;
  const scope = ([['owner', 'Owner'], ['admin', 'Store admin'], ['member', 'Member']] as const)
    .filter(([c]) => count(c) > 0)
    .map(([c, word]) => `${word} of ${count(c)} ${count(c) === 1 ? 'pharmacy' : 'pharmacies'}`)
    .join(' · ');
  return { label, scope };
}

export const NO_DISPLAY_NAME = 'Your account';
