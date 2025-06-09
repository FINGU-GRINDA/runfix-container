"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CacheSetting } from "./cache-setting";

export function GeneralSettingsCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>General Settings</CardTitle>
				<CardDescription>Configure general caching behavior</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<CacheSetting
					id="cache-enabled"
					label="Enable Translation Caching"
					description="When enabled, translations will be cached to improve performance"
					defaultChecked={true}
				/>

				<CacheSetting
					id="auto-invalidate"
					label="Auto-invalidate Cache"
					description="Automatically invalidate cached translations after they expire"
					defaultChecked={true}
				/>

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
	);
}
