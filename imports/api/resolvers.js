import { Teams, Members } from './collections'

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
    }
  },
  Team: {
    
  }
}

export default resolvers