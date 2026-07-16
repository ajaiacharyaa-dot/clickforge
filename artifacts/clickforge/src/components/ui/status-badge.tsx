import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    scheduled: "default",
    sent: "secondary",
    failed: "destructive",
    draft: "outline"
  };

  const colorClasses: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    sent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400",
    failed: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    draft: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
  };

  return (
    <Badge 
      variant={variantMap[normalizedStatus] || "outline"} 
      className={cn("capitalize font-medium shadow-none font-mono text-xs", colorClasses[normalizedStatus], className)}
    >
      {status}
    </Badge>
  );
}
