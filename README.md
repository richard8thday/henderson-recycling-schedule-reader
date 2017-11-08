# henderson-recycling-schedule-reader #

### Table of contents ###
* [What is this repository for?](#what-is-this-repository-for)
* [How do I get set up?](#how-do-i-get-set-up)
* [How do I integrate with Google Calendar?](#how-do-i-integrate-with-google-calendar)
* [Just give me the calendar already!](#just-give-me-the-calendar-already)
* [Who do I talk to?](#who-do-i-talk-to)

### What is this repository for? ###

The city of Henderson, TN has a website that displays its Recycling Program pickup schedule. Schedule information is only available as static text on the site, which makes it less than convenient to access—especially when you are walking out the door in the morning en route to work and can't remember if you need to put out the recycling bin. In addition, the page is updated periodically and historical data is lost.

This project is the first piece of making this information easier to digest. It scrapes the site and writes the resultant data to AWS DynamoDB for further processing. Once deployed, a Lambda script can be leveraged to run this automatically and keep the database up to date.

It also writes to [a public Google calendar that I have created for your convenience](https://calendar.google.com/calendar?cid=OGRsNW5vYTJiMG1oM2hub3F1M3BiMWE4b2NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)... you know, if you just want the data and don't care much about the AWS part.

Improvements I'd like to do:

* Make the calendar integration more robust, as it currently only adds new events. This leads to bad data:
	* Let's say the website has a pickup date of 11/10/2017 on the site today; the script runs and generates a new calendar event.
	* The next day the site is updated and the date that was previously 11/10/2017 is 11/09/2017; the script runs and generates a new calendar event.
	* Now we have two pickup dates on the calendar, at least one of which is incorrect.

### How do I get set up? ###

* What you need
    1. [Node.js](https://nodejs.org) v6.5.0 or later.
	    1. **Important note!** AWS Lambda currently only supports Node.js 4.3 and 6.10. **I recommend installing [6.10.2 LTS](https://nodejs.org/en/blog/release/v6.10.2/)** to reduce headache.
    2. [Serverless](https://www.serverless.com) v1.9.0 or later.
    3. An [AWS account](https://aws.amazon.com). A free tier is available.
    4. (Optional) A [Google Calendar integration](#how-do-i-integrate-with-google-calendar)
* What you do
    1. Set up your environment, referencing the [serverless quickstart documentation](https://serverless.com/framework/docs/providers/aws/guide/quick-start)
    2. Clone the repository
	    * ``` git clone https://github.com/richardleesimpson/henderson-recycling-schedule-reader.git ```
    3. From the directory, download dependencies with node
	    * ``` npm install ```
    5. Deploy the application to your AWS instance, which creates the resources you need to run the function
	    * ``` serverless deploy ```
    6. Verify that you can run the function
	    * ``` serverless invoke local --function getschedule ```
	7. (Optional) Set up an AWS Lambda trigger to run the function automatically.
	8. Celebrate. You have data now. Go forth and conquer!

### How do I integrate with Google Calendar? ###

Want to integrate with your own calendar? Don't bang your head against the wall like I did trying to figure it out. Follow these steps instead!

1. See [this handy tutorial](https://neal.codes/blog/google-calendar-api-on-g-suite/)  for setup.
2. Download your service account's private key and add it as **gcal/private_key.json**
3. Create a **gcal/config.json** file with the following format:
	* ``` { "calendar_id": "YOUR_CALENDAR_ID_HERE" } ```
4. Redeploy to your AWS instance. New calendar events should now be created when the process runs.

### Just give me the calendar already! ###

[As you wish.](https://calendar.google.com/calendar?cid=OGRsNW5vYTJiMG1oM2hub3F1M3BiMWE4b2NAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)

### Who do I talk to? ###

* [richardleesimpson@gmail.com](mailto:richardleesimpson@gmail.com)
