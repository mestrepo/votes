import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    getTeams: [Team] 
  }
  type Mutation {
    joinTeam(phoneNumber: String!, teamNumber: Int!): String
    vote(teamNumber: Int!): Boolean
  }
  type Team {
    _id: String
    number: Int 
    votes: Int
  }
  type Member {
    _id: String
    teamNumber: Int
    phoneNumber: String
  }
`

export default typeDefs