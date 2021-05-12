// Import the PrismaClient from @prisma/client node module
const { PrismaClient } = require("@prisma/client")

// Instantiate PrismaClient
const prisma = new PrismaClient()

// Send queries to db
async function main() {
    try {
        const newLink = await prisma.link.create({
            data: {
                description: 'Fullstack tutorial for GraphQL',
                url: 'www.howtographql.com',
            },
        })
        const allLinks = await prisma.link.findMany()
        console.log(allLinks)
    } catch(err){
        console.log(err.message)
    }

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
