import type { AnalysisSource, Confidence, EvidenceLevel, ReviewStatus } from "@/lib/types/litmatrix";

const sourceLabels: Record<AnalysisSource, string> = {
  mock: "Mock",
  "gemini-api": "Gemini",
  "antigravity-local": "Antigravity",
  manual: "Manual",
  imported: "Imported",
  "zotero-local": "Zotero Local",
  "zotero-web": "Zotero Web",
  "pdf-parser": "PDF Parser",
};

const evidenceLabels: Record<EvidenceLevel, string> = {
  "metadata-only": "Metadata",
  "abstract-based": "Abstract",
  "full-text": "Full text",
  "user-notes": "User notes",
  mixed: "Mixed",
};

const statusLabels: Record<ReviewStatus, string> = {
  "pending-review": "Pending",
  accepted: "Accepted",
  edited: "Edited",
  rejected: "Rejected",
  "saved-as-idea": "Idea",
};

const confidenceLabels: Record<Confidence, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  tentative: "Tentative",
};

function badgeClass(tone: "neutral" | "blue" | "green" | "amber" | "red") {
  const tones = {
    neutral: "border-border bg-surface-muted text-muted",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };
  return `inline-flex items-center rounded-sm border px-2 py-1 text-[11px] font-semibold leading-none ${tones[tone]}`;
}

export function SourceBadge({ source }: { source: AnalysisSource }) {
  return <span className={badgeClass(source === "mock" ? "neutral" : "blue")}>{sourceLabels[source]}</span>;
}

export function EvidenceLevelBadge({ level }: { level: EvidenceLevel }) {
  const tone = level === "full-text" ? "green" : level === "metadata-only" ? "amber" : "blue";
  return <span className={badgeClass(tone)}>{evidenceLabels[level]}</span>;
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const tone = confidence === "high" ? "green" : confidence === "medium" ? "blue" : "amber";
  return <span className={badgeClass(tone)}>{confidenceLabels[confidence]}</span>;
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const tone =
    status === "accepted" || status === "edited"
      ? "green"
      : status === "rejected"
        ? "red"
        : status === "saved-as-idea"
          ? "blue"
          : "amber";
  return <span className={badgeClass(tone)}>{statusLabels[status]}</span>;
}
