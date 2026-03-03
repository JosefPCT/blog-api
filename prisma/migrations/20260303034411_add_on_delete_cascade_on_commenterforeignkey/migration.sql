-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_commenter_id_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_commenter_id_fkey" FOREIGN KEY ("commenter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
