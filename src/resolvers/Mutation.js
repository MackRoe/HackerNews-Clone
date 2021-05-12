const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10)

  // 2
  const user = await context.prisma.user.create({ data: { ...args, password } })

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 4
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  // encrypt the User’s password using the bcryptjs
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) {
    throw new Error('No such user found')
  }

  // Store new user record in db via prisma
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  // Generate JSON Web Token (JWT)
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

// resolver implementation for post
async function post(parent, args, context, info) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  })
  context.pubsub.publish("NEW_LINK", newLink)

  return newLink
}

async function vote(parent, args, context, info) {
  // validate the incoming JWT
  const userId = getUserId(context)

  // check if the vote already exists or not
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  })

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  // create a new Vote
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    }
  })
  context.pubsub.publish("NEW_VOTE", newVote)

  return newVote
}

module.exports = {
  signup,
  login,
  post,
  vote,
}
