import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Create Asset
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'ASSET_MANAGER'),
  async (req, res) => {
    try {
      const {
        technicianId,
        installationDate,
        warrantyExpiry,
        licenseExpiry,
        ...rest
      } = req.body;

      // Validate technicianId if provided
      if (technicianId) {
        const tech = await prisma.user.findUnique({ where: { id: technicianId } });
        if (!tech || tech.role !== 'TECHNICIAN') {
          return res.status(400).json({ error: 'Invalid technician ID or role' });
        }
      }

      const asset = await prisma.asset.create({
        data: {
          ...rest,
          technicianId: technicianId || null,
          installationDate: new Date(installationDate),
          warrantyExpiry: new Date(warrantyExpiry),
          licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        },
      });

      res.status(201).json(asset);
    } catch (err) {
      console.error('Create Asset Error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);



// List all assets
router.get('/', authenticate, async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: { technician: true, amc: true },
    });
    res.json(assets);
  } catch (err) {
    console.error('Fetch Assets Error:', err);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Update status by technician
router.patch(
  '/:id/status',
  authenticate,
  authorize('TECHNICIAN'),
  async (req, res) => {
    const { status, remarks } = req.body;
    try {
      await prisma.task.update({
        where: { id: req.params.id },
        data: { status, remarks },
      });
      res.sendStatus(204);
    } catch (err) {
      console.error('Update Task Status Error:', err);
      res.status(400).json({ error: 'Failed to update task status' });
    }
  }
);

// Get single asset by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
    });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    console.error('Fetch Single Asset Error:', err);
    res.status(500).json({ error: 'Failed to retrieve asset' });
  }
});


router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      technicianId,
      installationDate,
      warrantyExpiry,
      licenseExpiry,
      ...rest
    } = req.body;

    // Validate technicianId if provided
    if (technicianId) {
      const tech = await prisma.user.findUnique({ where: { id: technicianId } });
      if (!tech || tech.role !== 'TECHNICIAN') {
        return res.status(400).json({ error: 'Invalid technician ID or role' });
      }
    }

    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        technicianId: technicianId || null,
        installationDate: new Date(installationDate),
        warrantyExpiry: new Date(warrantyExpiry),
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
      },
    });

    res.json(asset);
  } catch (err) {
    console.error('Update Asset Error:', err);
    res.status(400).json({ error: err.message });
  }
});


export default router;

