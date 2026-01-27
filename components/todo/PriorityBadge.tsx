import { Star } from 'lucide-react';
import { Priority } from '@/types/todo';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'row' | 'column';
  className?: string; // Add this
  textClassName?: string; // Add this
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: '#22c55e' }, // green-500
  medium: { label: 'Medium', color: '#eab308' }, // yellow-500
  high: { label: 'High', color: '#ef4444' }, // red-500
  urgent: { label: 'Urgent', color: '#8b5cf6' }, // violet-500
};

const sizeConfig = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const PriorityBadge = ({
  priority,
  showLabel = false,
  size = 'md',
  layout = 'row',
  className,
  textClassName
}: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <div
      className={cn(
        "flex items-center transition-colors",
        layout === 'column' ? "flex-col gap-0.5" : "gap-1.5",
        className
      )}
      style={{ color: config.color }}
    >
      <Star className={cn(sizeConfig[size], 'fill-current')} />
      {showLabel && (
        <span className={cn(
          "font-medium",
          layout === 'column' ? "text-[10px] leading-none" : "text-xs",
          textClassName
        )}>{config.label}</span>
      )}
    </div>
  );
};
