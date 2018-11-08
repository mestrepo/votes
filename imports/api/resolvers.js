import { Teams } from './tasks'

const resolvers = {
  Query: {
    getTeams() {
      return Teams.findAll() 
    }
  },
  Mutation: {
    
  },
  Team: {
    
  }
}

export default resolvers