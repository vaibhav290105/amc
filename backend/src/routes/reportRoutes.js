const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Parser } = require('json2csv');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/upcoming-expiries', async (req, res) => {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

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
});

module.exports = router;
