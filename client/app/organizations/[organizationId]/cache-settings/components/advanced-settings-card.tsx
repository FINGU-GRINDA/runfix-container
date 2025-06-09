"use client";

import { Button } from "@/components/ui/button";
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

export function AdvancedSettingsCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Advanced Settings</CardTitle>
				<CardDescription>
					Fine-tune caching behavior for specific use cases
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<CacheSetting
					id="cache-variants"
					label="Cache Language Variants"
					description="Cache regional variants of languages separately (e.g., en-US vs en-GB)"
					defaultChecked={true}
				/>

				<CacheSetting
					id="case-sensitive"
					label="Case-Sensitive Caching"
					description="Treat different cases as different cache entries"
					defaultChecked={false}
				/>

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
	);
}
