"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SplitsVolatilityData } from "@/hooks/useLineItemsForm"

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
  splitsVolatility: SplitsVolatilityData | null
}

const LineItemsFields: React.FC<Props> = ({
  formData,
  onChange,
  disabled,
  splitsVolatility,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Uneditable - Splits & Volatility */}
      {/* {splitsVolatility && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Splits</h3>
            {["sales", "operating_profit", "net_profit"].map((key) => (
              <div key={key} className="space-y-2">
                <Label>
                  {key.replace("_", " ").charAt(0).toUpperCase() +
                    key.replace("_", " ").slice(1)}
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {splitsVolatility.splits?.[
                    key as keyof typeof splitsVolatility.splits
                  ]?.map((value, i) => (
                    <Input
                      key={i}
                      value={value.toFixed(4)}
                      disabled
                      className="text-muted-foreground"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold">Volatility</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {Object.entries(splitsVolatility.volatility).map(([key, val]) => (
                <div className="space-y-2" key={key}>
                  <Label>
                    {key.replace("_", " ").charAt(0).toUpperCase() +
                      key.replace("_", " ").slice(1)}
                  </Label>
                  <Input
                    value={val?.toFixed(4)}
                    disabled
                    className="text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

<div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold">Splits</h3>
      {["sales", "operating_profit", "net_profit"].map((key) => {
        const values = splitsVolatility?.splits?.[key as keyof typeof splitsVolatility.splits]
        return (
          <div key={key} className="space-y-2">
            <Label>
              {key.replace("_", " ").charAt(0).toUpperCase() +
                key.replace("_", " ").slice(1)}
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {values && values.length > 0 ? (
                values.map((value, i) => (
                  <Input
                    key={i}
                    value={value.toFixed(4)}
                    disabled
                    className="text-muted-foreground"
                  />
                ))
              ) : (
                <div className="col-span-4 text-sm text-muted-foreground italic">
                  No data
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>

    <div>
      <h3 className="text-lg font-semibold">Volatility</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {["sales", "operating_profit", "adjusted_pbt", "adjusted_pat"].map((key) => (
          <div className="space-y-2" key={key}>
            <Label>
              {key.replace("_", " ").charAt(0).toUpperCase() +
                key.replace("_", " ").slice(1)}
            </Label>
            <Input
              value={
                splitsVolatility?.volatility?.[key as keyof typeof splitsVolatility.volatility]?.toFixed(4) || ""
              }
              disabled
              className="text-muted-foreground"
              placeholder="No data"
            />
          </div>
        ))}
      </div>
    </div>
  </div>

      {/* RIGHT: Editable Limits & Bands */}
      <div className="space-y-6">
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
    </div>
  )
}

export default LineItemsFields
