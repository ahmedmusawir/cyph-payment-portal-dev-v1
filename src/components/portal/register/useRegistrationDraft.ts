"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { portalApi } from "@/services/portal";
import type { RegistrationDraftView } from "@/types/portal/api";

// The registration draft lives on the server; every step reads it on load. Once checkout has
// started (or finished) the draft can no longer be edited, so the editing steps hand over to the
// status page, which is the one place that can go back to editing.
export function useRegistrationDraft(): {
  loading: boolean;
  draft: RegistrationDraftView | null;
  error: string | null;
  setDraft: (draft: RegistrationDraftView) => void;
  reload: () => void;
} {
  const router = useRouter();
  const [state, setState] = useState<{ loading: boolean; draft: RegistrationDraftView | null; error: string | null }>({ loading: true, draft: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    void portalApi.getDraft().then((r) => {
      if (!live) return;
      if (!r.ok) return setState({ loading: false, draft: null, error: r.message });
      if (r.value && r.value.status !== "draft") {
        router.replace("/register/activation");
        return; // stays in the loading state until the status page takes over
      }
      setState({ loading: false, draft: r.value, error: null });
    });
    return () => {
      live = false;
    };
  }, [attempt, router]);

  const setDraft = useCallback((draft: RegistrationDraftView) => setState({ loading: false, draft, error: null }), []);
  const reload = useCallback(() => {
    setState({ loading: true, draft: null, error: null });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, setDraft, reload };
}
