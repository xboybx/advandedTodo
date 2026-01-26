import { useState, useEffect, useCallback } from 'react';
import { Todo, Priority, TodoStats } from '@/types/todo';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'advanced-todo-app';

const generateId = () => Math.random().toString(36).substring(2, 15);

const getInitialTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((todo: Todo) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error loading todos:', error);
  }
  return [];
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);
  const [notifiedTodos, setNotifiedTodos] = useState<Set<string>>(new Set());

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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
          setNotifiedTodos((prev) => new Set([...prev, todo.id]));
        }
      });
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [todos, notifiedTodos]);

  const addTodo = useCallback((
    title: string,
    description: string = '',
    priority: Priority = 'medium',
    dueDate: Date | null = null
  ) => {
    const newTodo: Todo = {
      id: generateId(),
      title,
      description,
      notes: '',
      priority,
      completed: false,
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    toast({
      title: 'Task Created',
      description: `"${title}" has been added to your list.`,
    });
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast({
      title: 'Task Deleted',
      description: 'The task has been removed.',
    });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

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
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getStats,
    getTodosByDate,
  };
};
