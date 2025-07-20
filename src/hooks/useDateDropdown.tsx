import { useState } from "react"

export const useDateDropdown = () => {
  const [dateItem, setDateItem] = useState<string | null>(null)
  return { dateItem, setDateItem }
}
