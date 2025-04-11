import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serverApi } from "@/services/server";
import Image from "next/image";
import { EditOrganizationMemberButton } from "./edit-organization-member-handler";

export const OrganizationMemberCard = (params: {
  organizationMemberId: string;
}) => {
  const { data: dataUser } = serverApi.useQuery(
    "get",
    "/api/users/{id}",
    {
      params: {
        path: {
          id: params.organizationMemberId,
        },
      },
    },
    { enabled: !!params.organizationMemberId }
  );

  const deleteOrganizationMember = serverApi.useMutation(
    "delete",
    "/api/organization-members/{id}"
  );

  const removeMemberHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    await deleteOrganizationMember.mutateAsync({
      params: {
        path: {
          id: params.organizationMemberId,
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {dataUser?.firstName} {dataUser?.lastName}
        </CardTitle>
        {/* <CardDescription>{}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Image
          src={dataUser?.profilePicture ?? ""}
          width={100}
          height={100}
          alt="profile-picture"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <EditOrganizationMemberButton />
        <Button
          onClick={removeMemberHandler}
          disabled={deleteOrganizationMember.isPending}
        >
          {deleteOrganizationMember.isPending ? "Removing..." : "Remove Member"}
        </Button>
      </CardFooter>
    </Card>
  );
};
