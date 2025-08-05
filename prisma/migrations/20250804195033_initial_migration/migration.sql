-- CreateTable
CREATE TABLE "public"."ShortenedUrl" (
    "id" SERIAL NOT NULL,
    "original_url" TEXT NOT NULL,
    "shortenedurl" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ShortenedUrl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ShortenedUrl" ADD CONSTRAINT "ShortenedUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
