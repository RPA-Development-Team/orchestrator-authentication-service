import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const basic = await prisma.license.create({
    data: {
        title: "Basic",
        maxTenants: 5,
        maxPackages: 50
    },
  });

  const advanced = await prisma.license.create({
    data: {
        title: "Advanced",
        maxTenants: 15,
        maxPackages: 200
    },
  });

  const ultimate = await prisma.license.create({
    data: {
        title: "Ultimate",
        maxTenants: 50,
        maxPackages: 1000
    },
  });

  console.log(basic, advanced, ultimate);
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
