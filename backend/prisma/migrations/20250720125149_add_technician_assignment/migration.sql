-- AlterTable
ALTER TABLE "AMCContract" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "technicianId" TEXT;
