import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Mountain, Wrench, Boxes, Truck,
  ClipboardList, ShoppingCart, Fuel, Receipt, AlertOctagon,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Mines", url: "/mines", icon: Mountain },
  { title: "Equipment", url: "/equipment", icon: Wrench },
  { title: "Maintenance", url: "/maintenance", icon: ClipboardList },
  { title: "Downtime", url: "/downtime", icon: AlertOctagon },
  { title: "Inventory", url: "/inventory", icon: Boxes },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
  { title: "Production", url: "/production", icon: Fuel },
  { title: "Static Costs", url: "/static-costs", icon: Receipt },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center shrink-0">
            <Fuel className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-sidebar-foreground truncate">Reef Ops</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">Energy Engineering Fuels</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = currentPath === item.url || currentPath.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}