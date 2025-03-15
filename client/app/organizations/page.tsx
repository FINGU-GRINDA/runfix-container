"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { OrganizationsList } from "@/components/organizations-list";
import { CreateOrganizationButton } from "@/components/create-organization-button";
import { useParams } from "next/navigation";

export default function OrganizationsPage() {
  const { organizationId } = useParams();
  // In a real app, fetch organizations for the current user
  // const organizations = await getUserOrganizations()

  return (
    <DashboardShell organizationId={organizationId as string}>
      <DashboardHeader
        heading="Organizations"
        text="Manage your organizations and their members."
      >
        <CreateOrganizationButton />
      </DashboardHeader>
      <OrganizationsList />
    </DashboardShell>
  );
}
