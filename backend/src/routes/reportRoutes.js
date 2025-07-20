import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/upcoming-expiries', async (req, res) => {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  try {
    const assets = await prisma.asset.findMany({
      where: {
        OR: [
          { warrantyExpiry: { lte: in30Days } },
          { licenseExpiry: { lte: in30Days } }
        ]
      }
    });

    const parser = new Parser();
    const csv = parser.parse(assets);
    res.header('Content-Type', 'text/csv');
    res.attachment('upcoming-expiries.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
