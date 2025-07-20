import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Moved to top so it doesn’t get caught by /:assetId
router.get('/assigned', authenticate, async (req, res) => {
  const technicianId = req.user?.id;

  if (!technicianId) {
    return res.status(401).json({ error: 'Unauthorized: Technician not logged in' });
  }

  try {
    const assignedTasks = await prisma.aMCContract.findMany({
      where: { technicianId },
      include: { asset: true },
    });

    res.json(assignedTasks);
  } catch (err) {
    console.error('Error fetching assigned AMC tasks:', err);
    res.status(500).json({ error: 'Failed to fetch assigned AMC tasks' });
  }
});

// ✅ GET /api/amc/:assetId -> Get AMC Details
router.get('/:assetId', async (req, res) => {
  const { assetId } = req.params;

  try {
    const amc = await prisma.aMCContract.findUnique({
      where: { assetId },
    });

    if (!amc) return res.status(404).json({ error: 'AMC not found for this asset' });

    res.json(amc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST /api/amc/:assetId -> Create AMC
router.post('/:assetId', async (req, res) => {
  const { assetId } = req.params;
  const { vendor, startDate, endDate, itemsCovered, sla } = req.body;

  try {
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) return res.status(400).json({ error: 'Asset not found' });

    const existingAMC = await prisma.aMCContract.findUnique({ where: { assetId } });
    if (existingAMC) return res.status(400).json({ error: 'AMC already exists for this asset' });

    const amc = await prisma.aMCContract.create({
      data: {
        assetId,
        vendor,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        itemsCovered,
        sla,
        technicianId: asset.technicianId || null,  // 👈 assign from asset
      },
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { underAMC: true },
    });
    const amcStart = new Date(startDate); 
    const dueDate = new Date(amcStart);
    dueDate.setDate(dueDate.getDate() + 7); 
    await prisma.task.create({
      data: {
        title: 'Initial AMC Inspection',
        description: `Inspect asset ${asset.type} - ${asset.model} as part of AMC contract.`,
        assetId: asset.id,
        userId: asset.technicianId,     
        type: 'AMC',                     
        scheduledAt: new Date(),        
        status: 'PENDING',
        dueDate: dueDate              
      
      }
    });



    res.status(201).json({ message: 'AMC contract and task created successfully.', amc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ PATCH /api/amc/:amcId/status
router.patch('/:amcId/status', async (req, res) => {
  const { amcId } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.aMCContract.update({
      where: { id: amcId },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update status' });
  }
});

// ✅ PATCH /api/amc/:amcId/assign
router.patch('/:amcId/assign', async (req, res) => {
  const { amcId } = req.params;
  const { technicianId } = req.body;

  try {
    const updated = await prisma.aMCContract.update({
      where: { id: amcId },
      data: { technicianId },
    });

    res.json({ message: 'Technician assigned successfully', updated });
  } catch (err) {
    res.status(400).json({ error: 'Failed to assign technician' });
  }
});

export default router;
