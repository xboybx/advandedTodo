"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTodos } from '@/hooks/useTodos';
import { Priority } from '@/types/todo';
import { TodoCard } from '@/components/todo/TodoCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function FilteredTodos({ params }: { params: Promise<{ priority: string }> }) {
    const { priority } = use(params);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { todos, updateTodo, deleteTodo, toggleComplete } = useTodos();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredTodos = todos.filter(
        (todo) => todo.priority === (priority?.toLowerCase() as Priority)
    );

    const priorityLabel = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : '';

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/')}
                                className="rounded-full"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {priorityLabel} Priority Tasks
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Showing {filteredTodos.length} tasks
                                </p>
                            </div>
                        </div>

                        {/* Theme Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full hover:bg-muted"
                        >
                            {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {filteredTodos.length > 0 ? (
                            filteredTodos.map((todo) => (
                                <TodoCard
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={toggleComplete}
                                    onUpdate={updateTodo}
                                    onDelete={deleteTodo}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 glass-card rounded-xl">
                                <p className="text-muted-foreground text-lg">
                                    No {priorityLabel.toLowerCase()} priority tasks found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
