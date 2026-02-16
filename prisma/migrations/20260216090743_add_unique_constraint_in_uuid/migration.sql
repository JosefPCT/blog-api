/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_publicId_key" ON "Post"("publicId");
