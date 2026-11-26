export function scoreTone(score: number): string {
  if (score > 0) return 'text-primary'
  if (score < 0) return 'text-destructive'
  return 'text-muted-foreground'
}
