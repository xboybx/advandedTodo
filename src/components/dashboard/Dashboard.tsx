import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { TodoStats, Todo } from '@/types/todo';
import { StatsCard } from './StatsCard';
import { PriorityChart } from './PriorityChart';
import { CalendarView } from './CalendarView';

interface DashboardProps {
  stats: TodoStats;
  todos: Todo[];
  getTodosByDate: (date: Date) => Todo[];
}

export const Dashboard = ({ stats, todos, getTodosByDate }: DashboardProps) => {
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={ListTodo}
          description="All time tasks"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          description={`${completionRate}% completion rate`}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="Tasks to complete"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          description="Needs attention"
          className={stats.overdue > 0 ? 'border-destructive/50' : ''}
        />
      </div>

      {/* Charts and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityChart data={stats.byPriority} />
        <CalendarView todos={todos} getTodosByDate={getTodosByDate} />
      </div>
    </div>
  );
};
