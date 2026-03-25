import { Router } from 'express';
import { WorkspaceService } from '../services/workspace.service.js';

const router = Router();

// Get all todos (from tasks.md)
router.get('/', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const tasks = await workspaceService.getTasks();
    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ success: false, error: 'Failed to get todos' });
  }
});

// Get backlog
router.get('/backlog', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const backlog = await workspaceService.getBacklog();
    res.json({ success: true, backlog });
  } catch (error) {
    console.error('Error getting backlog:', error);
    res.status(500).json({ success: false, error: 'Failed to get backlog' });
  }
});

// Get progress log (raw)
router.get('/progress', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const progress = await workspaceService.getProgressLog();
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ success: false, error: 'Failed to get progress' });
  }
});

// Get progress log (parsed with date filtering)
router.get('/progress/parsed', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const result = await workspaceService.getProgressLogParsed();
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error getting parsed progress:', error);
    res.status(500).json({ success: false, error: 'Failed to get parsed progress' });
  }
});

// Update a todo (toggle complete)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, text, starred } = req.body;
    
    const workspaceService = new WorkspaceService();
    const updated = await workspaceService.updateTask(id, { completed, text, starred });
    
    if (updated) {
      res.json({ success: true, message: 'Todo updated' });
    } else {
      res.status(404).json({ success: false, error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, error: 'Failed to update todo' });
  }
});

// Toggle star on a todo
router.patch('/:id/star', async (req, res) => {
  try {
    const { id } = req.params;
    
    const workspaceService = new WorkspaceService();
    const updated = await workspaceService.toggleTaskStar(id);
    
    if (updated) {
      res.json({ success: true, message: 'Star toggled' });
    } else {
      res.status(404).json({ success: false, error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle star' });
  }
});

// Add a new todo
router.post('/', async (req, res) => {
  try {
    const { text, priority, section } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    
    const workspaceService = new WorkspaceService();
    const task = await workspaceService.addTask({ text, priority, section });
    
    res.json({ success: true, task });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ success: false, error: 'Failed to create todo' });
  }
});

// Promote a task from backlog to todos
router.post('/promote/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const workspaceService = new WorkspaceService();
    const task = await workspaceService.promoteFromBacklog(id);
    
    if (task) {
      res.json({ success: true, task });
    } else {
      res.status(404).json({ success: false, error: 'Task not found in backlog' });
    }
  } catch (error) {
    console.error('Error promoting task:', error);
    res.status(500).json({ success: false, error: 'Failed to promote task' });
  }
});

// ============ NOTES ROUTES ============

// Get all notes
router.get('/notes', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const notes = await workspaceService.getNotes();
    res.json({ success: true, notes });
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({ success: false, error: 'Failed to get notes' });
  }
});

// Get notes for a specific task
router.get('/notes/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const workspaceService = new WorkspaceService();
    const notes = await workspaceService.getNotesForTask(taskId);
    res.json({ success: true, notes });
  } catch (error) {
    console.error('Error getting task notes:', error);
    res.status(500).json({ success: false, error: 'Failed to get task notes' });
  }
});

// Add a note to a task
router.post('/notes/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskText, note } = req.body;
    
    if (!note) {
      return res.status(400).json({ success: false, error: 'Note is required' });
    }
    
    const workspaceService = new WorkspaceService();
    await workspaceService.addNoteToTask(taskId, taskText || '', note);
    
    res.json({ success: true, message: 'Note added' });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ success: false, error: 'Failed to add note' });
  }
});

export { router as todosRoutes };
