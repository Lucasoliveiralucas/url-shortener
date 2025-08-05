/*
  Warnings:

  - The `deleted` column on the `url` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."url" DROP COLUMN "deleted",
ADD COLUMN     "deleted" TIMESTAMP(3);
