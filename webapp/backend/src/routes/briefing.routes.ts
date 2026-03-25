import { Router } from 'express';
import { WorkspaceService } from '../services/workspace.service.js';

const router = Router();

// Get last generated briefing (from markdown files)
router.get('/latest', async (req, res) => {
  try {
    const workspaceService = new WorkspaceService();
    const briefing = await workspaceService.getLatestBriefing();

    if (briefing) {
      res.json({
        success: true,
        briefing,
      });
    } else {
      res.json({
        success: true,
        briefing: null,
        message: 'Nenhum briefing encontrado. Peca ao Claude para gerar o Morning Briefing no Cursor.',
      });
    }
  } catch (error) {
    console.error('Error getting latest briefing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get latest briefing',
    });
  }
});

// Get briefing by date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const workspaceService = new WorkspaceService();
    const briefing = await workspaceService.getBriefingByDate(date);

    if (briefing) {
      res.json({
        success: true,
        briefing,
      });
    } else {
      res.json({
        success: true,
        briefing: null,
        message: `Nenhum briefing encontrado para ${date}`,
      });
    }
  } catch (error) {
    console.error('Error getting briefing by date:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get briefing',
    });
  }
});

export { router as briefingRoutes };
