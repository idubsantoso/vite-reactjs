import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowUpDown, Check, Eye, X } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MockRequest } from "@/mocks/data"

import EmptyState from "../../users/_components/empty-state"

type RequestsTableProps = {
  requests: MockRequest[]
  pendingRequestId?: string
  onUpdateStatus: (request: MockRequest, status: MockRequest["status"]) => void
}

export default function RequestsTable({
  requests,
  pendingRequestId,
  onUpdateStatus,
}: RequestsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchKeyword = searchParams.get("q") ?? ""
  const selectedStatus = searchParams.get("status") ?? "All"
  const selectedPriority = searchParams.get("priority") ?? "All"
  const selectedAssignee = searchParams.get("assignee") ?? "All"
  const sorting = parseSorting(searchParams.get("sort"))
  const pagination = parsePagination(searchParams)
  const assignees = useMemo(() => {
    return Array.from(new Set(requests.map((request) => request.assignee)))
  }, [requests])
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    return [
      ...(selectedStatus === "All"
        ? []
        : [{ id: "status", value: selectedStatus }]),
      ...(selectedPriority === "All"
        ? []
        : [{ id: "priority", value: selectedPriority }]),
      ...(selectedAssignee === "All"
        ? []
        : [{ id: "assignee", value: selectedAssignee }]),
    ]
  }, [selectedAssignee, selectedPriority, selectedStatus])

  const columns = useMemo<ColumnDef<MockRequest>[]>(() => [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <SortableHeader
          label="Request"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => (
        <div>
          <Link
            to={`/requests/${row.original.id}`}
            className="font-medium text-slate-950 hover:underline"
          >
            {row.original.id}
          </Link>
          <p className="text-sm text-slate-500">{row.original.title}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader
          label="Status"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <SortableHeader
          label="Priority"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: "assignee",
      header: ({ column }) => (
        <SortableHeader
          label="Assignee"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
    },
    {
      accessorKey: "submittedAt",
      header: ({ column }) => (
        <SortableHeader
          label="Submitted"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => formatRequestDate(row.original.submittedAt),
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => {
        const request = row.original
        const isPending = pendingRequestId === request.id

        return (
          <div className="flex flex-wrap justify-end gap-2">
            <Button asChild size="sm" variant="outline">
              <Link
                to={`/requests/${request.id}`}
                aria-label={`View ${request.id}`}
              >
                <Eye className="size-4" aria-hidden="true" />
                View
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={Boolean(pendingRequestId)}
              aria-label={`Approve ${request.id}`}
              onClick={() => onUpdateStatus(request, "Approved")}
            >
              <Check className="size-4" aria-hidden="true" />
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={Boolean(pendingRequestId)}
              aria-label={`Reject ${request.id}`}
              onClick={() => onUpdateStatus(request, "Rejected")}
            >
              <X className="size-4" aria-hidden="true" />
              Reject
            </Button>
            {isPending ? (
              <span className="basis-full text-right text-xs text-slate-500">
                Updating...
              </span>
            ) : null}
          </div>
        )
      },
      enableSorting: false,
    },
  ], [onUpdateStatus, pendingRequestId])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: requests,
    columns,
    state: {
      globalFilter: searchKeyword,
      columnFilters,
      sorting,
      pagination,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const keyword = String(filterValue).toLowerCase().trim()

      return [
        row.original.id,
        row.original.title,
        row.original.owner,
        row.original.assignee,
        row.original.priority,
        row.original.status,
      ].some((value) => value.toLowerCase().includes(keyword))
    },
    onGlobalFilterChange: (value) => {
      updateParams(setSearchParams, {
        q: String(value),
        page: "1",
      })
    },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === "function"
        ? updater(sorting)
        : updater

      updateParams(setSearchParams, {
        sort: serializeSorting(nextSorting),
        page: "1",
      })
    },
    onPaginationChange: (updater) => {
      const nextPagination = typeof updater === "function"
        ? updater(pagination)
        : updater

      updateParams(setSearchParams, {
        page: String(nextPagination.pageIndex + 1),
        pageSize: String(nextPagination.pageSize),
      })
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  function setFilter(
    key: "status" | "priority" | "assignee",
    value: string,
  ) {
    updateParams(setSearchParams, {
      [key]: value === "All" ? "" : value,
      page: "1",
    })
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Requests Table
          </h2>
          <p className="text-sm text-slate-500">
            Filter, sorting, dan pagination tersimpan di URL.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:flex">
          <Input
            type="search"
            value={searchKeyword}
            placeholder="Search requests"
            className="xl:w-56"
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
          <Select
            value={selectedStatus}
            onValueChange={(value) => setFilter("status", value)}
          >
            <SelectTrigger className="xl:w-36" aria-label="Filter status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedPriority}
            onValueChange={(value) => setFilter("priority", value)}
          >
            <SelectTrigger className="xl:w-36" aria-label="Filter priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All priority</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedAssignee}
            onValueChange={(value) => setFilter("assignee", value)}
          >
            <SelectTrigger className="xl:w-44" aria-label="Filter assignee">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All assignees</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <div className="p-5">
          <EmptyState
            title="No matching requests"
            description="Tidak ada request yang cocok dengan search, status, priority, assignee, atau page saat ini."
            buttonLabel="Reset filters"
            onButtonClick={() =>
              updateParams(setSearchParams, {
                q: "",
                status: "",
                priority: "",
                assignee: "",
                sort: "",
                page: "1",
              })
            }
          />
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} scope="col">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <TablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={table.getPageCount()}
        rowCount={table.getFilteredRowModel().rows.length}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
      />
    </section>
  )
}

function SortableHeader({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1"
      onClick={onClick}
    >
      {label}
      <ArrowUpDown className="size-3.5" aria-hidden="true" />
    </button>
  )
}

function TablePagination({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
}: {
  pageIndex: number
  pageSize: number
  pageCount: number
  rowCount: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onPageSizeChange: (pageSize: number) => void
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Page {pageIndex + 1} of {Math.max(pageCount, 1)} · {rowCount} requests
      </p>
      <div className="flex items-center gap-2">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-24" aria-label="Requests per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          disabled={!canPreviousPage}
          onClick={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canNextPage}
          onClick={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function RequestStatusBadge({ status }: { status: MockRequest["status"] }) {
  if (status === "Approved") {
    return <Badge variant="success">{status}</Badge>
  }

  if (status === "Rejected") {
    return <Badge variant="destructive">{status}</Badge>
  }

  return <Badge variant="warning">{status}</Badge>
}

function PriorityBadge({ priority }: { priority: MockRequest["priority"] }) {
  if (priority === "High") {
    return <Badge variant="destructive">{priority}</Badge>
  }

  if (priority === "Medium") {
    return <Badge variant="warning">{priority}</Badge>
  }

  return <Badge variant="outline">{priority}</Badge>
}

function formatRequestDate(submittedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(submittedAt))
}

function parseSorting(value: string | null): SortingState {
  if (!value) {
    return []
  }

  const [id, direction] = value.split(".")

  if (!id) {
    return []
  }

  return [{ id, desc: direction === "desc" }]
}

function serializeSorting(sorting: SortingState) {
  const [sort] = sorting

  if (!sort) {
    return ""
  }

  return `${sort.id}.${sort.desc ? "desc" : "asc"}`
}

function parsePagination(searchParams: URLSearchParams): PaginationState {
  const page = Number(searchParams.get("page") ?? "1")
  const pageSize = Number(searchParams.get("pageSize") ?? "10")

  return {
    pageIndex: Number.isFinite(page) && page > 0 ? page - 1 : 0,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
  }
}

function updateParams(
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  updates: Record<string, string>,
) {
  setSearchParams((currentParams) => {
    const nextParams = new URLSearchParams(currentParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value)
      } else {
        nextParams.delete(key)
      }
    })

    return nextParams
  })
}
