import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusMap: Record<string, { variant: any; label: string }> = {
    IDLE: { variant: "secondary", label: "Idle" },
    RUNNING: { variant: "default", label: "Running" },
    BUSY: { variant: "default", label: "Busy" },
    PENDING: { variant: "outline", label: "Pending" },
    DONE: { variant: "outline", label: "Done" },
    ERROR: { variant: "destructive", label: "Error" },
  };

  const config = statusMap[status] || { variant: "outline", label: status };

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
};
