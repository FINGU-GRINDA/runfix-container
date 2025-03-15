"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

export default function SettingsPage() {
  const { organizationId } = useParams();
  // In a real app, fetch settings for this organization
  // const settings = await getOrganizationSettings(params.organizationId)

  return (
    <DashboardShell organizationId={organizationId as string}>
      <DashboardHeader
        heading="Settings"
        text="Manage your organization settings and preferences."
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Update your organization information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Acme Corp" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org-description">Description</Label>
                <Input
                  id="org-description"
                  defaultValue="Global translation services"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org-website">Website</Label>
                <Input
                  id="org-website"
                  type="url"
                  defaultValue="https://acme.example.com"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Current Plan</Label>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                    Enterprise
                  </div>
                  <span className="text-sm text-muted-foreground">
                    $499/month
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Billing Cycle</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly (Save 10%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Billing History</Button>
              <Button>Update Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure API behavior for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="rate-limiting">Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable rate limiting for API requests
                  </p>
                </div>
                <Switch id="rate-limiting" defaultChecked />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rate-limit">
                  Rate Limit (requests per minute)
                </Label>
                <Input id="rate-limit" type="number" defaultValue="1000" />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="cors">CORS Settings</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow cross-origin requests to your API
                  </p>
                </div>
                <Switch id="cors" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save API Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="api-key-alerts">API Key Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when API keys are created or revoked
                  </p>
                </div>
                <Switch id="api-key-alerts" defaultChecked />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="usage-alerts">Usage Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when approaching usage limits
                  </p>
                </div>
                <Switch id="usage-alerts" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
