import { useRouter } from "next/router";
import { SidebarLayout } from "@/components/layouts/sidebar";
import { serverApi } from "@/services/server";
import { GalleryVerticalEnd } from "lucide-react";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { data: dataUser } = serverApi.useQuery(
    "get",
    "/api/auth-sessions/who-am-i"
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
        <div className="rounded-lg border p-4">
          <p>Organization ID: {dataOrganization?.id}</p>
          <p>This is where organization details would appear.</p>
        </div>
        <div className="flex flex-wrap">
          {dataOrganizations?.map((organization) => (
            <div key={organization.id} className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md border">
                <GalleryVerticalEnd className="size-4" />
              </div>
              {organization.name}
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
