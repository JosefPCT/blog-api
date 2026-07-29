// const prisma = require("../../config/prisma.js");
const prisma = require("../src/config/prisma.js");
// const passwordUtils = require('../../utils/passwordUtils.js');
const passwordUtils = require('../src/utils/passwordUtils.js')

async function main(){

  const adminPassword = "admin"
  const hashedAdminPassword = passwordUtils.generatePassword(adminPassword);

  const dani = await prisma.user.upsert({
    where: { email: 'dani@gmail.com' },
    update: {},
    create:{
      email: 'dani@gmail.com',
      firstName: 'Dani',
      lastName: 'Robles',
      hash: hashedAdminPassword,
      isAuthor: true,
      isAdmin: true
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