const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ジャンルデータの作成
  // ジャンルデータが存在しない場合は、デフォルトデータを保存する。
  const genresCount = await prisma.genre.count();
  if(genresCount === 0) {
    await prisma.genre.createMany({
      data: [
        { name: "sample1" },
        { name: "sample2" },
      ],
    });
  }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })