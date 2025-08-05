"use client"
import LineItemsForm from "@/components/root/LineItemsForm"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const handleNavigateToV2 = () => {
    router.push("/v2")
  }
  const handleNavigateToProjections = () => {
    router.push("/projections")
  }
  return (
    <div className="h-auto md:m-10 m-4 flex flex-col justify-center items-center">
      <Button onClick={handleNavigateToV2} className="mb-5">
        Go to Trade Form V2 <Link />
      </Button>
      <Button variant={"outline"} onClick={handleNavigateToProjections} className="mb-5">
        Go To Projections Data <Link />
      </Button>
      <LineItemsForm />
    </div>
  )
}
