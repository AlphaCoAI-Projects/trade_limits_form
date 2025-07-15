"use client"

import React, { useRef } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import SearchLoader from "./SearchLoader"

interface Company {
  alpha_code: string
  companyname: string
}

interface Props {
  open: boolean
  setOpen: (val: boolean) => void
  companyName: string
  setCompanyName: (val: string) => void
  companies: Company[]
  selectedCompany: Company | null
  setSelectedCompany: (val: Company | null) => void
  limit: number
  setLimit: (val: number) => void
  loading: boolean
}

const CompanySelector: React.FC<Props> = ({
  open,
  setOpen,
  companyName,
  setCompanyName,
  companies,
  selectedCompany,
  setSelectedCompany,
  loading,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={triggerRef}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCompany?.companyname || "Select company..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className="p-0 max-w-full sm:max-w-[300px]"
              style={{ width: triggerRef.current?.offsetWidth }}
            >
              <Command>
                <CommandInput
                  placeholder="Search company..."
                  value={companyName}
                  onValueChange={setCompanyName}
                />
                <CommandList>
                  {loading && <SearchLoader />}
                  {!loading && <CommandEmpty>No companies found.</CommandEmpty>}
                  <CommandGroup>
                    {companies?.map((company) => (
                      <CommandItem
                        key={company.alpha_code}
                        value={company.companyname}
                        onSelect={() => {
                          setSelectedCompany(company)
                          setCompanyName(company.companyname)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCompany?.alpha_code === company.alpha_code
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {company.companyname}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {selectedCompany && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCompany(null)
              setCompanyName("")
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export default CompanySelector
