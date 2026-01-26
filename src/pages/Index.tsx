import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TodoList } from '@/components/todo/TodoList';
import { AddTodoDialog } from '@/components/todo/AddTodoDialog';

type TabType = 'dashboard' | 'todos';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, getStats, getTodosByDate } = useTodos();

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {activeTab === 'dashboard' ? 'Dashboard' : 'Todo List'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'dashboard'
                    ? 'Overview of your tasks and productivity'
                    : 'Manage and organize your tasks'}
                </p>
              </div>

              {activeTab === 'todos' && (
                <AddTodoDialog onAdd={addTodo} />
              )}
            </div>

            {/* Content */}
            {activeTab === 'dashboard' ? (
              <Dashboard stats={stats} todos={todos} getTodosByDate={getTodosByDate} />
            ) : (
              <TodoList
                todos={todos}
                onToggle={toggleComplete}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
