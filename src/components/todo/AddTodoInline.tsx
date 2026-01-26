import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AddTodoInlineProps {
  onAdd: (title: string, description: string, priority: Priority, dueDate: Date | null) => void;
}

export const AddTodoInline = ({ onAdd }: AddTodoInlineProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  const handleAddClick = () => {
    if (!title.trim()) return;

    if (!showDescription) {
      setShowDescription(true);
      return;
    }

    // Add the todo with default priority (can be edited later)
    onAdd(title.trim(), description.trim(), 'medium', null);
    
    // Reset form
    setTitle('');
    setDescription('');
    setShowDescription(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddClick();
    }
    if (e.key === 'Escape') {
      setShowDescription(false);
      setDescription('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="flex-1"
        />
        <Button 
          onClick={handleAddClick} 
          disabled={!title.trim()}
          className="gap-1"
        >
          {showDescription ? (
            'Add'
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add
            </>
          )}
        </Button>
      </div>

      {/* Animated description panel */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          showDescription ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex items-start gap-2 pt-2">
          <ChevronDown className="h-4 w-4 text-muted-foreground mt-2.5 flex-shrink-0" />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a description (optional, press Enter to add or Esc to cancel)"
            className="flex-1 resize-none text-sm"
            rows={2}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
