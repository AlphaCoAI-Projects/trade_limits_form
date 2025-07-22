"use client"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label }  from "@/components/ui/label"

interface Props {
  value?: string
  dates: string[]
  loading: boolean
  onChange: (d: string) => void
}

export const DateSelector = ({ value, dates, loading, onChange }: Props) => (
  <div className="flex items-center gap-2">
    <Label className="text-sm font-medium">Select date:</Label>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {value
            ? new Date(value).toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "short", year: "numeric"
              })
            : `${loading ? "Fetching upcoming dates.." : "Select date"}`}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Upcoming dates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value ?? ""} onValueChange={onChange}>
          {dates.map(d => (
            <DropdownMenuRadioItem key={d} value={d}>
              {new Date(d).toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "short", year: "numeric"
              })}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)
