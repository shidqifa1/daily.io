export function TimeChip({
  start,
  end,
  accent = false,
}: {
  start: string
  end: string
  accent?: boolean
}) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl border px-3 py-2 font-mono ${
        accent
          ? "border-cyan/50 bg-cyan/10 text-cyan"
          : "border-border-strong bg-elevated text-foreground"
      }`}
    >
      <span className="text-sm font-bold leading-none tracking-tight">{start}</span>
      <span className="my-1 h-3 w-px bg-current opacity-30" aria-hidden />
      <span className="text-sm font-bold leading-none tracking-tight">{end}</span>
    </div>
  )
}
