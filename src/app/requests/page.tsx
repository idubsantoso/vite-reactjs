import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const requests = [
  {
    id: "REQ-1001",
    title: "Access approval",
    owner: "Sari Wijaya",
    status: "Pending",
  },
  {
    id: "REQ-1002",
    title: "Role change",
    owner: "Andi Pratama",
    status: "Approved",
  },
]

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Requests</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Request List
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Semua request bisa dibuka ke route detail.
        </p>
      </header>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Request</TableHead>
              <TableHead scope="col">Owner</TableHead>
              <TableHead scope="col">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Link
                    to={`/requests/${request.id}`}
                    className="font-medium text-slate-950 hover:underline"
                  >
                    {request.id}
                  </Link>
                  <p className="text-sm text-slate-500">{request.title}</p>
                </TableCell>
                <TableCell>{request.owner}</TableCell>
                <TableCell>
                  <Badge variant="warning">{request.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
