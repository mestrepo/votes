import { Teams, Members, VotedMembers, Sessions } from './collections'
import { USSDCode } from '../config'

const updateSession = (key, params) => {
  Sessions.update(
    {sessionId: key},
    {$set: params}
  )
}

const USSDResponse = (string) => {
  return [string, "Response", "xxx"]
}

const USSDRelease = (string) => {
  return [string, "Release", "xxx"]
}

const resolvers = {
  Query: {
    initiate(_, args) {
      console.log(args)
      /*
        Attempt getting session
        If session doesn't exist, create a record
        Fields:
          phoneNumber, sessionId, sequence,
          operator, dateCreated, message
      */
      let session = Sessions.findOne({ sessionId: args.sessionId, phoneNumber: args.phoneNumber })
      console.log(`Found session: ${session}`)
      if (!session) {
        session = Sessions.insert({
          phoneNumber: args.phoneNumber,
          sessionId: args.sessionId,
          sequence: args.sequence,
          operator: args.operator,
          message: args.message,
          dateCreated: new Date()
        })

        return USSDResponse('Welcome to the Kitchen App Challenge\n\n1. Join a team\n2. Vote for a team')

      } else {
        // If existing session's message is USSDCode string,
        // and current request sequence is 2
        // we can handle each menu item.
        console.log(`Sequence: ${args.sequence}, Previous message: ${session.message}, Incoming message: ${args.message}`)

        if (args.sequence === 2) {
          updateSession(args.sessionId, {
            sequence: args.sequence,
            message: args.message,
            menuOption: parseInt(args.message)
          })

          // Case 1 - previous message is USSD code string
          if (session.message === USSDCode) {
            // Menu item 1
            if (args.message === '1')
              return USSDResponse('Enter team number')

            // Menu item 2
            if (args.message == '2')
              return USSDResponse('Enter team number')
          }
        }

        if (args.sequence === 3) {
          updateSession(args.sessionId, {
            sequence: args.sequence, message: args.message
          })

          if (session.menuOption === 1) {
            let teamNumber = parseInt(args.message)
            const team = Teams.findOne({ number: teamNumber })
            if (!team)
              return USSDRelease(`Error. Team ${teamNumber} does not exist.`)

            const member = Members.findOne({ phoneNumber: args.phoneNumber })
            if (!member) {
              Members.insert({
                teamNumber: teamNumber,
                phoneNumber: args.phoneNumber
              })
              return USSDRelease(`Success! You just joined Team ${teamNumber}.`)
            } else {
              Members.update(
                { _id: member._id },
                { $set: { teamNumber: teamNumber }}
              )
              return USSDRelease(`Success! You just changed your team. You are now in Team ${teamNumber}.`)
            }
          }

          if (session.menuOption === 2)
            return USSDRelease(`Success! You voted for Team ${args.message}.`)
        }
      }
    },
    getTeams() {
      return Teams.find({}).fetch()
    }
  },
  Mutation: {
    joinTeam(_, args) {
      let team = Teams.findOne({ number: args.teamNumber })
      if (!Members.findOne({ phoneNumber: args.phoneNumber }))
        return Members.insert({ teamNumber: args.teamNumber, phoneNumber: args.phoneNumber })
      return 'You have already joined a team.'
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