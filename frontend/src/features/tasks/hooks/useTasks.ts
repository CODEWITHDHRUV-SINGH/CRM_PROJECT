import { useCallback, useEffect, useState } from 'react';
import { tasksService } from '../services/tasksService';
import type {
  CreateTaskInput,
  Task,
  TaskFilters,
  UpdateTaskInput,
} from '../types/task.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function useTasks(filters?: TaskFilters) {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tasksService.list(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.priority, filters?.type]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(async (input: CreateTaskInput) => {
    const task = await tasksService.create(input);
    setData((curr) => [task, ...curr]);
    return task;
  }, []);

  const update = useCallback(async (input: UpdateTaskInput) => {
    const task = await tasksService.update(input);
    setData((curr) => curr.map((t) => (t.id === task.id ? task : t)));
    return task;
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const task = await tasksService.toggleComplete(id);
    setData((curr) => curr.map((t) => (t.id === task.id ? task : t)));
    return task;
  }, []);

  const remove = useCallback(async (id: string) => {
    await tasksService.remove(id);
    setData((curr) => curr.filter((t) => t.id !== id));
  }, []);

  return { data, isLoading, error, refetch, create, update, toggleComplete, remove };
}