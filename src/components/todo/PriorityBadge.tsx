import { Star } from 'lucide-react';
import { Priority } from '@/types/todo';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'var(--chart-5)' },
  medium: { label: 'Medium', color: 'var(--chart-3)' },
  high: { label: 'High', color: 'var(--chart-2)' },
  urgent: { label: 'Urgent', color: 'var(--chart-1)' },
};

const sizeConfig = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const PriorityBadge = ({ priority, showLabel = false, size = 'md' }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <div className="flex items-center gap-1.5" style={{ color: config.color }}>
      <Star className={cn(sizeConfig[size], 'fill-current')} />
      {showLabel && (
        <span className="text-xs font-medium">{config.label}</span>
      )}
    </div>
  );
};
