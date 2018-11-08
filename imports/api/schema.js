import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    getTeams: [Team] 
  }
  type Mutation {
    joinTeam(phoneNumber: String!): Boolean
    vote(teamNumber: Int!): Boolean
  }
  type Team {
    _id: String
    number: Int 
    votes: Int
  }
`

export default typeDefs