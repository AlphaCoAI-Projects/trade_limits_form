"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SplitsVolatilityData } from "@/hooks/useLineItemsForm"
import { ProjectionTable } from "./ProjectionTable"
import { useState } from "react"

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
  projectionConcalls: any
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
  projectionConcalls,
  brokerageConsensus,
}) => {
  type SplitKey = keyof SplitsVolatilityData["splits"]
  const SPLIT_KEYS: { key: SplitKey; label: string }[] = [
    { key: "sales", label: "Sales" },
    { key: "operating_profit", label: "Operating Profit" },
    { key: "net_profit", label: "Net Profit" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Uneditable - Splits & Volatility */}
      <div className="space-y-6">
        {/* splits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Splits</h3>

          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Metric</th>
                  <th className="px-4 py-2">Q1</th>
                  <th className="px-4 py-2">Q2</th>
                  <th className="px-4 py-2">Q3</th>
                  <th className="px-4 py-2">Q4</th>
                </tr>
              </thead>
              <tbody>
                {SPLIT_KEYS.map(({ key, label }) => {
                  const values = splitsVolatility?.splits?.[key] ?? []
                  const hasValues = values.length > 0
                  return (
                    <tr key={key} className="border-t">
                      <td className="px-4 py-2 text-left font-medium">
                        {label}
                      </td>
                      {hasValues ? (
                        [0, 1, 2, 3].map((i) => (
                          <td
                            key={i}
                            className="px-4 py-2 text-muted-foreground"
                          >
                            {values[i] !== undefined
                              ? values[i].toFixed(4)
                              : "--"}
                          </td>
                        ))
                      ) : (
                        <td
                          className="px-4 py-2 text-muted-foreground italic"
                          colSpan={4}
                        >
                          No data available
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
              ].map((key) => {
                const value =
                  splitsVolatility?.volatility?.[
                    key as keyof typeof splitsVolatility.volatility
                  ]

                return (
                  <div className="flex items-center gap-2" key={key}>
                    <Label className="w-40 capitalize text-sm">
                      {key.replace(/_/g, " ")}:
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {value != null ? (
                        value.toFixed(4)
                      ) : (
                        <span className="italic">No data</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            No volatility data available
          </p>
        )}

        {/* projections  */}
        <ProjectionTable concalls={projectionConcalls} />

        {/* brokerage consensus */}
        {brokerageConsensus && Object.keys(brokerageConsensus).length > 0 ? (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">FY26 Brokerage Consensus</h3>
    <div className="grid md:grid-cols-2 grid-cols-2 gap-4 text-muted-foreground text-sm">
      {Object.entries(brokerageConsensus).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-1">
          <span className="font-medium text-black">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
          </span>
          <span>
            {value !== undefined && value !== null ? value.toString() : "0"}
          </span>
        </div>
      ))}
    </div>
  </div>
) : (
  <p className="text-muted-foreground italic">
    No FY26 brokerage data available
  </p>
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
