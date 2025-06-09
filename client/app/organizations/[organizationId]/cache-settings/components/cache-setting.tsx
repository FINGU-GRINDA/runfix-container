"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface CacheSettingProps {
	id: string;
	label: string;
	description: string;
	defaultChecked: boolean;
}

export function CacheSetting({
	id,
	label,
	description,
	defaultChecked,
}: CacheSettingProps) {
	return (
		<div className="flex items-center justify-between space-x-2">
			<div className="space-y-0.5">
				<Label htmlFor={id}>{label}</Label>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			<Switch id={id} defaultChecked={defaultChecked} />
		</div>
	);
}
