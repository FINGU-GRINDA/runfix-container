"use client";

import type React from "react";

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
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateOrganizationButton() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [plan, setPlan] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// In a real app, you would call an API to create the organization
		toast({
			title: "Organization created",
			description: `New organization "${name}" has been created successfully.`,
		});

		setOpen(false);
		setName("");
		setPlan("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create Organization
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Organization</DialogTitle>
						<DialogDescription>
							Create a new organization to manage members and API keys.
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
								placeholder="Acme Corp"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="plan" className="text-right">
								Plan
							</Label>
							<Select value={plan} onValueChange={setPlan} required>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select plan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="starter">Starter</SelectItem>
									<SelectItem value="business">Business</SelectItem>
									<SelectItem value="enterprise">Enterprise</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Create Organization</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
