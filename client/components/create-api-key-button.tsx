"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define API Key interface for strong typing
interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: "active" | "inactive" | "revoked";
  organization: string;
}

interface CreateApiKeyButtonProps {
  organizationId?: string;
  onApiKeyCreated?: (apiKey: ApiKey) => void;
}

export function CreateApiKeyButton({
  organizationId,
  onApiKeyCreated,
}: CreateApiKeyButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState(organizationId || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In a real app, you would call an API to create the key
      // const newApiKey = await createApiKey({ name, organizationId: organization })

      // Mock response
      const newApiKey: ApiKey = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        key: `i18n_${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toISOString().split("T")[0],
        lastUsed: new Date().toISOString().split("T")[0],
        status: "active",
        organization: organization,
      };

      toast({
        title: "API Key created",
        description: `New API key "${name}" has been created successfully.`,
      });

      // Call the callback if provided
      if (onApiKeyCreated) {
        onApiKeyCreated(newApiKey);
      }

      setOpen(false);
      setName("");
      if (!organizationId) setOrganization("");
    } catch (e) {
      console.error(e);
      toast({
        title: "Error creating API key",
        description:
          "There was an error creating the API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for accessing the translation service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Production API Key"
                required
              />
            </div>
            {!organizationId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organization" className="text-right">
                  Organization
                </Label>
                <Select
                  value={organization}
                  onValueChange={setOrganization}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme-corp">Acme Corp</SelectItem>
                    <SelectItem value="tech-solutions">
                      Tech Solutions
                    </SelectItem>
                    <SelectItem value="global-trans">
                      Global Translations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create API Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
