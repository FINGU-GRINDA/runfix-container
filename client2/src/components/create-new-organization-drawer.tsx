import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serverApi } from "@/services/server";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";

export const CreateNewOrganizationButton = () => {
  const [createNewOrganization, setCreateNewOrganization] = useQueryState(
    "create-new-organization",
    parseAsBoolean.withDefault(false)
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog
        open={createNewOrganization}
        onOpenChange={setCreateNewOrganization}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create a new organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new organization</DialogTitle>
            <DialogDescription>
              Fill in your organization details.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={createNewOrganization}
      onOpenChange={setCreateNewOrganization}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">Create a new organization</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a new organization</DrawerTitle>
          <DrawerDescription>
            Fill in your organization details.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const [, setCreateNewOrganization] = useQueryState(
    "create-new-organization",
    parseAsBoolean.withDefault(false)
  );
  const queryClient = useQueryClient();

  const createOrganization = serverApi.useMutation(
    "post",
    "/api/organizations",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/organizations"],
        });
      },
    }
  );

  const createOrganizationHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");

    if (!name) {
      throw new Error("Invalid name");
    }

    if (!description) {
      throw new Error("Invalid description");
    }

    await createOrganization.mutateAsync({
      body: { name: name as string, description: description as string },
    });

    setCreateNewOrganization(false);
  };
  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={createOrganizationHandler}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="Enter name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Enter description"
        />
      </div>
      <Button type="submit" disabled={createOrganization.isPending}>
        {createOrganization.isPending
          ? "Creating..."
          : "Create a new organization"}
      </Button>
    </form>
  );
}
