const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');


// Resolvers
const resolvers = {
  // Query: {
  //   info: () => `This is the API of a Hackernews Clone`,
  //   feed: async (parent, args, context) => {
  //       return context.prisma.link.findMany()
  //   },
  // },
  //   Mutation: {
  //       post: (parent, args, context, info) => {
  //           const newLink = context.prisma.link.create({
  //               data: {
  //                   url: args.url,
  //                   description: args.description,
  //               },
  //           })
  //
  //       return newLink
  //   },
  // },
  Query,
  Mutation,
  User,
  Link
}

// Start Server
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
        ...req,
        prisma,
        userId:
          req && req.headers.authorization
            ? getUserId(req)
            : null
    };
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
