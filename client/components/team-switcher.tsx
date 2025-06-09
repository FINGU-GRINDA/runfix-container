"use client";

import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { ellysiaClient } from "@/services/ellysia";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function TeamSwitcher() {
	const params = useParams();
	const router = useRouter();
	const activeOrganizationId = params["organization-id"];
	const { data: dataUser } = ellysiaClient.useQuery(
		"post",
		"/api/sessions/who-am-i",
	);

	const { data: dataOrganizations } = ellysiaClient.useQuery(
		"get",
		"/api/organizations",
		{
			params: {
				query: {
					userId: dataUser?.data?.User?.id as string,
				},
			},
		},
		{
			enabled: !!dataUser?.data?.User?.id,
		},
	);

	useEffect(() => {
		if (!dataUser) {
			return;
		}

		if (!dataOrganizations) {
			return;
		}

		if (activeOrganizationId) {
			return;
		}

		const firstOrganization = dataOrganizations[0];
		router.push(`/organizations/${firstOrganization.id}`);
	}, [activeOrganizationId, dataOrganizations, dataUser, router]);

	const activeOrganization = dataOrganizations?.find((v) => {
		if (v.id === activeOrganizationId) {
			return true;
		}
		return false;
	});
	const { isMobile } = useSidebar();

	if (!activeOrganization) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<Building2 className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeOrganization.name}
								</span>
								{/* <span className="truncate text-xs">{activeOrganization.}</span> */}
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Teams
						</DropdownMenuLabel>
						{dataOrganizations?.map((team, index) => (
							<DropdownMenuItem
								key={team.name}
								onClick={() => {
									router.push(`/organizations/${team.id}`);
								}}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-md border">
									<Building2 className="size-4" />
								</div>
								{team.name}
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">Add team</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
