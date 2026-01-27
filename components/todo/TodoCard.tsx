import { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Check, Trash2, Calendar as CalendarIcon, FileText, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  className?: string;
}

export const TodoCard = ({ todo, onToggle, onUpdate, onDelete, className }: TodoCardProps) => {
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
        isOverdue && 'border-destructive/50 bg-destructive/5',
        className
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-3 flex-1 min-w-0">
                <div className="shrink-0 max-w-[40%]">
                  {editingField === 'title' ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'title')}
                      onBlur={() => handleSaveField('title')}
                      className="font-medium h-7 text-sm py-1"
                      autoFocus
                    />
                  ) : (
                    <h3
                      onClick={() => onToggle(todo.id)}
                      onDoubleClick={() => {
                        setEditingField('title');
                        setEditTitle(todo.title);
                      }}
                      className={cn(
                        'font-medium text-sm text-card-foreground leading-tight cursor-pointer hover:text-primary transition-colors truncate',
                        todo.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {todo.title}
                    </h3>
                  )}
                </div>

                {/* Description Container - Now on the right of title */}
                <div className="flex-1 min-w-0 border-l pl-3 border-border/50">
                  {editingField === 'description' ? (
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'description')}
                      onBlur={() => handleSaveField('description')}
                      className="text-xs h-6 py-0.5"
                      autoFocus
                      placeholder="Add description..."
                    />
                  ) : (
                    <p
                      onClick={() => {
                        setEditingField('description');
                        setEditDescription(todo.description);
                      }}
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors truncate opacity-80"
                    >
                      {todo.description || (
                        <span className="italic opacity-40">Add description...</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority - clickable to change */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:opacity-80 transition-opacity shrink-0">
                    <PriorityBadge
                      priority={todo.priority}
                      size="sm"
                      showLabel={true}
                      layout="column"
                      textClassName="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
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
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {/* Date - editable */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-1.5 text-[10px] hover:text-foreground transition-colors',
                      isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="h-2.5 w-2.5 shrink-0" />
                    <span className="leading-none pt-[0.5px]">
                      {todo.dueDate ? (
                        <>
                          {isToday(new Date(todo.dueDate))
                            ? 'Today'
                            : format(new Date(todo.dueDate), 'MMM d')}
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
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-2.5 w-2.5 shrink-0 text-[#FFFDD0]" />
                <span className="leading-none pt-[0.5px]">Notes {todo.notes ? '(1)' : ''}</span>
                {isExpanded ? (
                  <ChevronUp className="h-2.5 w-2.5 shrink-0" />
                ) : (
                  <ChevronDown className="h-2.5 w-2.5 shrink-0" />
                )}
              </button>

              {/* Delete button */}
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive flex items-center justify-center"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Expandable notes section */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-out',
                isExpanded ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'
              )}
            >
              <div className="p-2 bg-muted/30 border rounded-md">
                {editingField === 'notes' ? (
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'notes')}
                    onBlur={() => handleSaveField('notes')}
                    className="text-[11px] resize-none bg-background py-1"
                    rows={2}
                    autoFocus
                    placeholder="Add notes..."
                  />
                ) : (
                  <p
                    onClick={() => {
                      setEditingField('notes');
                      setEditNotes(todo.notes);
                    }}
                    className="text-[11px] text-muted-foreground whitespace-pre-wrap cursor-pointer hover:text-foreground transition-colors min-h-[1.5rem]"
                  >
                    {todo.notes || (
                      <span className="italic opacity-50">Click to add notes...</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div >
      </CardContent >
    </Card >
  );
};
