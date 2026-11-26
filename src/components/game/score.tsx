import { MoveDownRight, MoveUpRight } from 'lucide-react'
import { formatScore } from '@/lib/scoring'
import { scoreTone } from '@/lib/score-style'
import { cn } from '@/lib/utils'

interface ScoreProps {
  value: number
  className?: string
  showIcon?: boolean
}

function Score({ value, className, showIcon = true }: ScoreProps) {
  const Icon = value > 0 ? MoveUpRight : value < 0 ? MoveDownRight : null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-serif tabular-nums',
        scoreTone(value),
        className,
      )}
    >
      {showIcon && Icon ? (
        <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2.5} />
      ) : null}
      <span>{formatScore(value)}</span>
    </span>
  )
}

export { Score }
