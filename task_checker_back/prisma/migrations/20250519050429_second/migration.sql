-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
