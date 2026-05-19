type SummaryItem = {
  label: string
  value: string
  meta: string
}

type DashboardSummaryProps = {
  items?: SummaryItem[]
}

const summaryItems: SummaryItem[] = [
  {
    label: "Total Users",
    value: "1,248",
    meta: "+12.5% this month",
  },
  {
    label: "Active Users",
    value: "1,086",
    meta: "87% activation rate",
  },
  {
    label: "Pending Invites",
    value: "42",
    meta: "18 expire this week",
  },
  {
    label: "Admins",
    value: "16",
    meta: "4 role changes",
  },
]

export default function DashboardSummary({
  items = summaryItems,
}: DashboardSummaryProps) {
  return (
    <section
      aria-label="Dashboard summary"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-emerald-700">{item.meta}</p>
        </article>
      ))}
    </section>
  )
}
