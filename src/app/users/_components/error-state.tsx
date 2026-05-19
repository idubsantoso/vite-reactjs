import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title?: string
  description?: string
  buttonLabel?: string
  onButtonClick?: () => void
}

export default function ErrorState({
  title = "Error State",
  description = "Data users gagal dimuat karena server tidak merespons.",
  buttonLabel = "Retry",
  onButtonClick,
}: ErrorStateProps) {
  return (
    <section
      aria-labelledby="error-state-title"
      className="rounded-lg border border-rose-200 bg-rose-50 p-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-semibold text-rose-700">
        !
      </div>
      <h2
        id="error-state-title"
        className="mt-4 text-base font-semibold text-rose-950"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-rose-800">
        {description}
      </p>
      <Button
        type="button"
        aria-label={buttonLabel}
        variant="destructive"
        className="mt-5"
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
    </section>
  )
}
