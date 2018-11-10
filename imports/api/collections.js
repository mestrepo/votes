import { Mongo } from 'meteor/mongo'

export const Teams = new Mongo.Collection('teams')
export const Members = new Mongo.Collection('members')
export const VotedMembers = new Mongo.Collection('votedmembers')

export const Sessions = new Mongo.Collection('sessions')