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
      clientState: String,
      type: String,
    ): [String]
    getTeams: [Team] 
  }
  type Mutation {
    joinTeam(
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
  type Member {
    _id: String
    teamNumber: Int
    phoneNumber: String
  }
`

export default typeDefs