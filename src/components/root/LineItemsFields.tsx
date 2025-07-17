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
  target_pe_lower: string
  target_pe_upper: string
}

interface Props {
  formData: FormData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  bandsLoading: boolean
  selectedCompany: boolean
  splitsVolatility: SplitsVolatilityData | null
  fy26Projection: {
    ebitda?: number
    ebitda_margin?: number
    total_revenue?: number
    profit_after_tax?: number
  } | null
  brokerageConsensus: {
    avg_revenue?: number
    avg_ebitda?: number
    avg_pbt?: number
    avg_pat?: number
    avg_adj_pat?: number
  } | null
}

const LineItemsFields: React.FC<Props> = ({
  formData,
  onChange,
  disabled,
  splitsVolatility,
  fy26Projection,
  brokerageConsensus,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Uneditable - Splits & Volatility */}
      <div className="space-y-6">
        {/* splits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Splits</h3>
          {["sales", "operating_profit", "net_profit"].map((key) => {
            const values =
              splitsVolatility?.splits?.[
                key as keyof typeof splitsVolatility.splits
              ]
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

        {/* volatility  */}
        {splitsVolatility?.volatility &&
        Object.keys(splitsVolatility.volatility).some(
          (key) =>
            splitsVolatility.volatility?.[
              key as keyof typeof splitsVolatility.volatility
            ] !== null
        ) ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Volatility</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {[
                "sales",
                "operating_profit",
                "adjusted_pbt",
                "adjusted_pat",
              ].map((key) => (
                <div className="space-y-2" key={key}>
                  <Label>
                    {key.replace("_", " ").charAt(0).toUpperCase() +
                      key.replace("_", " ").slice(1)}
                  </Label>
                  <Input
                    value={
                      splitsVolatility?.volatility?.[
                        key as keyof typeof splitsVolatility.volatility
                      ]?.toFixed(4) || ""
                    }
                    disabled
                    className="text-muted-foreground"
                    placeholder="No data"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            No volatility data available
          </p>
        )}

        {/* projections  */}
        {fy26Projection && Object.keys(fy26Projection).length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">FY26 Concall Projections</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {Object.entries(fy26Projection).map(([key, value]) => (
                <div className="space-y-2" key={key}>
                  <Label>
                    {key.replace(/_/g, " ").charAt(0).toUpperCase() +
                      key.replace(/_/g, " ").slice(1)}
                  </Label>
                  <Input
                    value={
                      value !== undefined && value !== null
                        ? value.toFixed(2)
                        : "0.00"
                    }
                    disabled
                    className="text-muted-foreground"
                    placeholder="No data"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            No FY26 projections data available
          </p>
        )}

        {/* brokerage consensus */}
        {brokerageConsensus && Object.keys(brokerageConsensus).length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">FY26 Brokerage Consensus</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {Object.entries(brokerageConsensus).map(([key, value]) => (
                <div className="space-y-2" key={key}>
                  <Label>
                    {key.replace(/_/g, " ").charAt(0).toUpperCase() +
                      key.replace(/_/g, " ").slice(1)}
                  </Label>
                  <Input
                    value={
                      value !== undefined && value !== null
                        ? value.toString()
                        : "0"
                    }
                    disabled
                    className="text-muted-foreground"
                    placeholder="No data"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">No FY26 brokerage data available</p>
        )}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_pe_lower">Target PE Lower</Label>
            <Input
              id="target_pe_lower"
              name="target_pe_lower"
              type="number"
              value={formData.target_pe_lower}
              onChange={onChange}
              placeholder="Enter Target PE Lower"
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_pe_upper">Target PE Upper</Label>
            <Input
              id="target_pe_upper"
              name="target_pe_upper"
              type="number"
              value={formData.target_pe_upper}
              onChange={onChange}
              placeholder="Enter Target PE Upper"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LineItemsFields
