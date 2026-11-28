/**
 * @jest-environment jsdom
 */
// RWO-01 R-08 (finding F27): on signed-out pages the header "Sign in" button stays on one line at its 15px text, and
// the footer links stack one per line, centered, below the width where one row fits. Add-on A1-4: the signed-in
// footer does the same.
import { render, screen } from '@testing-library/react';
import { PublicShell } from '@/components/portal/PublicShell';
import { Footer } from '@/components/portal/Footer';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }), usePathname: () => '/login' }));

const classes = (el: Element | null) => (el?.className ?? '').split(/\s+/);

describe('signed-out header and footer fit (R-08)', () => {
  it('Sign in and "Already subscribed?" never wrap or shrink; only the support line gives way, before its address', () => {
    render(<PublicShell>content</PublicShell>);
    const signIn = screen.getByTestId('public-sign-in');
    for (const c of ['whitespace-nowrap', 'shrink-0', 'h-11', 'text-[15px]', 'rounded-md']) expect(classes(signIn)).toContain(c);
    const already = screen.getByText('Already subscribed?');
    for (const c of ['whitespace-nowrap', 'shrink-0']) expect(classes(already)).toContain(c);
    const address = screen.getAllByText('support@pharmacybooks.com').find((e) => e.closest('header nav'))!;
    expect(classes(address)).toContain('whitespace-nowrap');
    expect(classes(address.parentElement)).toContain('min-w-0');
    expect(classes(signIn.closest('nav'))).toContain('min-w-0');
  });

  it('the signed-out footer stacks its links one per line, centered, and returns to one row from lg', () => {
    const { container } = render(<Footer tone="dark" />);
    const links = container.querySelector('[data-testid="footer-links"]');
    for (const c of ['flex-col', 'items-center', 'lg:flex-row', 'lg:whitespace-nowrap']) expect(classes(links)).toContain(c);
    expect(classes(links)).not.toContain('flex-wrap');
    for (const c of ['flex-col', 'items-center', 'text-center', 'lg:flex-row', 'lg:justify-between']) expect(classes(links!.parentElement)).toContain(c);
    expect(links!.children).toHaveLength(3);
  });

  // RWO-01 add-on A1-4: the signed-in footer gets the same fix; only its colors differ.
  it('the signed-in footer stacks the same way and keeps its own colors', () => {
    const { container } = render(<Footer />);
    const links = container.querySelector('[data-testid="footer-links"]');
    for (const c of ['flex-col', 'items-center', 'lg:flex-row', 'lg:whitespace-nowrap']) expect(classes(links)).toContain(c);
    expect(classes(links)).not.toContain('flex-wrap');
    for (const c of ['flex-col', 'items-center', 'text-center', 'lg:flex-row', 'lg:justify-between', 'text-muted-foreground']) expect(classes(links!.parentElement)).toContain(c);
    expect(classes(links!.parentElement)).not.toContain('sm:flex-row');
    expect(container.querySelector('a')!.className).toContain('pb-link-on-page');
  });
});
