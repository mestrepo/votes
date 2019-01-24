import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'
import { Teams } from '../imports/api/collections'

import './main.html'

Template.info.helpers({
  voteCount() {
    Meteor.call('votes.count', (err, result) => {
      if (result) {
        Session.set('voteCount', result[0].total)
      } else {
        console.log('Error getting vote count', err)
      }
    })
    return Session.get('voteCount')
  },
})