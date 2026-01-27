export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Todo {
  id: string;
  title: string;
  description: string;
  notes: string;
  priority: Priority;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: Record<Priority, number>;
}
