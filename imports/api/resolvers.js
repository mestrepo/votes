import { Teams, Members, VotedMembers } from './collections'

const resolvers = {
  Query: {
    getTeams() {
      return Teams.find({}).fetch()
    }
  },
  Mutation: {
    joinTeam(_, args) {
      let team = Teams.findOne({ number: args.teamNumber })
      return Members.insert({ teamNumber: args.teamNumber, phoneNumber: args.phoneNumber })
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