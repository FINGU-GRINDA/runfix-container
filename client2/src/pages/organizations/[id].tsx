import { useRouter } from "next/router";
import { SidebarLayout } from "@/components/layouts/sidebar";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <SidebarLayout
      breadcrumbs={{
        parent: {
          label: "Organizations",
          href: "/organizations",
        },
        current: `Organization ${id}`,
      }}
    >
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold">Organization Details</h1>
        <div className="rounded-lg border p-4">
          <p>Organization ID: {id}</p>
          <p>This is where organization details would appear.</p>
        </div>
      </div>
    </SidebarLayout>
  );
}
