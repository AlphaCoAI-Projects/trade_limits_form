"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  upper_limit: string
  super_upper_limit: string
  lower_limit: string
  super_lower_limit: string
  lower_band: string
  median_band: string
  upper_band: string
}

interface Props {
  formData: FormData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  bandsLoading: boolean
  selectedCompany: boolean
}

const LineItemsFields: React.FC<Props> = ({
  formData,
  onChange,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="upper_limit">Upper Limit</Label>
          <Input
            id="upper_limit"
            name="upper_limit"
            type="number"
            value={formData.upper_limit}
            onChange={onChange}
            placeholder="Enter Upper Limit"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="super_upper_limit">Super Upper Limit</Label>
          <Input
            id="super_upper_limit"
            name="super_upper_limit"
            type="number"
            value={formData.super_upper_limit}
            onChange={onChange}
            placeholder="Enter Super Upper Limit"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
          <Label htmlFor="lower_limit">Lower Limit</Label>
          <Input
            id="lower_limit"
            name="lower_limit"
            type="number"
            value={formData.lower_limit}
            onChange={onChange}
            placeholder="Enter Lower Limit"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="super_lower_limit">Super Lower Limit</Label>
          <Input
            id="super_lower_limit"
            name="super_lower_limit"
            type="number"
            value={formData.super_lower_limit}
            onChange={onChange}
            placeholder="Enter Super Lower Limit"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
          <Label htmlFor="lower_band">Lower Band</Label>
          <Input
            id="lower_band"
            name="lower_band"
            type="number"
            value={formData.lower_band}
            onChange={onChange}
            placeholder="Enter Lower Band"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="median_band">Median Band</Label>
          <Input
            id="median_band"
            name="median_band"
            type="number"
            value={formData.median_band}
            onChange={onChange}
            placeholder="Enter Median Band"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="upper_band">Upper Band</Label>
          <Input
            id="upper_band"
            name="upper_band"
            type="number"
            value={formData.upper_band}
            onChange={onChange}
            placeholder="Enter Upper Band"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}

export default LineItemsFields
