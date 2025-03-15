"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { TranslationsList } from "@/components/translations-list";
import { TranslationsFilter } from "@/components/translations-filter";
import { useParams } from "next/navigation";

export default function TranslationsPage() {
  const { organizationId } = useParams();
  // In a real app, fetch translations for this organization
  // const translations = await getTranslations(params.organizationId)

  return (
    <DashboardShell organizationId={organizationId as string}>
      <DashboardHeader
        heading="Translation Cache"
        text="View and edit cached translations across all API keys."
      >
        <TranslationsFilter />
      </DashboardHeader>
      <TranslationsList />
    </DashboardShell>
  );
}
