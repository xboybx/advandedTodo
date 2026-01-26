import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Header } from '@/components/layout/Header';
import { TopTabs } from '@/components/layout/TopTabs';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TodoList } from '@/components/todo/TodoList';

type TabType = 'dashboard' | 'todos';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, getStats, getTodosByDate } = useTodos();

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Top Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="text-right">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {activeTab === 'dashboard' ? 'Dashboard' : 'Todo List'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'dashboard'
                  ? 'Overview of your productivity'
                  : `${stats.pending} pending, ${stats.completed} completed`}
              </p>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'dashboard' ? (
            <Dashboard stats={stats} todos={todos} getTodosByDate={getTodosByDate} />
          ) : (
            <TodoList
              todos={todos}
              onAdd={addTodo}
              onToggle={toggleComplete}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
