"use client";
import { ApiKeysList } from "@/components/api-keys-list";
import { CreateApiKeyButton } from "@/components/create-api-key-button";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { useParams } from "next/navigation";

export default function ApiKeysPage() {
	const { organizationId } = useParams();
	// In a real app, fetch API keys for this organization
	// const apiKeys = await getApiKeys(params.organizationId)

	return (
		<DashboardShell organizationId={organizationId as string}>
			<DashboardHeader
				heading="API Keys"
				text="Manage your API keys for accessing the translation service."
			>
				<CreateApiKeyButton organizationId={organizationId as string} />
			</DashboardHeader>
			<ApiKeysList organizationId={organizationId as string} />
		</DashboardShell>
	);
}
