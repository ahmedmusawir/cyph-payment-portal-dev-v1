// APBM007A RA-7 — one NPI rule shared by the form and the server. The server is the authority; the database
// repeats the same rule on the reservation table (public.npi_is_valid).
export type NpiResult = { ok: true; npi: string } | { ok: false; reason: 'characters' | 'length' | 'check_digit' };

/** Remove spaces and hyphens; anything else that is not a digit is an error. */
export function normalizeNpi(input: string): NpiResult {
  const stripped = String(input ?? '').replace(/[\s-]/g, '');
  if (!/^[0-9]*$/.test(stripped)) return { ok: false, reason: 'characters' };
  if (stripped.length !== 10) return { ok: false, reason: 'length' };
  if (!luhn('80840' + stripped)) return { ok: false, reason: 'check_digit' };
  return { ok: true, npi: stripped };
}

function luhn(digits: string): boolean {
  let total = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) { d *= 2; if (d > 9) d -= 9; }
    total += d;
    double = !double;
  }
  return total % 10 === 0;
}

export const NPI_MESSAGES: Record<'characters' | 'length' | 'check_digit', string> = {
  characters: 'Enter the NPI using digits only.',
  length: 'An NPI has exactly 10 digits.',
  check_digit: "That NPI doesn't pass its check digit. Check the number and try again.",
};
