import { useState } from 'react';
import { format } from 'date-fns';
import { Todo } from '@/types/todo';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/todo/PriorityBadge';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  todos: Todo[];
  getTodosByDate: (date: Date) => Todo[];
}

export const CalendarView = ({ todos, getTodosByDate }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const selectedTodos = selectedDate ? getTodosByDate(selectedDate) : [];

  // Get dates with todos for highlighting
  const datesWithTodos = todos
    .filter((todo) => todo.dueDate)
    .map((todo) => new Date(todo.dueDate!));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border pointer-events-auto"
            modifiers={{
              hasTodo: datesWithTodos,
            }}
            modifiersStyles={{
              hasTodo: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                textDecorationColor: 'hsl(var(--primary))',
              },
            }}
          />

          <div className="flex-1">
            <h4 className="font-medium text-sm text-muted-foreground mb-3">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h4>

            {selectedTodos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks scheduled</p>
            ) : (
              <div className="space-y-2">
                {selectedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={cn(
                      'p-3 rounded-lg border border-border/50',
                      todo.completed && 'opacity-60'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          todo.completed && 'line-through text-muted-foreground'
                        )}
                      >
                        {todo.title}
                      </span>
                      <PriorityBadge priority={todo.priority} size="sm" />
                    </div>
                    {todo.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {todo.description}
                      </p>
                    )}
                    {todo.completed && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


