/*
  Warnings:

  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - The required column `public_id` was added to the `posts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- DropIndex
DROP INDEX "posts_publicId_key";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorId",
DROP COLUMN "createdAt",
DROP COLUMN "publicId",
DROP COLUMN "updatedAt",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "public_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE UNIQUE INDEX "posts_public_id_key" ON "posts"("public_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
