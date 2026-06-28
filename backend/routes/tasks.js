import { Router } from 'express';
import Task from '../models/Task.js';
import { validateTask, validateId } from '../middleware/validation.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sort } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { pinned: -1, order: 1, createdAt: -1 };
    if (sort === 'priority') sortOption = { pinned: -1, priority: -1, order: 1, createdAt: -1 };
    if (sort === 'createdAt') sortOption = { pinned: -1, createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.put('/reorder', async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ error: 'tasks must be an array' });

    const ops = tasks.map(({ _id, order }) => ({
      updateOne: { filter: { _id }, update: { $set: { order } } },
    }));
    await Task.bulkWrite(ops);
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder' });
  }
});

router.post('/', validateTask, async (req, res) => {
  try {
    const max = await Task.findOne().sort({ order: -1 }).select('order');
    const task = await Task.create({ ...req.body, order: (max?.order ?? 0) + 1 });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', validateId, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', validateId, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
