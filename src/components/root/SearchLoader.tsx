import { Loader2 } from "lucide-react"
import React from "react"

const SearchLoader = () => {
  return (
    <div className="py-6 flex h-full w-full justify-center items-center">
      <Loader2 className="animate-spin text-center" />
    </div>
  )
}

export default SearchLoader