/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isPublished",
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false;
