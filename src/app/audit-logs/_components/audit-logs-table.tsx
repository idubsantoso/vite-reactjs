import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { ArrowUpDown } from "lucide-react"
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
import type { AuditLog } from "@/mocks/data"

import EmptyState from "../../users/_components/empty-state"

type AuditLogsTableProps = {
  auditLogs: AuditLog[]
}

export default function AuditLogsTable({ auditLogs }: AuditLogsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedActor = searchParams.get("actor") ?? "All"
  const actionKeyword = searchParams.get("action") ?? ""
  const sorting = parseSorting(searchParams.get("sort"))
  const pagination = parsePagination(searchParams)
  const actors = useMemo(() => {
    return Array.from(new Set(auditLogs.map((log) => log.actor)))
  }, [auditLogs])
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    return selectedActor === "All" ? [] : [{ id: "actor", value: selectedActor }]
  }, [selectedActor])
  const columns = useMemo<ColumnDef<AuditLog>[]>(() => [
    {
      accessorKey: "actor",
      header: ({ column }) => (
        <SortableHeader
          label="Actor"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-slate-950">{row.original.actor}</span>
      ),
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <SortableHeader
          label="Action"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
    },
    {
      accessorKey: "target",
      header: "Target",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader
          label="Created"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{formatAuditDate(row.original.createdAt)}</Badge>
      ),
    },
  ], [])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: auditLogs,
    columns,
    state: {
      globalFilter: actionKeyword,
      columnFilters,
      sorting,
      pagination,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const keyword = String(filterValue).toLowerCase().trim()

      return [row.original.action, row.original.target].some((value) =>
        value.toLowerCase().includes(keyword),
      )
    },
    onGlobalFilterChange: (value) => {
      updateParams(setSearchParams, {
        action: String(value),
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

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Audit Logs Table
          </h2>
          <p className="text-sm text-slate-500">
            Filter actor/action dan pagination tersimpan di URL.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          <Select
            value={selectedActor}
            onValueChange={(value) =>
              updateParams(setSearchParams, {
                actor: value === "All" ? "" : value,
                page: "1",
              })
            }
          >
            <SelectTrigger className="lg:w-44" aria-label="Filter actor">
              <SelectValue placeholder="Actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All actors</SelectItem>
              {actors.map((actor) => (
                <SelectItem key={actor} value={actor}>
                  {actor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="search"
            value={actionKeyword}
            placeholder="Filter action"
            className="lg:w-64"
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        </div>
      </div>

      {table.getRowModel().rows.length === 0 ? (
        <div className="p-5">
          <EmptyState
            title="No matching audit logs"
            description="Tidak ada audit log yang cocok dengan actor, action, target, atau page saat ini."
            buttonLabel="Reset filters"
            onButtonClick={() =>
              updateParams(setSearchParams, {
                actor: "",
                action: "",
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
        Page {pageIndex + 1} of {Math.max(pageCount, 1)} · {rowCount} logs
      </p>
      <div className="flex items-center gap-2">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-24" aria-label="Audit logs per page">
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

function formatAuditDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
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
