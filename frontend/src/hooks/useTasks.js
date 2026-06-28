import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, reorderTasks } from '../api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', sort: 'createdAt' });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      const { data } = await getTasks(params);
      setTasks(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (taskData) => {
    const { data } = await createTask(taskData);
    setTasks((prev) => [data, ...prev]);
    return data;
  };

  const editTask = async (id, taskData) => {
    const { data } = await updateTask(id, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    return data;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const togglePin = async (task) => {
    return editTask(task._id, { pinned: !task.pinned });
  };

  const changeColor = async (task, color) => {
    return editTask(task._id, { color });
  };

  const changeStatus = async (task, status) => {
    return editTask(task._id, { status });
  };

  const changePriority = async (task, priority) => {
    return editTask(task._id, { priority });
  };

  const reorder = async (updates) => {
    await reorderTasks(updates);
    setTasks((prev) => {
      const ids = new Map(updates.map((u) => [u._id, u.order]));
      return prev.map((t) => (ids.has(t._id) ? { ...t, order: ids.get(t._id) } : t))
        .sort((a, b) => (a.pinned === b.pinned ? a.order - b.order : a.pinned ? -1 : 1));
    });
  };

  return { tasks, loading, filters, setFilters, fetchTasks, addTask, editTask, removeTask, togglePin, changeColor, changeStatus, changePriority, reorderTasks: reorder };
}
