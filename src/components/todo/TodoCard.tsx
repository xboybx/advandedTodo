import { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Check, Trash2, Calendar, FileText, Edit2, X, Save } from 'lucide-react';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editNotes, setEditNotes] = useState(todo.notes);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  const isOverdue = todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate)) && !todo.completed;

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
      notes: editNotes,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditNotes(todo.notes);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  return (
    <Card
      className={cn(
        'group glass-card hover-lift transition-all duration-300',
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
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-medium"
                  placeholder="Task title"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-sm resize-none"
                  placeholder="Description (optional)"
                  rows={2}
                />
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="text-sm resize-none"
                  placeholder="Notes (optional)"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <PrioritySelect value={editPriority} onChange={setEditPriority} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        'font-medium text-card-foreground leading-tight',
                        todo.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <PriorityBadge priority={todo.priority} />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  {todo.dueDate && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs',
                        isOverdue ? 'text-destructive' : 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>
                        {isToday(new Date(todo.dueDate))
                          ? 'Today'
                          : format(new Date(todo.dueDate), 'MMM d, yyyy')}
                      </span>
                      {isOverdue && <span className="font-medium">(Overdue)</span>}
                    </div>
                  )}

                  {todo.notes && (
                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Notes</span>
                    </button>
                  )}
                </div>

                {showNotes && todo.notes && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {todo.notes}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
