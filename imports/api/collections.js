import { Mongo } from 'meteor/mongo'

export const Teams = new Mongo.Collection('teams')
export const Voted = new Mongo.Collection('voted')