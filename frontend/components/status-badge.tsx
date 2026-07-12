import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Tone = 'success' | 'info' | 'warning' | 'destructive' | 'neutral'

const toneClasses: Record<Tone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  info: 'border-info/30 bg-info/10 text-info',
  warning: 'border-warning/40 bg-warning/15 text-warning',
  destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
  neutral: 'border-border bg-muted text-muted-foreground',
}

const statusToneMap: Record<string, Tone> = {
  // Vehicles / drivers
  Available: 'success',
  'On Trip': 'info',
  'In Shop': 'warning',
  Retired: 'neutral',
  'Off Duty': 'neutral',
  Suspended: 'destructive',
  // Trips
  Completed: 'success',
  Dispatched: 'info',
  Pending: 'warning',
  Cancelled: 'destructive',
  Draft: 'neutral',
  // Maintenance
  'In Progress': 'info',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusToneMap[status] ?? 'neutral'
  return (
    <Badge variant="outline" className={cn(toneClasses[tone], className)}>
      {status}
    </Badge>
  )
}
