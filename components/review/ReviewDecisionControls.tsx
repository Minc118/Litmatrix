import { Check, Edit3, Lightbulb, X } from "lucide-react";

const controls = [
  { label: "Accept", icon: Check },
  { label: "Edit", icon: Edit3 },
  { label: "Reject", icon: X },
  { label: "Idea", icon: Lightbulb },
];

export function ReviewDecisionControls() {
  return (
    <div className="flex flex-wrap gap-2">
      {controls.map((control) => {
        const Icon = control.icon;
        return (
          <button
            key={control.label}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted opacity-70"
            disabled
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {control.label}
          </button>
        );
      })}
    </div>
  );
}
