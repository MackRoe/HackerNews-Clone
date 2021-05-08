const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


// Resolvers
// let idCount = links.length
const resolvers = {
  Query: {
    info: () => null,
    feed: async (parent, args, context) => {
        return context.prisma.link.findMany()
    }
},
Mutation: {
    post: (parent, args, context, info) => {
        const newLink = context.prisma.link.create({
            data: {
                url: args.url,
                description: args.description,
            },
        })

        return newLink
    },
  },
}

// Start Server
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
  ),
  resolvers,
  context: {
      prisma,
  }
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
