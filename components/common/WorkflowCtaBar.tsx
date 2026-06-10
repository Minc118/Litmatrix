import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type WorkflowCta = {
  label: string;
  href: string;
  primary?: boolean;
};

export function WorkflowCtaBar({ items }: { items: WorkflowCta[] }) {
  return (
    <div className="flex flex-wrap gap-3 rounded border border-border/50 bg-[#f8fafc] p-4">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className={`inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
            item.primary
              ? "border border-[#1f2933] bg-[#1f2933] !text-white hover:bg-[#2b3642] [&_span]:!text-white [&_svg]:!text-white"
              : "border border-border/50 bg-surface text-muted hover:text-foreground"
          }`}
        >
          <span className={item.primary ? "!text-white" : ""}>{item.label}</span>
          <ArrowRight className={`h-3.5 w-3.5 ${item.primary ? "text-white stroke-white" : ""}`} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
