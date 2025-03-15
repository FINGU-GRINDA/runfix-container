"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Key, Globe, Database, BarChart3, Settings, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to get organization name from ID
function getOrganizationName(id: string): string {
  const orgMap: Record<string, string> = {
    "acme-corp": "Acme Corp",
    "tech-solutions": "Tech Solutions",
    "global-trans": "Global Translations",
  };
  return orgMap[id] || id;
}

export function DashboardShell(props: {
  organizationId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Only show organization-specific routes if we have an organizationId
  const routes = props.organizationId
    ? [
        {
          title: "Dashboard",
          href: `/organizations/${props.organizationId}`,
          icon: BarChart3,
        },
        {
          title: "API Keys",
          href: `/organizations/${props.organizationId}/api-keys`,
          icon: Key,
        },
        {
          title: "Translations",
          href: `/organizations/${props.organizationId}/translations`,
          icon: Globe,
        },
        {
          title: "Cache Settings",
          href: `/organizations/${props.organizationId}/cache-settings`,
          icon: Database,
        },
        {
          title: "Settings",
          href: `/organizations/${props.organizationId}/settings`,
          icon: Settings,
        },
      ]
    : [
        {
          title: "Organizations",
          href: "/organizations",
          icon: Users,
        },
      ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">i18n Cache</h1>
              {props.organizationId && (
                <>
                  <span className="text-muted-foreground mx-2">/</span>
                  <Link
                    href={`/organizations/${props.organizationId}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {getOrganizationName(props.organizationId)}
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              {props.organizationId && (
                <Select
                  value={props.organizationId}
                  onValueChange={(value) =>
                    (window.location.href = `/organizations/${value}`)
                  }
                >
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Switch organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme-corp">Acme Corp</SelectItem>
                    <SelectItem value="tech-solutions">
                      Tech Solutions
                    </SelectItem>
                    <SelectItem value="global-trans">
                      Global Translations
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader>
              <div className="flex h-14 items-center border-b px-4">
                <h2 className="text-lg font-semibold">i18n Cache</h2>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {/* Always show Organizations link */}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/organizations"}
                        tooltip="Organizations"
                      >
                        <Link href="/organizations">
                          <Users />
                          <span>Organizations</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Show organization-specific routes if we have an organizationId */}
                    {props.organizationId &&
                      routes
                        .filter((route) => route.title !== "Organizations")
                        .map((route) => (
                          <SidebarMenuItem key={route.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === route.href}
                              tooltip={route.title}
                            >
                              <Link href={route.href}>
                                <route.icon />
                                <span>{route.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4 text-xs text-muted-foreground">
                <p>© 2025 i18n Cache</p>
                <p>Version 1.0.0</p>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 p-8">
              <div className="mx-auto max-w-7xl">{props.children}</div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
