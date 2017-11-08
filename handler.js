'use strict';
const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { extractPickupsFromHTML } = require('./helpers');
const gcal = require('./gcal/service.js');

module.exports.getschedule = (event, context, callback) => {
  let pickups;

  // Request html page contents
  request('http://www.hendersontn.org/recycling/recycling.html')
    // Parse contents and retrieve pickups
    .then(({ data }) => {
      pickups = extractPickupsFromHTML(data);
    })
    // Write to dynamo
    .then(() => {
      // Save schedule to Amazon DynamoDB
      return dynamo.put({
        TableName: 'hendersonRecyclingSchedule',
        Item: {
          scheduleId: new Date().toString(),
          pickups: pickups
        }
      }).promise();
    })
    .then(() => {
      // Sync the schedule with a Google calendar
      gcal.syncEvents(pickups);
    })
    // Write to the console
    .then(() => {
      callback(null, { pickups: pickups });
    })
    .catch(callback);
};