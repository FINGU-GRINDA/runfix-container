"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { GeneralSettingsCard } from "./components/general-settings-card";
import { AdvancedSettingsCard } from "./components/advanced-settings-card";

export default function Page() {
  const { organizationId } = useParams();
  // In a real app, fetch cache settings for this organization
  // const cacheSettings = await getCacheSettings(params.organizationId)

  return (
    <DashboardShell organizationId={organizationId as string}>
      <DashboardHeader
        heading="Cache Settings"
        text="Configure how translations are cached for your organization."
      />

      <div className="grid gap-6">
        <GeneralSettingsCard />
        <AdvancedSettingsCard />
      </div>
    </DashboardShell>
  );
}
