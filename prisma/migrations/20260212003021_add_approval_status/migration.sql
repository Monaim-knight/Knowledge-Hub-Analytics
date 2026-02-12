-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "PostStatus" ADD VALUE 'PENDING_APPROVAL';

-- AlterTable
ALTER TABLE "dashboards" ADD COLUMN     "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "discussions" ADD COLUMN     "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';
