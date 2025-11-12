import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: any }> = {
    CONFIRMED: { label: "Confirmed", variant: "default" },
    DELIVERED: { label: "Delivered", variant: "secondary" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
    REFUNDED: { label: "Refunded", variant: "outline" },
    COMPLETED: { label: "Completed", variant: "default" },
  }

  const config = statusConfig[status] || { label: status, variant: "outline" }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
