import { Router } from 'express';
import { WorkspaceService } from '../services/workspace.service.js';

const router = Router();

// Get workspace info
router.get('/info', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const info = await workspaceService.getWorkspaceInfo();
    res.json({ success: true, info });
  } catch (error) {
    console.error('Error getting workspace info:', error);
    res.status(500).json({ success: false, error: 'Failed to get workspace info' });
  }
});

// Get scratchpad content
router.get('/scratchpad', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const content = await workspaceService.getScratchpad();
    res.json({ success: true, content });
  } catch (error) {
    console.error('Error getting scratchpad:', error);
    res.status(500).json({ success: false, error: 'Failed to get scratchpad' });
  }
});

// Update scratchpad content
router.put('/scratchpad', async (req, res) => {
  try {
    const { content } = req.body;
    const workspaceService = new WorkspaceService();
    await workspaceService.saveScratchpad(content);
    res.json({ success: true, message: 'Scratchpad saved' });
  } catch (error) {
    console.error('Error saving scratchpad:', error);
    res.status(500).json({ success: false, error: 'Failed to save scratchpad' });
  }
});

export { router as workspaceRoutes };
