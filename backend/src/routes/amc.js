const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /amc/:assetId
router.post('/:assetId', async (req, res) => {
  const { assetId } = req.params;
  const { vendor, startDate, endDate, itemsCovered, sla } = req.body;
  try {
    const amc = await prisma.aMC.create({
      data: {
        assetId,
        vendor,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        itemsCovered,
        sla
      }
    });
    await prisma.asset.update({
      where: { id: assetId },
      data: { underAMC: true }
    });
    res.json(amc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
