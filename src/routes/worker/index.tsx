import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Wrench, AlertOctagon, Fuel } from "lucide-react";

export const Route = createFileRoute("/worker/")({
  component: WorkerHome,
});

const tiles = [
  { to: "/worker/log-usage", label: "Log Usage", icon: Boxes, color: "bg-primary text-primary-foreground" },
  { to: "/worker/log-repair", label: "Log Repair", icon: Wrench, color: "bg-accent text-accent-foreground" },
  { to: "/worker/log-downtime", label: "Log Downtime", icon: AlertOctagon, color: "bg-destructive text-destructive-foreground" },
  { to: "/worker/log-production", label: "Log Production", icon: Fuel, color: "bg-secondary text-secondary-foreground border" },
] as const;

function WorkerHome() {
  return (
    <div className="space-y-4">
      <div className="py-4">
        <h1 className="text-2xl font-bold">On-site logging</h1>
        <p className="text-sm text-muted-foreground">Tap to log activity. Everything syncs to the office instantly.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`${t.color} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square shadow-md active:scale-95 transition-transform`}
          >
            <t.icon className="w-10 h-10" />
            <span className="text-base font-semibold text-center leading-tight">{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}