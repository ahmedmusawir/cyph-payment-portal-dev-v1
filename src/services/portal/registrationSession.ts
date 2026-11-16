"use client";

// APBM007A — per-tab registration session. The draft itself lives on the server (httpOnly cookie);
// this holds only form input that has not been saved yet and the checkout operation key, so a retry or a
// double click resumes the same checkout instead of starting another. Business details only: no token,
// password or card data is ever written here.
import { useEffect } from 'react';
import { createStore, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { OwnerForm, PharmacyValues } from './registrationForm';

export const REGISTRATION_SESSION_KEY = 'cyph-portal:v2:registration';

interface SessionStore {
  owner: OwnerForm | null;
  pharmacy: PharmacyValues | null;
  operationKey: string | null;
  hydrated: boolean;
}

export const registrationSessionStore = createStore<SessionStore>()(
  persist(
    (): SessionStore => ({ owner: null, pharmacy: null, operationKey: null, hydrated: false }),
    {
      name: REGISTRATION_SESSION_KEY,
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ owner, pharmacy, operationKey }) => ({ owner, pharmacy, operationKey }),
      skipHydration: true,
      onRehydrateStorage: () => () => registrationSessionStore.setState({ hydrated: true }),
    },
  ),
);

/** `[A-Za-z0-9_-]`, well over the server's 16-character minimum. */
function newOperationKey(): string {
  const uuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  return `reg_${uuid}_${Math.random().toString(36).slice(2, 10)}`.replace(/[^A-Za-z0-9_-]/g, '');
}

export const registrationSession = {
  keepOwner: (owner: OwnerForm) => registrationSessionStore.setState({ owner }),
  keepPharmacy: (pharmacy: PharmacyValues) => registrationSessionStore.setState({ pharmacy }),
  /** Called once the server has the draft: nothing unsaved remains. */
  clearForms: () => registrationSessionStore.setState({ owner: null, pharmacy: null }),
  /** One key per checkout attempt: created on first use, then reused until renewed. */
  operationKey(): string {
    const existing = registrationSessionStore.getState().operationKey;
    if (existing) return existing;
    const operationKey = newOperationKey();
    registrationSessionStore.setState({ operationKey });
    return operationKey;
  },
  /** Only after the attempt is definitively over (checkout closed, expired unpaid, or completed). */
  renewOperationKey: () => registrationSessionStore.setState({ operationKey: null }),
};

/** Unsaved form input for this tab; `hydrated` is false until sessionStorage has been read. */
export function useRegistrationSession(): { owner: OwnerForm | null; pharmacy: PharmacyValues | null; hydrated: boolean } {
  const owner = useStore(registrationSessionStore, (s) => s.owner);
  const pharmacy = useStore(registrationSessionStore, (s) => s.pharmacy);
  const hydrated = useStore(registrationSessionStore, (s) => s.hydrated);
  useEffect(() => {
    if (!registrationSessionStore.getState().hydrated) void registrationSessionStore.persist.rehydrate();
  }, []);
  return { owner, pharmacy, hydrated };
}
