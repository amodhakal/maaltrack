export function scoreClassName(score: number): string {
  if (score > 0) return 'text-emerald-700'
  if (score < 0) return 'text-destructive'
  return 'text-muted-foreground'
}
