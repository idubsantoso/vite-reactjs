import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

type QueryStateLineProps = {
  isFetching: boolean
  isStale: boolean
  label: string
  onRefresh: () => void
}

export default function QueryStateLine({
  isFetching,
  isStale,
  label,
  onRefresh,
}: QueryStateLineProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="font-medium text-slate-950">{label}</span>
        <span className="ml-2">
          {isFetching ? "Refreshing..." : isStale ? "Stale data" : "Fresh data"}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isFetching}
        onClick={onRefresh}
      >
        <RefreshCw
          className={isFetching ? "size-4 animate-spin" : "size-4"}
          aria-hidden="true"
        />
        Refresh
      </Button>
    </div>
  )
}
