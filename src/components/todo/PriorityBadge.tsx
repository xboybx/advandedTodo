import { Star } from 'lucide-react';
import { Priority } from '@/types/todo';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const priorityConfig: Record<Priority, { label: string; colorClass: string }> = {
  low: { label: 'Low', colorClass: 'text-priority-low' },
  medium: { label: 'Medium', colorClass: 'text-priority-medium' },
  high: { label: 'High', colorClass: 'text-priority-high' },
  urgent: { label: 'Urgent', colorClass: 'text-priority-urgent' },
};

const sizeConfig = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const PriorityBadge = ({ priority, showLabel = false, size = 'md' }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  const starCount = priority === 'low' ? 1 : priority === 'medium' ? 2 : priority === 'high' ? 3 : 4;

  return (
    <div className={cn('flex items-center gap-1', config.colorClass)}>
      <div className="flex">
        {Array.from({ length: starCount }).map((_, i) => (
          <Star
            key={i}
            className={cn(sizeConfig[size], 'fill-current')}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs font-medium">{config.label}</span>
      )}
    </div>
  );
};
