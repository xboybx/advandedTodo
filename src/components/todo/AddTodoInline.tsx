import { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import { Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AddTodoInlineProps {
  onAdd: (title: string, description: string, priority: Priority, dueDate: Date | null, notes?: string) => void;
}

export const AddTodoInline = ({ onAdd }: AddTodoInlineProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the details panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  const handleAddClick = () => {
    if (!title.trim()) return;

    // Add the todo with description, notes (if provided) and default priority
    onAdd(title.trim(), description.trim(), 'medium', null, notes.trim());

    // Reset form
    setTitle('');
    setDescription('');
    setNotes('');
    setShowDetails(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddClick();
    }
    if (e.key === 'Escape') {
      setShowDetails(false);
      setDescription('');
      setNotes('');
    }
  };

  const handleDetailsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleAddClick();
    }
    if (e.key === 'Escape') {
      setShowDetails(false);
      setDescription('');
      setNotes('');
    }
  };

  const handleTitleClick = () => {
    // Show details panel when user clicks on title input
    setShowDetails(true);
  };

  return (
    <div className="space-y-0" ref={containerRef}>
      <div className="flex gap-2 ">
        <div className="flex-1 relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onClick={handleTitleClick}
            placeholder="What needs to be done?"
            className="w-full hover:border hover:border-white focus-visible:ring-0 shadow-none p-2 text-lg font-medium bg-transparent"
          />
        </div>
        <Button
          onClick={handleAddClick}
          disabled={!title.trim()}
          size="default"
        >
          Add
        </Button>
      </div>

      {/* Animated details panel - slides down smoothly from under the input */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out w-[90%] pl-1',
          showDetails ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
        )}
      >
        <div className="glass-card rounded-lg p-3">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleDetailsKeyDown}
            placeholder="Add a description..."
            className="resize-none text-sm min-h-[80px] border-none focus-visible:ring-0 shadow-none p-2 bg-transparent"
            rows={3}
            autoFocus={showDetails}
          />
        </div>
      </div>
    </div>
  );
};
