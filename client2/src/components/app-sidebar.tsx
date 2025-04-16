import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { serverApi } from "@/services/server";
import { useRouter } from "next/router";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const organizationId = router.query.id;

  const { data: dataUser } = serverApi.useQuery(
    "get",
    "/api/auth-sessions/who-am-i"
  );

  const { data: dataOrganizations } = serverApi.useQuery(
    "get",
    "/api/organizations",
    {
      params: {
        query: {
          userId: dataUser?.id as string,
        },
      },
    },
    { enabled: !!dataUser && !!dataUser.id }
  );

  const { data: dataProjects } = serverApi.useQuery(
    "get",
    "/api/projects",
    {
      params: {
        query: {
          organizationId: organizationId as string,
        },
      },
    },
    { enabled: !!organizationId }
  );

  const parsedOrganizations =
    dataOrganizations?.map((organization) => ({
      id: organization.id,
      name: organization.name,
      logo: GalleryVerticalEnd,
      plan: "Free",
    })) ?? [];

  const parsedProjects =
    dataProjects?.map((project) => ({
      name: project.name,
      url: `/organizations/${project.organizationId}/projects/${project.id}`,
      icon: Frame,
    })) ?? [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={parsedOrganizations} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={parsedProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: dataUser?.profilePicture ?? "",
            name: `${dataUser?.firstName} ${dataUser?.lastName}`,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
