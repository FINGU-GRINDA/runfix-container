import { SidebarLayout } from "@/components/layouts/sidebar";

export default function OrganizationsPage() {
  return (
    <SidebarLayout breadcrumbs={{ current: "Organizations" }}>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <div className="rounded-lg border p-4">
          <p>Your organizations will appear here.</p>
        </div>
      </div>
    </SidebarLayout>
  );
}
