const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a new task (admin only)
router.post('/', protect, admin, async (req, res) => {
  const { title, description, internIds, dueDate } = req.body;
  try {
    const progressArray = internIds.map(id => ({ intern: id, status: 'Not Started' }));
    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo: internIds,
      progress: progressArray
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Get tasks (admin: all, intern: assigned tasks)
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email collegeName')
        .populate({ path: 'comments.author', select: 'name' })
        .populate({ path: 'comments.replies.author', select: 'name' });
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate({ path: 'comments.author', select: 'name' })
        .populate({ path: 'comments.replies.author', select: 'name' });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.put('/:id/progress', protect, async (req, res) => {
  const { status, percentCompleted } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: 'Task not found' });
      
    // Find the progress entry for the current intern
    const progressEntry = task.progress.find(p => p.intern.toString() === req.user._id.toString());
    if (!progressEntry)
      return res.status(403).json({ message: 'Not assigned to this task' });
    
    if (status) progressEntry.status = status;
    
    if (percentCompleted !== undefined) {
      progressEntry.percentCompleted = percentCompleted;
      if (percentCompleted >= 100) {
        progressEntry.completedAt = new Date();
        progressEntry.status = 'Completed';
      } else {
        progressEntry.completedAt = null;
        progressEntry.status = 'In Progress';
      }
    }
    
    progressEntry.updatedAt = new Date();
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
});


// Update task details (admin only) – set editedOn timestamp
router.put('/:id', protect, admin, async (req, res) => {
  const { title, description, dueDate, internIds } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (internIds) {
      task.assignedTo = internIds;
      task.progress = internIds.map(id => ({ intern: id, status: 'Not Started' }));
    }
    task.editedOn = new Date();
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Add comment (both admin and intern)
router.post('/:id/comments', protect, async (req, res) => {
  const { text } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.comments.push({ author: req.user._id, text });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Admin reply to a comment (admin only)
router.post('/:id/comments/:commentId/reply', protect, admin, async (req, res) => {
  const { text } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const comment = task.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    comment.replies.push({ author: req.user._id, text });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error replying to comment' });
  }
});

module.exports = router;
