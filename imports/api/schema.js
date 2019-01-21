import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    getTeams: [Team] 
  }
  type Mutation {
    initiate(
      sequence: Int,
      phoneNumber: String,
      sessionId: String,
      serviceCode: String,
      operator: String,
      message: String,
      clientState: String,
      type: String,
    ): [String]
    vote(
      sequence: Int,
      phoneNumber: String,
      sessionId: String,
      serviceCode: String,
      operator: String,
      message: String,
      clientState: String,
      type: String,
    ): [String]
  }
  type Team {
    _id: String
    number: Int 
    votes: Int
  }
`

export default typeDefs