'use strict';
const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { extractPickupsFromHTML } = require('./helpers');

module.exports.getschedule = (event, context, callback) => {
  let pickups;

  request('http://www.hendersontn.org/recycling/recycling.html')
    .then(({ data }) => {
      pickups = extractPickupsFromHTML(data);
    })
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
    .then(() => {
      callback(null, { pickups: pickups });
    })
    .catch(callback);
};