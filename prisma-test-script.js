const prisma = require('./lib/prisma.js');

async function main(){
  // Create new user
  const user = await prisma.user.create({
    data: {
        email: 'alice@gmail.com',
        firstName: 'Alice',
        lastName: 'Bora',
        hash: 'randomhash123',
        isAuthor: false,
    }
  });
  console.log('Create user', user);

  // Fetch users
  const allUsers = await prisma.user.findMany();
  console.log('All users:', JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })