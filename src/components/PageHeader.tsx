import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-accent-foreground/70 font-medium mb-1">R.E.E.F · Operations</div>
          <h1 className="text-display text-3xl md:text-4xl font-normal text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="mining-rule mt-4 opacity-60" />
    </div>
  );
}