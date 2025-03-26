"use client";

import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CacheSettingsPage() {
  const { organizationId } = useParams();
  // In a real app, fetch cache settings for this organization
  // const cacheSettings = await getCacheSettings(params.organizationId)

  return (
    <DashboardShell organizationId={organizationId as string}>
      <DashboardHeader
        heading="Cache Settings"
        text="Configure how translations are cached for your organization."
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general caching behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="cache-enabled">
                  Enable Translation Caching
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, translations will be cached to improve
                  performance
                </p>
              </div>
              <Switch id="cache-enabled" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="auto-invalidate">Auto-invalidate Cache</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically invalidate cached translations after they expire
                </p>
              </div>
              <Switch id="auto-invalidate" defaultChecked />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ttl">Cache TTL (Time to Live)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="ttl"
                  type="number"
                  defaultValue="86400"
                  className="max-w-[180px]"
                />
                <span className="text-sm text-muted-foreground">seconds</span>
              </div>
              <p className="text-xs text-muted-foreground">
                How long translations should be cached before expiring (86400
                seconds = 24 hours)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Fine-tune caching behavior for specific use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="cache-variants">Cache Language Variants</Label>
                <p className="text-sm text-muted-foreground">
                  Cache regional variants of languages separately (e.g., en-US
                  vs en-GB)
                </p>
              </div>
              <Switch id="cache-variants" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="case-sensitive">Case-Sensitive Caching</Label>
                <p className="text-sm text-muted-foreground">
                  Treat different cases as different cache entries
                </p>
              </div>
              <Switch id="case-sensitive" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="max-size">Maximum Cache Size</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="max-size"
                  type="number"
                  defaultValue="1000"
                  className="max-w-[180px]"
                />
                <span className="text-sm text-muted-foreground">MB</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum size of the translation cache (0 = unlimited)
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
