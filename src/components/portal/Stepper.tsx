import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Wizard progress (COMPONENT_MANIFEST §2): numbered steps at sm+, "Step n of 4"
// plus bar below sm. ABM007_FINAL (UI_SPEC 3, brand contract 4.5): 28px round step badges, navy filled for the
// current and done steps, outlined for steps not yet reached.
const STEPS = ["Plan", "Owner", "Pharmacy", "Review & pay"] as const;

export function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <nav aria-label="Signup progress" className="mb-6">
      <ol className="hidden items-center gap-2 text-sm sm:flex">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = n < current ? "done" : n === current ? "current" : "upcoming";
          return (
            <li key={label} className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
              {i > 0 ? <span className="h-px w-8 bg-border" aria-hidden="true" /> : null}
              <span
                className={cn(
                  "pb-step-badge",
                  state === "upcoming" && "pb-step-badge-todo",
                )}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : n}
              </span>
              <span className={state === "upcoming" ? "text-muted-foreground" : state === "current" ? "font-medium text-heading" : "text-foreground"}>
                {label}
                {state === "done" ? <span className="sr-only"> (done)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="sm:hidden">
        <p className="text-[13px] font-medium text-muted-foreground">
          Step {current} of 4 · <span className="text-foreground">{STEPS[current - 1]}</span>
        </p>
        <div className="mt-2 h-1 w-full rounded-full bg-border">
          <div className="h-1 rounded-full bg-primary" style={{ width: `${current * 25}%` }} />
        </div>
      </div>
    </nav>
  );
}
