import { SidebarLayout } from "@/components/layouts/sidebar";
import { serverApi } from "@/services/server";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateNewOrganizationButton } from "@/components/create-new-organization-drawer";

export default function OrganizationsPage() {
  const router = useRouter();
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

  const selectOrganizationHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const organizationId = e.currentTarget.dataset.id;
    await router.push(`/organizations/${organizationId}`);
  };

  return (
    <SidebarLayout breadcrumbs={{ current: "Organizations" }}>
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <CreateNewOrganizationButton />
        </div>

        {dataOrganizations?.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No organizations yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first organization to get started.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dataOrganizations?.map((organization) => (
            <Card
              key={organization.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted/50">
                    <GalleryVerticalEnd className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">{organization.name}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">
                  {organization.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">ID:</span> {organization.id}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 pt-3">
                <button
                  onClick={selectOrganizationHandler}
                  data-id={organization.id}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2"
                >
                  Select
                </button>
                <button
                  disabled
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2"
                >
                  Manage
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
