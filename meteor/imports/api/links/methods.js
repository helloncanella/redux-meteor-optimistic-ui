// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Links } from './links.js';

Meteor.methods({
  'links.insert'({url}) {
    check(url, String);

    return Links.insert({
      url,
      changedAt: new Date(),
    });
  },

  // 'links.update'({id}){
  //   return Links.update({_id: id}, {changedAt: new Date()})
  // }

  // 'links.remove'({id}){
  //   return Links.remove()
  // }
});
