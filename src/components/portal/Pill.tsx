import { cn } from "@/lib/utils";

// Generic status pill. Semantic four: success / warning / destructive / info,
// plus muted. Coral (brand) is NEVER a status. Foreground text + status border
// + 10% tint (COMPONENT_MANIFEST §4), flat, uppercase, never wraps. Domain→tone mappers belong next to the domain that owns
// them (none exist yet — they arrive with the FFM).
export type PillTone = "success" | "warning" | "destructive" | "info" | "muted";

const TONE: Record<PillTone, string> = {
  success: "pb-tone-success",
  warning: "pb-tone-warning",
  destructive: "pb-tone-destructive",
  info: "pb-tone-info",
  muted: "pb-tone-neutral",
};

export function Pill({
  tone,
  children,
  className,
}: {
  tone: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pb-pill",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
