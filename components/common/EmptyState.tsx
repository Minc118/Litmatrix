import { FileText } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="lm-card flex min-h-40 flex-col items-center justify-center p-8 text-center">
      <FileText className="mb-3 h-8 w-8 text-muted" aria-hidden="true" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{message}</p>
    </div>
  );
}
