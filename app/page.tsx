"use client";

import { useState, useEffect } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TopTabs } from '@/components/layout/TopTabs';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TodoList } from '@/components/todo/TodoList';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

type TabType = 'dashboard' | 'todos';

export default function Index() {
    const [activeTab, setActiveTab] = useState<TabType>('todos');
    const [mounted, setMounted] = useState(false);
    const { todos, loading, addTodo, updateTodo, deleteTodo, toggleComplete, getStats, getTodosByDate } = useTodos();
    const { theme, toggleTheme } = useTheme();

    const stats = getStats();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="w-full">
                    {/* Top Tabs & Theme Toggle Overlay */}
                    <div className="flex flex-col items-end md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div className="flex items-center order-1 md:order-none gap-2">
                            <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />

                            {/* Theme Toggle Button positioned after tabs */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full hover:bg-muted"
                            >
                                {mounted && (
                                    theme === 'dark' ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )
                                )}
                            </Button>
                        </div>

                        <div className="text-right order-2 md:order-none w-full md:w-auto">
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
                        <Dashboard
                            stats={stats}
                            todos={todos}
                            loading={loading}
                            getTodosByDate={getTodosByDate}
                        />
                    ) : (
                        <TodoList
                            todos={todos}
                            loading={loading}
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
}
