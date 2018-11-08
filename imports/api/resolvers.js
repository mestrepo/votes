import { Teams } from './teams'

const resolvers = {
  Query: {
    getTeams() {
      return Teams.find({}).fetch()
    }
  },
  Mutation: {
    
  },
  Team: {
    
  }
}

export default resolvers