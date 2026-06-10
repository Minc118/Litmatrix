"use client";

import { useState } from "react";
import { Check, Edit3, Lightbulb, X } from "lucide-react";
import { litmatrixClient } from "@/lib/api/litmatrixClient";
import type { AISuggestion, ReviewDecision } from "@/lib/types/litmatrix";

const controls = [
  { label: "Accept", icon: Check, decision: "accepted" },
  { label: "Edit", icon: Edit3, decision: "edited" },
  { label: "Reject", icon: X, decision: "rejected" },
  { label: "Idea", icon: Lightbulb, decision: "saved-as-idea" },
] as const;

export function ReviewDecisionControls({
  suggestion,
  onChanged,
}: {
  suggestion: AISuggestion;
  onChanged?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<ReviewDecision["decision"] | null>(null);

  async function submitDecision(decision: ReviewDecision["decision"]) {
    setError(null);
    setPending(decision);

    const editedContent =
      decision === "edited"
        ? window.prompt("Edit confirmed extraction text", suggestion.content)?.trim() || null
        : null;

    if (decision === "edited" && !editedContent) {
      setPending(null);
      return;
    }

    try {
      await litmatrixClient.createReviewDecision({
        suggestionId: suggestion.id,
        decision,
        editedContent,
      });
      onChanged?.();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save review decision.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {controls.map((control) => {
          const Icon = control.icon;
          const decision = control.decision;
          return (
            <button
              key={control.label}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-60"
              disabled={Boolean(pending)}
              onClick={() => void submitDecision(decision)}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {pending === decision ? "Saving" : control.label}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs leading-5 text-danger">{error}</p> : null}
    </div>
  );
}
