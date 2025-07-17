"use client"
import React from "react"
import LineItemsFields from "./LineItemsFields"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import CompanySelector from "./CompanySelector"
import { useCompanySearch } from "@/hooks/useCompanySearch"
import { useLineItemsForm } from "@/hooks/useLineItemsForm"

const LineItemsForm = () => {
  const {
    companies,
    open,
    setOpen,
    companyName,
    setCompanyName,
    selectedCompany,
    setSelectedCompany,
    limit,
    setLimit,
    loading,
  } = useCompanySearch()

  const {
    formData,
    handleChange,
    loading: submitLoading,
    autoSaveCountdown,
    isAutoSaving,
    saveSuccess,
    handleSubmit,
    resetForm,
    splitsVolatility,
    projectionConcalls,
    brokerageConsensus
  } = useLineItemsForm(selectedCompany)

  return (
    <Card className="w-full max-w-5xl px-4 sm:px-6">
      <CardHeader>
        <CardTitle className="text-xl">Line Items Form</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <CompanySelector
            open={open}
            setOpen={setOpen}
            companyName={companyName}
            setCompanyName={setCompanyName}
            companies={companies}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            limit={limit}
            setLimit={setLimit}
            loading={loading}
          />
        </div>

        <LineItemsFields
          formData={formData}
          onChange={handleChange}
          disabled={submitLoading || !selectedCompany}
          bandsLoading={loading}
          selectedCompany={!!selectedCompany}
          splitsVolatility={splitsVolatility}
          projectionConcalls={projectionConcalls}
          brokerageConsensus={brokerageConsensus}
        />
      </CardContent>

      <CardFooter className="flex flex-row justify-between items-center">
        <div>
          {autoSaveCountdown !== null && !isAutoSaving && (
            <span className="text-sm text-muted-foreground">
              Auto saving in {autoSaveCountdown} second
              {autoSaveCountdown !== 1 && "s"}...
            </span>
          )}
          {isAutoSaving && (
            <span className="text-sm text-muted-foreground">Saving...</span>
          )}
          {saveSuccess && (
            <span className="text-sm text-green-600 ml-2">Saved!</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            resetForm()
            setSelectedCompany(null)
            setCompanyName("")
          }}>
            Reset Form
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitLoading || !selectedCompany}
          >
            {submitLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LineItemsForm
