
# Reef Energy Engineering Fuels — Operations App (v1)

A single manager-facing web app that ties maintenance, inventory, production, and analytics together so REEF can see cost-per-ton, equipment health, and team/mine performance in one place.

## Access model
- Single role for v1: **Owner/Manager** (email + password login via Lovable Cloud).
- Google sign-in added alongside email/password by default.
- Multi-role (site supervisor, stock controller) deferred to v2 — schema will leave room for it.

## Core modules

### 1. Clients & Mines (foundation)
- Add/edit **Clients** (mining companies) and their **Mines/Sites** (in Mpumalanga).
- Each mine has: name, location, active contract dates, assigned team.
- Starts empty — manager adds the 3 active clients in-app.

### 2. Equipment & Components
- Register equipment per mine (crushers, screens, pumps, vehicles, etc.).
- Each component tracks: install date, expected lifespan (hours or tons processed), current usage, replacement cost.
- App calculates **% life remaining** and flags components nearing end-of-life.

### 3. Maintenance & Repairs
- Log a repair: equipment, date, description, labour hours, parts used, total cost, next-due date (or next-due tonnage).
- **Auto-schedule next service** based on interval (time or tonnes).
- Dashboard alerts for repairs due soon / overdue.
- Repair history per component feeds lifespan analytics.

### 4. Inventory & Suppliers
- **Stock items** with: current qty, reorder point, reorder qty, unit cost, preferred supplier.
- **Suppliers** with contact info + linked items.
- When a repair consumes parts, stock auto-decrements.
- When qty ≤ reorder point → system **creates a Draft Purchase Order** for manager approval.
- Manager reviews PO → approves → status becomes "Ordered" (email to supplier is a v2 add-on; v1 shows the PO ready to send).
- Received orders increment stock and log spend.

### 5. Production Logging
- Daily/monthly entry per mine: **tonnes produced**, magnetite consumed, overtime hours, other variable inputs.
- Static costs (rent, salaries, insurance) entered monthly per mine or company-wide.
- Variable costs come automatically from repairs, stock consumption, and supplier orders.

### 6. Analytics Dashboard
The manager's home screen. Filterable by mine, client, and date range.

**KPI cards:**
- Rand per ton (total cost ÷ tonnes)
- Total tonnes this month vs last
- Maintenance spend MTD
- Inventory value on hand
- Draft POs awaiting approval

**Charts:**
- Cost breakdown: static vs variable (magnetite, maintenance, overtime, other)
- Tonnes produced per mine (bar)
- Cost/ton trend (line, 12 months)
- Equipment wear: tonnes processed vs expected lifespan per component
- Top 5 cost-driving components (which parts break most / cost most)

**Performance scoring:**
- **Mine performance**: cost/ton vs target, uptime %, output vs plan.
- **Client performance**: contract profitability = revenue − allocated costs.
- **Team performance**: repairs completed on time, downtime hours, cost/ton for their mine.
- Simple traffic-light rating (green/amber/red) per mine/team/client.

## Data model (Lovable Cloud / Postgres)

```text
clients            (id, name, contact, contract_start, contract_end, active)
mines              (id, client_id, name, location, team_name, target_cost_per_ton)
equipment          (id, mine_id, name, type, install_date,
                    expected_life_tons, expected_life_hours, replacement_cost)
maintenance_logs   (id, equipment_id, date, description, labour_hours,
                    total_cost, next_due_date, next_due_tons)
maintenance_parts  (id, maintenance_id, stock_item_id, qty, unit_cost)
suppliers          (id, name, email, phone)
stock_items        (id, name, sku, qty_on_hand, reorder_point,
                    reorder_qty, unit_cost, supplier_id)
purchase_orders    (id, supplier_id, status[draft|approved|ordered|received],
                    created_at, approved_at, total_cost)
po_lines           (id, po_id, stock_item_id, qty, unit_cost)
production_logs    (id, mine_id, date, tons_produced, magnetite_used,
                    overtime_hours, notes)
static_costs       (id, mine_id, month, category, amount)
profiles           (id → auth.users, full_name, role)
```

All tables: RLS enabled, `authenticated` role can read/write (single-manager v1), `service_role` full access. `user_roles` table + `has_role()` scaffolded now for v2 multi-role.

## Automation logic

- **Auto-reorder trigger**: on stock qty update, if `qty_on_hand ≤ reorder_point` and no existing draft PO for that supplier contains the item → create draft PO line.
- **Next-service scheduler**: on maintenance log insert, compute next_due from equipment's service interval + current usage.
- **Cost rollup**: server function aggregates repairs + PO spend + static costs + production by mine/month for the dashboard.
- **Lifespan projection**: `(expected_life_tons − tons_since_install) / avg_monthly_tons` = months remaining.

## Tech shape
- TanStack Start (already scaffolded), Tailwind, shadcn/ui.
- Lovable Cloud enabled → Postgres + Auth + server functions.
- Recharts for charts; TanStack Query for data; Zod for validation.
- Design: clean industrial dashboard, dark-mode ready, high-density tables. Logo swapped in when Brandon sends it.

## Build order
1. Enable Lovable Cloud + auth (email/password + Google) + manager profile.
2. Schema migration (all tables above + RLS + grants + user_roles scaffold).
3. App shell: sidebar nav (Dashboard, Mines, Equipment, Maintenance, Inventory, Suppliers, Production, Reports), header, sign-out.
4. Clients & Mines CRUD.
5. Equipment CRUD + lifespan fields.
6. Maintenance logging + parts consumption + next-due scheduling.
7. Inventory + suppliers + auto-draft PO + approval flow.
8. Production + static cost entry.
9. Analytics dashboard (KPIs, charts, performance traffic lights).
10. Head/meta for SEO + REEF branding, favicon slot for logo.

## Out of scope for v1 (call out now)
- Emailing POs directly to suppliers (v1 shows approved PO to send manually).
- Multi-role logins for supervisors/stock controllers.
- Mobile-first data-capture flows for site staff.
- Payroll integration, revenue invoicing to clients (needed for full profit math — v1 uses manual revenue entry per contract).
- Offline mode for on-mine use.

Confirm the plan and I'll start with Cloud + auth + schema, then build the modules in the order above.
