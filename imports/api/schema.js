import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    initiate(
      sequence: Int,
      phoneNumber: String,
      sessionId: String,
      serviceCode: String,
      operator: String,
      message: String,
      clientState: Boolean,
      type: String,
    ): [String]
    getTeams: [Team] 
  }
  type Mutation {
    joinTeam(phoneNumber: String!, teamNumber: Int!): String
    vote(phoneNumber: String!, teamNumber: Int!): String
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