"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUpcomingDates } from "@/hooks/useUpcomingDates"

export function DropdownMenuRadio() {
  const [dateItem, setDateItem] = React.useState<string | null>(null)
  const {dates, isLoading} = useUpcomingDates()
  
  const handleValueChange = (value: string) => {
    setDateItem(value)
  }

  // Helper function to format date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric', 
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{dateItem || "Select Date"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Date</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={dateItem as string} onValueChange={handleValueChange}>
          {dates?.map((date) => (
            <DropdownMenuRadioItem key={date} value={date}>
              {formatDate(date)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
