/*
  Warnings:

  - You are about to drop the `ShortenedUrl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ShortenedUrl" DROP CONSTRAINT "ShortenedUrl_userId_fkey";

-- DropTable
DROP TABLE "public"."ShortenedUrl";

-- CreateTable
CREATE TABLE "public"."url" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortenedUrl" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,

    CONSTRAINT "url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_shortenedUrl_key" ON "public"."url"("shortenedUrl");

-- AddForeignKey
ALTER TABLE "public"."url" ADD CONSTRAINT "url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
