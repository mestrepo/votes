import { Teams, Members, VotedMembers, Sessions } from './collections'
import { USSDCode } from '../config'

const USSDRelease = string => [string, "Release"]
const USSDResponse = (string, clientState) => [string, "Response", clientState]
const updateSession = (key, params) => Sessions.update({sessionId: key}, {$set: params})

const getAndUpdateSession = (sessionId, sequence, message) => {
  // Get session
  const session = Sessions.findOne({ sessionId: sessionId })

  // Set menuOption in session if it hasn't already been set
  if (!session.menuOption) {
    updateSession(sessionId, { menuOption: parseInt(message) })
  }

  // Update session
  updateSession(sessionId, { sequence: sequence, message: message })

  return session
}

const resolvers = {
  Query: {
    initiate(_, args) {
      console.log(args)

      // New sessions always start here
      const session = Sessions.insert({
        phoneNumber: args.phoneNumber,
        sessionId: args.sessionId,
        sequence: args.sequence,
        operator: args.operator,
        message: args.message,
        dateCreated: new Date()
      })

      return USSDResponse(
        'Welcome to the Kitchen App Challenge\n\n1. Join a team\n2. Vote for a team',
        ''
      )
    },
    getTeams() {
      return Teams.find({}).fetch()
    }
  },
  Mutation: {
    joinTeam(_, args) {
      console.log(args)

      const message = args.message
      const session = getAndUpdateSession(args.sessionId, args.sequence, args.message)

      if (args.sequence === 2) {
        // Validate current message
        if (message !== '1')
          return USSDRelease('Invalid option.')

        // Return response.
        // We are sending current message to Hubtel as ClientState
        // we will use this as menu option for subsequent requests.
        return USSDResponse('Enter team number', message)
      }

      // Join team
      if (args.sequence === 3) {
        updateSession(args.sessionId, {
          sequence: args.sequence, message: args.message
        })

        const member = Members.findOne({ phoneNumber: args.phoneNumber })
        const teamNumber = parseInt(args.message)
        const team = Teams.findOne({ number: teamNumber })

        if (!team)
          return USSDRelease(`Error. Team ${teamNumber} does not exist.`)

        // If member doesn't exist, add member to team
        if (!member) {
          Members.insert({
            teamNumber: teamNumber,
            phoneNumber: args.phoneNumber
          })
          return USSDRelease(`Success! You just joined Team ${teamNumber}.`)
        }

        // Else, change member's team
        Members.update(
          { _id: member._id },
          { $set: { teamNumber: teamNumber }}
        )
        return USSDRelease(`Success! You just changed your team. You are now in Team ${teamNumber}.`)
      }
    },
    vote(_, args) {
      console.log(args)

      const message = args.message
      const session = getAndUpdateSession(args.sessionId, args.sequence, args.message)
      
      // Check whether member exists
      const member = Members.findOne({ teamNumber: args.phoneNumber })
      if (!member)
        return USSDRelease('You need to join a team first.')

      if (args.sequence === 2)
        return USSDResponse('Enter team number', message)

      if (args.sequence === 3) {
        const member = Members.findOne({ phoneNumber: args.phoneNumber })
        const teamNumber = parseInt(args.message)
        const team = Teams.findOne({ number: teamNumber })

        // Make sure a member cannot vote for their team
        if (member.teamNumber === team.number)
          return USSDRelease('You cannot vote for your team.')

        // Make sure a member cannot vote twice
        const votedMember = VotedMembers.findOne({ phoneNumber: args.phoneNumber })
        if (votedMember)
          return USSDRelease('You cannot vote more than once.')

        Teams.update(
          { number: teamNumber },
          { $inc: { votes: 1 } }
        )
        VotedMembers.insert({ phoneNumber: args.phoneNumber, teamNumber: teamNumber })
        return USSDRelease(`Success! You just voted for Team ${teamNumber}.`)
      }
    }
  },
}

export default resolvers