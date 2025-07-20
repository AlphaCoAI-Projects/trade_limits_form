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
import { useDateDropdown } from "@/hooks/useDateDropdown"
import { useGetDate } from "@/hooks/useGetDate"

export function DropdownMenuRadio() {
  const { dateItem, setDateItem } = useDateDropdown()
  const { dates } = useGetDate()

  React.useEffect(()=>{
    console.log(dates)              
  })

  const handleValueChange = (value: string) => {
    setDateItem(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{dateItem || "Select Date"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Date</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={dateItem} onValueChange={handleValueChange}>
          {dates?.map((date) => (
            <DropdownMenuRadioItem key={date} value={date}>
              {date}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
