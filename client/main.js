import { Template } from 'meteor/templating'
import { Teams, Members, VotedMembers } from '../imports/api/collections'

import './main.html'

Template.info.helpers({
  teamCount() {
    return Teams.find().count()
  },
  memberCount() {
    return Members.find().count()
  },
  teams() {
    return Teams.find()
  }
})