import { useRouter } from "next/router";
import { SidebarLayout } from "@/components/layouts/sidebar";
import { serverApi } from "@/services/server";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { data: dataUser } = serverApi.useQuery(
    "get",
    "/api/auth-sessions/who-am-i"
  );

  const { data: organizationMembers } = serverApi.useQuery(
    "get",
    "/api/organization-members",
    {
      params: {
        query: {
          organizationId: router.query.id as string,
        },
      },
    },
    { enabled: !!router.query.id }
  );

  const { data: dataOrganization } = serverApi.useQuery(
    "get",
    "/api/organizations/{id}",
    {
      params: {
        path: {
          id: router.query.id as string,
        },
      },
    },
    { enabled: !!router.query.id }
  );

  return (
    <SidebarLayout
      breadcrumbs={{
        parent: {
          label: "Organizations",
          href: "/organizations",
        },
        current: `Organization ${dataOrganization?.name}`,
      }}
    >
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold">Organization Details</h1>
        <div className="rounded-lg border p-4"></div>
        <div className="flex flex-wrap"></div>
      </div>
    </SidebarLayout>
  );
}
