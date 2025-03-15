"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"

export function TranslationsFilter() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search translations..." className="w-full pl-8" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Source Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>English (en)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Spanish (es)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>French (fr)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>German (de)</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Target Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>English (en)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Spanish (es)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>French (fr)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>German (de)</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>API Key</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All API Keys</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Production</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Development</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Testing</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

