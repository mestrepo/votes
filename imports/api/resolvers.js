import { Teams, Members, VotedMembers, Sessions } from './collections'

const resolvers = {
  Query: {
    initiate(_, args) {
      /*
        Attempt getting session
        If session doesn't exist, create a record
        Fields:
          phoneNumber, sessionId, sequence,
          operator, dateCreated
      */
      let session
      session = Sessions.findOne({ sessionId: args.sessionId })
      if (!session) {
        session = Sessions.insert({
          phoneNumber: args.phoneNumber,
          sessionId: args.sessionId,
          sequence: args.sequence,
          operator: args.operator,
          dateCreated: new Date()
        })
      }

      return [
        'Welcome to the Kitchen App Challenge\n\n1. Join a team\n2. Vote for a team',
        'Response',
        'xxx'
      ]
    },
    getTeams() {
      return Teams.find({}).fetch()
    }
  },
  Mutation: {
    joinTeam(_, args) {
      let team = Teams.findOne({ number: args.teamNumber })
      if (!Members.findOne({ phoneNumber: args.phoneNumber }))
        return Members.insert({ teamNumber: args.teamNumber, phoneNumber: args.phoneNumber })
      return 'You have already joined a team.'
    },
    vote(_, args) {
      let team = Teams.findOne({ number: args.teamNumber })
      let member = Members.findOne({ phoneNumber: args.phoneNumber })

      // Make sure a member cannot vote for their team
      if (member.teamNumber === team.number)
        return 'You cannot vote for your team'

      // Make sure a member cannot vote twice
      let votedMember = VotedMembers.findOne({ phoneNumber: args.phoneNumber })
      if (votedMember)
        return 'You cannot vote more than once'

      Teams.update(
        { number: args.teamNumber },
        { $inc: { votes: 1 } }
      )
      VotedMembers.insert({ phoneNumber: args.phoneNumber })
      return 'Success'
    }
  },
}

export default resolvers