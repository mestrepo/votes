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
  teamOneCount() {
    const teamOne = Teams.findOne({"number": 1})
    const votes = teamOne.votes

    Meteor.call('votes.count', (err, result) => {
      if (result) {
        if (votes === 0) {
          Session.set('teamOneCount', 0)
        } else {
          Session.set('teamOneCount', votes / result[0].total * 100)
        }
      } else {
        console.log('Error getting vote count', err)
      }
    })
    return Session.get('teamOneCount')
  },
  teamTwoCount() {
    const teamTwo = Teams.findOne({"number": 2})
    const votes = teamTwo.votes

    Meteor.call('votes.count', (err, result) => {
      if (result) {
        if (votes === 0) {
          Session.set('teamTwoCount', 0)
        } else {
          Session.set('teamTwoCount', votes / result[0].total * 100)
        }
      } else {
        console.log('Error getting vote count', err)
      }
    })
    return Session.get('teamTwoCount')
  },
  teamThreeCount() {
    const teamThree = Teams.findOne({"number": 3})
    const votes = teamThree.votes
    console.log(votes)

    Meteor.call('votes.count', (err, result) => {
      if (result) {
        if (votes === 0) {
          Session.set('teamThreeCount', 0)
        } else {
          Session.set('teamThreeCount', votes / result[0].total * 100)
        }
      } else {
        console.log('Error getting vote count', err)
      }
    })
    return Session.get('teamThreeCount')
  }
})