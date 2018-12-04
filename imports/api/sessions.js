import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Sessions = new Mongo.Collection('sessions')

Meteor.methods({
  'sessions.insert'(args) {
    check(args.phoneNumber, String)
    check(args.sessionId, String)
    check(args.sequence, Number)
    check(args.operator, String)
    check(args.message, String)

    const session = Object.assign(args, {
      dateCreated: new Date()
    })

    Sessions.insert(session)
  }
})