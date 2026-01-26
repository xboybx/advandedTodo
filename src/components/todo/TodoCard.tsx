import { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Check, Trash2, Calendar as CalendarIcon, FileText, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PriorityBadge } from './PriorityBadge';
import { PrioritySelect } from './PrioritySelect';
import { cn } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export const TodoCard = ({ todo, onToggle, onUpdate, onDelete }: TodoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editNotes, setEditNotes] = useState(todo.notes);

  const isOverdue = todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) && !todo.completed;

  const handleSaveField = (field: string) => {
    switch (field) {
      case 'title':
        if (editTitle.trim()) {
          onUpdate(todo.id, { title: editTitle.trim() });
        } else {
          setEditTitle(todo.title);
        }
        break;
      case 'description':
        onUpdate(todo.id, { description: editDescription.trim() });
        break;
      case 'notes':
        onUpdate(todo.id, { notes: editNotes.trim() });
        break;
    }
    setEditingField(null);
  };

  const handleCancelEdit = (field: string) => {
    switch (field) {
      case 'title':
        setEditTitle(todo.title);
        break;
      case 'description':
        setEditDescription(todo.description);
        break;
      case 'notes':
        setEditNotes(todo.notes);
        break;
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveField(field);
    }
    if (e.key === 'Escape') {
      handleCancelEdit(field);
    }
  };

  return (
    <Card
      className={cn(
        'group glass-card transition-all duration-300 animate-fade-in',
        todo.completed && 'opacity-60',
        isOverdue && 'border-destructive/50 bg-destructive/5'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            {/* Title - inline editable */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {editingField === 'title' ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'title')}
                      onBlur={() => handleSaveField('title')}
                      className="font-medium h-8"
                      autoFocus
                    />
                  </div>
                ) : (
                  <h3
                    onClick={() => {
                      setEditingField('title');
                      setEditTitle(todo.title);
                    }}
                    className={cn(
                      'font-medium text-card-foreground leading-tight cursor-pointer hover:text-primary transition-colors',
                      todo.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {todo.title}
                  </h3>
                )}

                {/* Description - inline editable */}
                {editingField === 'description' ? (
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'description')}
                    onBlur={() => handleSaveField('description')}
                    className="text-sm mt-1 resize-none"
                    rows={2}
                    autoFocus
                    placeholder="Add a description..."
                  />
                ) : (
                  <p
                    onClick={() => {
                      setEditingField('description');
                      setEditDescription(todo.description);
                    }}
                    className="text-sm text-muted-foreground mt-1 cursor-pointer hover:text-foreground transition-colors"
                  >
                    {todo.description || (
                      <span className="italic opacity-50">Click to add description...</span>
                    )}
                  </p>
                )}
              </div>

              {/* Priority - clickable to change */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:opacity-80 transition-opacity">
                    <PriorityBadge priority={todo.priority} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <PrioritySelect
                    value={todo.priority}
                    onChange={(priority) => onUpdate(todo.id, { priority })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {/* Date - editable */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-1 text-xs hover:text-foreground transition-colors',
                      isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {todo.dueDate ? (
                        <>
                          {isToday(new Date(todo.dueDate))
                            ? 'Today'
                            : format(new Date(todo.dueDate), 'MMM d, yyyy')}
                          {isOverdue && <span className="font-medium ml-1">(Overdue)</span>}
                        </>
                      ) : (
                        'Set date'
                      )}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={todo.dueDate ? new Date(todo.dueDate) : undefined}
                    onSelect={(date) => onUpdate(todo.id, { dueDate: date || null })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  {todo.dueDate && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive"
                        onClick={() => onUpdate(todo.id, { dueDate: null })}
                      >
                        Remove date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* Notes toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-3 w-3" />
                <span>Notes</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {/* Delete button */}
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Expandable notes section */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-out',
                isExpanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
              )}
            >
              <div className="p-3 bg-muted/50 rounded-md">
                {editingField === 'notes' ? (
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'notes')}
                    onBlur={() => handleSaveField('notes')}
                    className="text-sm resize-none bg-background"
                    rows={3}
                    autoFocus
                    placeholder="Add notes..."
                  />
                ) : (
                  <p
                    onClick={() => {
                      setEditingField('notes');
                      setEditNotes(todo.notes);
                    }}
                    className="text-sm text-muted-foreground whitespace-pre-wrap cursor-pointer hover:text-foreground transition-colors min-h-[3rem]"
                  >
                    {todo.notes || (
                      <span className="italic opacity-50">Click to add notes...</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
