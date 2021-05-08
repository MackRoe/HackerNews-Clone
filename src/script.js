// Import the PrismaClient from @prisma/client node module
const { PrismaClient } = require("@prisma/client")

// Instantiate PrismaClient
const prisma = new PrismaClient()

// Send queries to db
async function main() {
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
}

// Catch errors and close db when script terminates
main()
  .catch(e => {
    throw e
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect()
  })
