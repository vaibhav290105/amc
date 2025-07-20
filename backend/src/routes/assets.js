import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// Create Asset
router.post('/', authenticate, authorize('ADMIN', 'ASSET_MANAGER'), async (req, res) => {
  const asset = await prisma.asset.create({ data: req.body });
  res.json(asset);
});

// List all assets
router.get('/', authenticate, async (req, res) => {
  const assets = await prisma.asset.findMany({ include: { technician: true, amc: true } });
  res.json(assets);
});

// Update status by technician
router.patch('/:id/status', authenticate, authorize('TECHNICIAN'), async (req, res) => {
  const { status, remarks } = req.body;
  await prisma.task.update({
    where: { id: req.params.id },
    data: { status, remarks }
  });
  res.sendStatus(204);
});

// Get single asset by ID
router.get('/:id', async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({ where: { id: req.params.id } });
    res.json(asset);
  } catch {
    res.status(404).json({ error: 'Asset not found' });
  }
});

// Update asset by ID
router.put('/:id', async (req, res) => {
  try {
    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update asset' });
  }
});


export default router;
