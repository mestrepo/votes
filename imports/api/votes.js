import { Meteor } from 'meteor/meteor'

import { Teams } from './collections'

Meteor.methods({
  'votes.count'() {
    // Calling aggregate on collections is made possible
    // by meteorhacks:aggregate
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