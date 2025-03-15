"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Copy, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
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

// Props interface for ApiKeysList component
interface ApiKeysListProps {
  organizationId: string;
}

// Mock data for API keys
const initialApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "i18n_prod_a1b2c3d4e5f6g7h8i9j0",
    created: "2023-10-15",
    lastUsed: "2023-12-01",
    status: "active",
    organization: "Acme Corp",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "i18n_dev_z9y8x7w6v5u4t3s2r1q0",
    created: "2023-11-20",
    lastUsed: "2023-11-30",
    status: "active",
    organization: "Acme Corp",
  },
  {
    id: "3",
    name: "Testing API Key",
    key: "i18n_test_j9i8h7g6f5e4d3c2b1a0",
    created: "2023-09-05",
    lastUsed: "2023-10-15",
    status: "active",
    organization: "Tech Solutions",
  },
  {
    id: "4",
    name: "Legacy API Key",
    key: "i18n_legacy_q1w2e3r4t5y6u7i8o9p0",
    created: "2022-05-10",
    lastUsed: "2023-08-22",
    status: "revoked",
    organization: "Acme Corp",
  },
  {
    id: "5",
    name: "Staging API Key",
    key: "i18n_staging_a0s9d8f7g6h5j4k3l2z1",
    created: "2023-07-18",
    lastUsed: "2023-11-28",
    status: "active",
    organization: "Tech Solutions",
  },
];

export function ApiKeysList({ organizationId }: ApiKeysListProps) {
  // Filter API keys by organization ID
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(
    initialApiKeys.filter(key => key.organization.toLowerCase().replace(/\s+/g, '-') === organizationId)
  );

  /**
   * Copy API key to clipboard and show success notification
   * @param text - The API key to copy
   */
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast({
      title: "API Key copied to clipboard",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, status: "revoked" } : key
      )
    );
    toast({
      title: "API Key revoked",
      description: "The API key has been revoked successfully.",
    });
  };

  const regenerateApiKey = (id: string) => {
    // In a real app, you would call an API to regenerate the key
    const newKey = `i18n_${Math.random().toString(36).substring(2, 15)}`;
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              key: newKey,
              lastUsed: new Date().toISOString().split("T")[0],
            }
          : key
      )
    );
    toast({
      title: "API Key regenerated",
      description: "A new API key has been generated.",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className="font-medium">{apiKey.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs">
                    {apiKey.key.substring(0, 10)}...
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{apiKey.organization}</TableCell>
              <TableCell>{apiKey.created}</TableCell>
              <TableCell>{apiKey.lastUsed}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    apiKey.status === "active" ? "default" : "destructive"
                  }
                >
                  {apiKey.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy API Key
                    </DropdownMenuItem>
                    {apiKey.status === "active" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => regenerateApiKey(apiKey.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => revokeApiKey(apiKey.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Revoke
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
