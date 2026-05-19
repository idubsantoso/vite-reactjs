import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title?: string
  description?: string
  buttonLabel?: string
  onButtonClick?: () => void
}

export default function EmptyState({
  title = "Empty State",
  description = "Tidak ada user yang cocok dengan filter saat ini.",
  buttonLabel = "Reset Filter",
  onButtonClick,
}: EmptyStateProps) {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500">
        0
      </div>
      <h2
        id="empty-state-title"
        className="mt-4 text-base font-semibold text-slate-950"
      >
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
        {description}
      </p>
      <Button
        type="button"
        aria-label={buttonLabel}
        className="mt-5"
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
    </section>
  )
}
