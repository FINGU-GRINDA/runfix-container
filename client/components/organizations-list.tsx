"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Edit, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useState } from "react";

// Mock data for organizations
const initialOrganizations = [
	{
		id: "1",
		name: "Acme Corp",
		members: 12,
		apiKeys: 3,
		plan: "enterprise",
		created: "2022-05-10",
	},
	{
		id: "2",
		name: "Tech Solutions",
		members: 8,
		apiKeys: 2,
		plan: "business",
		created: "2023-01-15",
	},
	{
		id: "3",
		name: "Global Translations",
		members: 5,
		apiKeys: 1,
		plan: "starter",
		created: "2023-06-22",
	},
	{
		id: "4",
		name: "Localize Pro",
		members: 3,
		apiKeys: 1,
		plan: "starter",
		created: "2023-09-05",
	},
	{
		id: "5",
		name: "Translate Now",
		members: 7,
		apiKeys: 2,
		plan: "business",
		created: "2023-03-18",
	},
];

export function OrganizationsList() {
	const [organizations, setOrganizations] = useState(initialOrganizations);

	const deleteOrganization = (id: string) => {
		setOrganizations(organizations.filter((org) => org.id !== id));
		toast({
			title: "Organization deleted",
			description: "The organization has been deleted successfully.",
		});
	};

	const getPlanBadge = (plan: string) => {
		switch (plan) {
			case "enterprise":
				return <Badge className="bg-primary">Enterprise</Badge>;
			case "business":
				return <Badge className="bg-blue-500">Business</Badge>;
			case "starter":
				return <Badge>Starter</Badge>;
			default:
				return <Badge variant="outline">{plan}</Badge>;
		}
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Members</TableHead>
						<TableHead>API Keys</TableHead>
						<TableHead>Plan</TableHead>
						<TableHead>Created</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{organizations.map((org) => (
						<TableRow key={org.id}>
							<TableCell className="font-medium">{org.name}</TableCell>
							<TableCell>{org.members}</TableCell>
							<TableCell>{org.apiKeys}</TableCell>
							<TableCell>{getPlanBadge(org.plan)}</TableCell>
							<TableCell>{org.created}</TableCell>
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
										<DropdownMenuItem asChild>
											<a href={`/organizations/${org.id}/members`}>
												<Users className="mr-2 h-4 w-4" />
												Manage Members
											</a>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<a href={`/organizations/${org.id}/edit`}>
												<Edit className="mr-2 h-4 w-4" />
												Edit Organization
											</a>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => deleteOrganization(org.id)}
											className="text-destructive focus:text-destructive"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete Organization
										</DropdownMenuItem>
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
