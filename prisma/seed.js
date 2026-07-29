// const prisma = require("../../config/prisma.js");
const prisma = require("../src/config/prisma.js");

async function main(){
  const dani = await prisma.user.upsert({
    where: { email: 'dani@gmail.com' },
    update: {},
    create:{
      email: 'dani@gmail.com',
      firstName: 'Dani',
      lastName: 'Robles'
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1)
  });