const google = require('googleapis');
const moment = require('moment');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const fs = require('fs');

const configfile = './config.json';
var calendarId;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const pkfile = './private_key.json';
var privatekey;

// If calendar integration is enabled, import the private key and auth
if (integrationEnabled()) {
	// Instantiate a JWT auth client for the service to use
	var jwtClient = new google.auth.JWT(
		privatekey.client_email,
		null,
		privatekey.private_key,
		SCOPES
	);
}

/**
 * Determine whether calendar integration is enabled
 */
function integrationEnabled() {
	try {
		// Import the private key
		privatekey = require(pkfile);

		// Import the config file
		calendarId = require(configfile).calendar_id;

		return true;
	}
	catch (e) {
		return false;
	}
}

/**
 * Ensures that the JWT auth client is authorized
 */
function checkAuthorization() {
	// If the JWT auth client does not have a gtoken, attempt to authenticate
	if (jwtClient.gtoken == undefined || jwtClient.gtoken == null) {
		// Authenticate request
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				console.log(err);
				return;
			} else {
				console.log("Successfully connected!");
			}
		});
	}
}

/**
 * Retrieve all events from the calendar
 */
var getAllEvents = async(function () {
	var events = [];
	var pageToken = null;

	while (true) {
		// Get events
		var response = await (getEvents(pageToken));

		// Add events to array
		for (let event of response.items) {
			events.push(event);
		}

		// Retrieve the next page token
		pageToken = response.nextPageToken;

		// If this is the last page, break the array
		if (pageToken == undefined) {
			break;
		}
	}

	return events;
});

/**
 * Retrieve all events from a certain page of the calendar.
 *
 * @param {string} pageToken A token specifying which result page to return.
 */
var getEvents = async(function (pageToken) {
	return new Promise(function (fulfill, reject) {
		google.calendar('v3').events.list({
			auth: jwtClient,
			calendarId: calendarId,
			pageToken: pageToken
		}, function(err, response) {
			if (err) {
				reject(err);
			}

			fulfill(response);
		});
	});
});

/**
 * Create an all-day event on the calendar.
 *
 * @param {string} date A date string.
 */
var createEvent = async(function (date) {
	return new Promise(function (fulfill, reject) {
		// Check authorization
		checkAuthorization();

		// Insert new event
		google.calendar('v3').events.insert({
			auth: jwtClient,
			calendarId: calendarId,
			resource: {
				'summary': 'Recycling Pickup',
				'description': 'The City of Henderson started a Recycling Program within the city limits on September 9th, 2011. The city collects aluminum cans, plastic bottles, paper and cardboard in plastic bags issued by the city as part of this program. These items are delivered by the City to the Chester County Recycling Center for recycling.',
				'location': 'Henderson, TN 38340, USA',
				'start': {
					'date': date,
				},
				'end': {
					'date': date,
				},
				'reminders': {
					'useDefault': true,
				},
			},
		}, function(err, response) {
			if (err) {
				reject(err);
			}

			fulfill(response);
		});
	});
});

/**
 * Delete an event from the calendar.
 *
 * @param {string} eventId The event identifier.
 */
var deleteEvent = async(function (eventId) {
	return new Promise(function (fulfill, reject) {
		// Check authorization
		checkAuthorization();

		// Delete event
		google.calendar('v3').events.delete({
			auth: jwtClient,
			calendarId: calendarId,
			eventId: eventId
		}, function(err, response) {
			if (err) {
				reject(err);
			}

			fulfill(response);
		});
	});
});

/**
 * Add new events to the calendar
 *
 * @param {array} events An array of dates to create events for.
 */
var syncEvents = async (function (events) {
	// If calendar integration is not enabled, return
	if (!integrationEnabled()) {
		return "Calendar integration is disabled. To enable, add the private_key.json and config.json files to the directory. See the README for more information.";
	}

	// Get existing events
	let existingEvents = await (getAllEvents());
	let newEvents = [];

	// Iterate over events to sync
	events.forEach((object, index, array) => {
		// Sanitize date format
		let date = moment(array[index]).format('YYYY-MM-DD');

		// Search for existing dates
		let match = existingEvents.find(event => event.start.date === date);

		// If it does not already exist, add it
		if (match === undefined) {
			newEvents.push(date);
		}
	});
	
	// Create new events
	await (createEvents(newEvents));
});

/**
 * Add new events to the calendar
 *
 * @param {array} events An array of dates to create events for.
 */
var createEvents = async (function (events) {
	return await (Promise.all(events.map(async ((event) => {
		await (createEvent(event));
	}))));
});

/**
 * Clear all events from the calendar
 */
var clearEvents = async (function () {
	let events = await (getAllEvents());

	await (Promise.all(events.map(async ((event) => {
		await (deleteEvent(event.id));
	}))));
});

module.exports = {
	syncEvents
};