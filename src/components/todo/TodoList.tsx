import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import { TodoCard } from './TodoCard';
import { AddTodoInline } from './AddTodoInline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoListProps {
  todos: Todo[];
  onAdd: (title: string, description: string, priority: Priority, dueDate: Date | null) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

type FilterStatus = 'all' | 'pending' | 'completed' | 'overdue';
type SortBy = 'createdAt' | 'dueDate' | 'priority';
type ViewMode = 'list' | 'grid';

export const TodoList = ({ todos, onAdd, onToggle, onUpdate, onDelete }: TodoListProps) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const priorityWeight: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (search && !todo.title.toLowerCase().includes(search.toLowerCase()) &&
        !todo.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (filterStatus === 'pending' && todo.completed) return false;
      if (filterStatus === 'completed' && !todo.completed) return false;
      if (filterStatus === 'overdue') {
        const now = new Date();
        if (!todo.dueDate || new Date(todo.dueDate) >= now || todo.completed) return false;
      }

      if (filterPriority !== 'all' && todo.priority !== filterPriority) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Inline Add Todo */}
      <div className="glass-card p-4 rounded-lg border">
        <AddTodoInline onAdd={onAdd} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-md border mr-2">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as Priority | 'all')}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Todo Items */}
      <div className={cn(
        "gap-4",
        viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-0"
          : "flex flex-col space-y-3"
      )}>
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-muted-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {todos.length === 0 ? 'Type above to create your first task!' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              className={viewMode === 'grid' ? 'h-full' : ''}
            />
          ))
        )}
      </div>
    </div>
  );
};
