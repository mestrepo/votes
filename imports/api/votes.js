import { Meteor } from 'meteor/meteor'

import { Teams } from './collections'

Meteor.methods({
  'votes.count'() {
    return Teams.aggregate({
      $group: { 
        _id: null, 
        total: { 
          $sum: "$votes" 
        }
      } 
    })
    .toArray()
  },
})