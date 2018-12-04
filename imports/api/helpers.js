import { Sessions } from './sessions'

export const USSDRelease = string =>
  [string, "Release"]

export const USSDResponse = (string, clientState) =>
  [string, "Response", clientState]

export const updateSession = (key, params) =>
  Sessions.update({sessionId: key}, {$set: params})

export const getAndUpdateSession = (
  sessionId, sequence, message) => {
  // Get session
  const session = Sessions.findOne({
    sessionId: sessionId
  })

  // Set menuOption in session if it hasn't already been set
  if (!session.menuOption) {
    updateSession(sessionId, {
      menuOption: parseInt(message)
    })
  }

  // Update session
  updateSession(sessionId, {
    sequence: sequence, message: message
  })

  return session
}