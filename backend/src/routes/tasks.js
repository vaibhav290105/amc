import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /tasks/my – fetch tasks assigned to the logged-in technician
router.get('/my', async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== 'TECHNICIAN') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: userId },
      include: { asset: true },
    });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// PUT /tasks/:id/update – update task status and remarks
router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
        remarks,
      },
    });

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

export default router;
