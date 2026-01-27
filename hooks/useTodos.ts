import { useState, useEffect, useCallback } from 'react';
import { Todo, Priority, TodoStats } from '@/types/todo';
import { toast } from '@/hooks/use-toast';
import { getTodos, createTodo, updateTodo as updateTodoAction, deleteTodo as deleteTodoAction } from '@/app/actions/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifiedTodos, setNotifiedTodos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Helper to convert serialization strings back to Dates
  const normalizeTodo = (todo: any): Todo => ({
    ...todo,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
    createdAt: new Date(todo.createdAt),
    updatedAt: new Date(todo.updatedAt),
  });

  // Load todos from server on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos.map(normalizeTodo));
      } catch (error) {
        console.error('Failed to fetch todos:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tasks from server.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Check for overdue tasks and notify
  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      todos.forEach((todo) => {
        if (
          todo.dueDate &&
          !todo.completed &&
          new Date(todo.dueDate) < now &&
          !notifiedTodos.has(todo.id)
        ) {
          toast({
            title: '⚠️ Task Overdue!',
            description: `"${todo.title}" is past its due date.`,
            variant: 'destructive',
          });
          setNotifiedTodos((prev) => new Set([...Array.from(prev), todo.id]));
        }
      });
    };

    if (todos.length > 0) {
      checkOverdue();
    }
    const interval = setInterval(checkOverdue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos, notifiedTodos]);

  const addTodo = useCallback(async (
    title: string,
    description: string = '',
    priority: Priority = 'medium',
    dueDate: Date | null = null,
    notes: string = ''
  ) => {
    try {
      const newTodo = await createTodo(title, description, priority, dueDate, notes);
      const normalizedTodo = normalizeTodo(newTodo);

      setTodos((prev) => [normalizedTodo, ...prev]);
      toast({
        title: 'Task Created',
        description: `"${title}" has been added to your list.`,
      });
      return normalizedTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      });
      return null;
    }
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
        )
      );

      const updated = await updateTodoAction(id, updates);

      // Reconcile with server response (optional, but good for consistency)
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? normalizeTodo(updated) : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task.',
        variant: 'destructive',
      });
      // Revert optimistic update? For simplicity, we might reload or just let it be for now. 
      // Ideally we would rollback.
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      // Optimistic update
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      await deleteTodoAction(id);

      toast({
        title: 'Task Deleted',
        description: 'The task has been removed.',
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      });
      // Rollback?
    }
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    await updateTodo(id, { completed: !todo.completed });
  }, [todos, updateTodo]);

  const getStats = useCallback((): TodoStats => {
    const now = new Date();
    const stats: TodoStats = {
      total: todos.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    };

    todos.forEach((todo) => {
      if (todo.completed) {
        stats.completed++;
      } else {
        stats.pending++;
        if (todo.dueDate && new Date(todo.dueDate) < now) {
          stats.overdue++;
        }
      }
      stats.byPriority[todo.priority]++;
    });

    return stats;
  }, [todos]);

  const getTodosByDate = useCallback((date: Date) => {
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getFullYear() === date.getFullYear() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getDate() === date.getDate()
      );
    });
  }, [todos]);

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getStats,
    getTodosByDate,
  };
};
