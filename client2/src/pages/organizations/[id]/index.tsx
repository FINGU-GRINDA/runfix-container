import { useRouter } from "next/router";
import { SidebarLayout } from "@/components/layouts/sidebar";
import { serverApi } from "@/services/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrganizationDetailPage() {
  const router = useRouter();

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

  const { data: dataProjects } = serverApi.useQuery(
    "get",
    "/api/projects",
    {
      params: {
        query: {
          organizationId: router.query.id as string,
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
        <div className="text-lg font-bold">Projects</div>
        <div className="flex flex-wrap">
          {dataProjects?.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Created at{" "}
                  {new Date(project.createdAt as string).toLocaleDateString()}
                </p>
                <p>
                  Last updated at{" "}
                  {new Date(project.updatedAt as string).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Edit</Button>
                <Button>Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-lg font-bold">Organization Members</div>
        <div className="flex flex-wrap">
          {organizationMembers?.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle>{member.role}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Joined at{" "}
                  {new Date(member.createdAt as string).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Edit</Button>
                <Button>Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
