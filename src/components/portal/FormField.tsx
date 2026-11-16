"use client";

import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from "react";
import { AlertCircle, ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// FormField helpers (COMPONENT_MANIFEST §2): visible label, required marker
// with sr-only text, help + inline error wired through aria-describedby, and
// aria-invalid. Native inputs/selects styled with tokens; no new library.
const CONTROL =
  "flex h-11 w-full border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive disabled:opacity-50";

interface FieldShellProps {
  id: string;
  label: React.ReactNode;
  required?: boolean;
  optionalNote?: string;
  help?: React.ReactNode;
  error?: string;
  className?: string;
  children: (describedBy: string | undefined) => React.ReactNode;
}

function FieldShell({ id, label, required, optionalNote, help, error, className, children }: FieldShellProps) {
  const ids = [help ? `${id}-help` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <>
            {" "}
            <span className="text-destructive" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
        {optionalNote ? <span className="font-normal text-muted-foreground"> {optionalNote}</span> : null}
      </label>
      {children(ids)}
      {help ? (
        <p id={`${id}-help`} className="text-xs text-muted-foreground">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "onChange" | "value"> & {
  id: string;
  label: React.ReactNode;
  value: string;
  onValue: (v: string) => void;
  help?: React.ReactNode;
  error?: string;
  optionalNote?: string;
  shellClassName?: string;
};

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { id, label, value, onValue, help, error, required, optionalNote, shellClassName, className, ...rest },
  ref,
) {
  return (
    <FieldShell id={id} label={label} required={required} optionalNote={optionalNote} help={help} error={error} className={shellClassName}>
      {(describedBy) => (
        <input
          ref={ref}
          id={id}
          name={id}
          value={value}
          onChange={(e) => onValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={cn(CONTROL, className)}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

/**
 * A password field with a show/hide control (U-3): the same shell and input as TextField, plus one button that never
 * submits the form. The password starts hidden; the button's label and aria-pressed follow the state; the value, focus
 * and caret stay in the field while the visibility changes. Nothing is logged or stored.
 */
export const PasswordField = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(function PasswordField(
  { id, label, value, onValue, help, error, required, optionalNote, shellClassName, className, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  // Browsers put the caret at the start when an input's type changes, and Chromium does it again just after the commit.
  // Remember the selection before the toggle and put it back once the type has changed and again on the next frame, so
  // typing continues where it was (found in the production-browser walk; jsdom keeps the caret).
  const input = useRef<HTMLInputElement | null>(null);
  const selection = useRef<[number | null, number | null] | null>(null);
  const setRefs = useCallback((el: HTMLInputElement | null) => {
    input.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, [ref]);
  useLayoutEffect(() => {
    const el = input.current, s = selection.current;
    selection.current = null;
    if (!el || !s) return;
    const [start, end] = s;
    if (start === null || end === null) return;
    const restore = () => el.setSelectionRange(start, end);
    restore();
    // Chromium moves the caret once more after the commit. Put it back on the next frame, or at the first key if the
    // person types sooner (before the character goes in); a click in the field picks a new position, so leave that.
    let done = false;
    let frame = 0;
    const onKey = () => settle(true);
    const onPointer = () => settle(false);
    function settle(apply: boolean) {
      if (done) return;
      done = true;
      if (apply) restore();
      if (frame && typeof cancelAnimationFrame === "function") cancelAnimationFrame(frame);
      el!.removeEventListener("keydown", onKey, true);
      el!.removeEventListener("pointerdown", onPointer, true);
    }
    el.addEventListener("keydown", onKey, true);
    el.addEventListener("pointerdown", onPointer, true);
    if (typeof requestAnimationFrame === "function") frame = requestAnimationFrame(() => settle(true));
    return () => settle(false);
  }, [visible]);
  const toggle = () => {
    selection.current = input.current ? [input.current.selectionStart, input.current.selectionEnd] : null;
    setVisible((v) => !v);
  };
  return (
    <FieldShell id={id} label={label} required={required} optionalNote={optionalNote} help={help} error={error} className={shellClassName}>
      {(describedBy) => (
        <div className="relative">
          <input
            ref={setRefs}
            id={id}
            name={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => onValue(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            className={cn(CONTROL, className, "pr-12")}
            {...rest}
          />
          <button
            type="button"
            onClick={toggle}
            // Keep the caret in the field for pointer users, so typing continues after a toggle.
            onMouseDown={(e) => e.preventDefault()}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            aria-controls={id}
            disabled={rest.disabled}
            className="absolute inset-y-0 right-1.5 my-auto flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      )}
    </FieldShell>
  );
});

type SelectProps = {
  id: string;
  label: React.ReactNode;
  value: string;
  onValue: (v: string) => void;
  options: readonly { value: string; label: string }[];
  help?: React.ReactNode;
  error?: string;
  required?: boolean;
  shellClassName?: string;
};

export function SelectField({ id, label, value, onValue, options, help, error, required, shellClassName }: SelectProps) {
  return (
    <FieldShell id={id} label={label} required={required} help={help} error={error} className={shellClassName}>
      {(describedBy) => (
        <div className="relative">
          <select
            id={id}
            name={id}
            value={value}
            onChange={(e) => onValue(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            className={cn(CONTROL, "appearance-none pr-9")}
          >
            <option value="">Choose…</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
    </FieldShell>
  );
}

export function RequiredNote() {
  return (
    <p className="text-xs text-muted-foreground">
      <span className="text-destructive" aria-hidden="true">*</span> Required
    </p>
  );
}
