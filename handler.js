'use strict';
const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { extractPickupsFromHTML } = require('./helpers');

module.exports.getschedule = (event, context, callback) => {
  let pickups;

  // Request html page contents
  request('http://www.hendersontn.org/recycling/recycling.html')
    // Parse contents and retrieve pickups
    .then(({ data }) => {
      pickups = extractPickupsFromHTML(data);
    })
    /*
    // TODO: Read from dynamo, compare, and determine what should happen with new/updated data
    .then(() => {
      // Get existing schedules

      // Compare pickup dates

      // TODO: Figure out what to do with mismatched data
    })
    */
    // Write to dynamo
    .then(() => {
      // Save schedule
      return dynamo.put({
        TableName: 'hendersonRecyclingSchedule',
        Item: {
          scheduleId: new Date().toString(),
          pickups: pickups
        }
      }).promise();
    })
    // Write to the console
    .then(() => {
      callback(null, { pickups: pickups });
    })
    .catch(callback);
};