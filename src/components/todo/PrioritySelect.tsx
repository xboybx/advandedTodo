import { Priority } from '@/types/todo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PriorityBadge } from './PriorityBadge';

interface PrioritySelectProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Priority)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <PriorityBadge priority={value} showLabel />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {priorities.map((priority) => (
          <SelectItem key={priority} value={priority}>
            <PriorityBadge priority={priority} showLabel />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
