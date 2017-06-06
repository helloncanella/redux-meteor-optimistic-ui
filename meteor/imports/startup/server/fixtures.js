// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '../../api/links/links.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Links.find().count() === 0) { 
    const data = [
      {
        url: 'https://www.meteor.com/try',
      },
      {
        url: 'http://guide.meteor.com',
      },
      {
        url: 'https://docs.meteor.com',
      },
      {
        url: 'https://forums.meteor.com',
      },
    ];

    data.forEach(link => Links.insert(link));
  }
});
