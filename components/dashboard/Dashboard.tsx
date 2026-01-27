import { CheckCircle2, Clock, AlertTriangle, ListTodo, Loader2 } from 'lucide-react';
import { TodoStats, Todo } from '@/types/todo';
import { StatsCard } from './StatsCard';
import { PriorityChart } from './PriorityChart';
import { CalendarView } from './CalendarView';

interface DashboardProps {
  stats: TodoStats;
  todos: Todo[];
  loading?: boolean;
  getTodosByDate: (date: Date) => Todo[];
}

export const Dashboard = ({ stats, todos, loading = false, getTodosByDate }: DashboardProps) => {
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 h-full w-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

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
        <PriorityChart data={stats.byPriority} loading={loading} />
        <CalendarView todos={todos} getTodosByDate={getTodosByDate} />
      </div>
    </div>
  );
};
