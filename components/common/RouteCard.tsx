import Link from "next/link";

export function RouteCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded border border-border bg-surface p-5 shadow-sm hover:bg-surface-muted">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </Link>
  );
}
