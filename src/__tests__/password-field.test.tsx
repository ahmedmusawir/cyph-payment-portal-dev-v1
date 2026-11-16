/**
 * @jest-environment jsdom
 */
// APBM007A U-3 — show/hide on the Payment Portal's password sign-in. Network is mocked.
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from '@/components/portal/FormField';
import { LoginPageContent } from '@/app/login/LoginPageContent';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));
jest.mock('@/services/portal/navigate', () => ({ externalRedirect: jest.fn() }));

const SECRET = 'not-a-real-password-2';

describe('PasswordField (U-3)', () => {
  function Harness({ onSubmit }: { onSubmit: () => void }) {
    const [v, setV] = useState('');
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <PasswordField id="password" label="Password" autoComplete="current-password" value={v} onValue={setV} />
      </form>
    );
  }

  it('starts hidden; toggles while keeping value, focus and typing; never submits', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<Harness onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(input.getAttribute('type')).toBe('password');
    expect(input.getAttribute('autocomplete')).toBe('current-password');
    expect(toggle.getAttribute('type')).toBe('button');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe('password');

    await user.type(input, 'abc');
    await user.click(toggle);
    expect(input.getAttribute('type')).toBe('text');
    expect(input.value).toBe('abc');
    expect(document.activeElement).toBe(input);
    expect(screen.getByRole('button', { name: 'Hide password' }).getAttribute('aria-pressed')).toBe('true');
    await user.type(input, 'def');
    expect(input.value).toBe('abcdef');
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input.getAttribute('type')).toBe('password');
    expect(input.value).toBe('abcdef');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('puts the caret back where it was: browsers move it to the start when the type changes', async () => {
    // The spy goes in before anything is typed: user-event wraps setSelectionRange on the element when it types, and
    // that wrapper keeps whatever method existed at that moment.
    const restore = jest.spyOn(HTMLInputElement.prototype, 'setSelectionRange');
    const user = userEvent.setup();
    render(<Harness onSubmit={jest.fn()} />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    await user.type(input, 'abcdef');
    input.setSelectionRange(2, 4);
    const before = restore.mock.calls.length;
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(restore.mock.calls.slice(before)).toContainEqual([2, 4]);   // the component put the selection back
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 4]);
    restore.mockRestore();
  });

  it('the deferred caret restore runs on the next frame, but never after the person has started typing', async () => {
    const frames: FrameRequestCallback[] = [];
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { frames.push(cb); return frames.length; });
    const user = userEvent.setup();
    render(<Harness onSubmit={jest.fn()} />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    await user.type(input, 'abc');
    // 1) no typing before the frame: the frame puts the caret back (Chromium had moved it to the start)
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    input.setSelectionRange(0, 0);
    frames.splice(0).forEach((cb) => cb(0));
    expect([input.selectionStart, input.selectionEnd]).toEqual([3, 3]);
    // 2) typing before the frame: the first key restores at once and the later frame changes nothing
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    await user.type(input, 'de', { skipClick: true });
    frames.splice(0).forEach((cb) => cb(0));
    expect(input.value).toBe('abcde');
    expect([input.selectionStart, input.selectionEnd]).toEqual([5, 5]);
    raf.mockRestore();
  });

  it('is reachable by keyboard, shows a focus ring, and toggles with Space and Enter without submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<Harness onSubmit={onSubmit} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText('Password'));
    await user.tab();
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(document.activeElement).toBe(toggle);
    expect(toggle.className).toContain('focus-visible:ring-2');
    await user.keyboard(' ');
    expect(screen.getByLabelText('Password').getAttribute('type')).toBe('text');
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('Password').getAttribute('type')).toBe('password');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('Portal password sign-in (U-3)', () => {
  it('the toggle sends nothing; Sign in then submits exactly the typed password', async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: { role: null } }) }));
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<LoginPageContent sessionExpired={false} />);
    await user.type(document.getElementById('email')!, 'owner@example.test');
    const pw = screen.getByLabelText('Password') as HTMLInputElement;
    await user.type(pw, SECRET);
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(pw.getAttribute('type')).toBe('text');
    expect(pw.value).toBe(SECRET);
    expect(fetchMock).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = (fetchMock.mock.calls[0] as unknown[])[1] as RequestInit;
    expect(JSON.parse(String(init.body))).toEqual({ email: 'owner@example.test', password: SECRET });
  });
});
